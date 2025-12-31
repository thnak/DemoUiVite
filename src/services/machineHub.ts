import * as signalR from '@microsoft/signalr';

// ----------------------------------------------------------------------

export enum MachineRunState {
  Running = 0,
  SpeedLoss = 1,
  Downtime = 2,
}

export interface MachineRunStateTimeBlock {
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
  state: MachineRunState;
}

export interface MachineRuntimeBlock {
  startTime: string; // ISO 8601 date string
  endTime: string | null; // ISO 8601 date string, null for ongoing blocks
  stopReasonId: string; // ObjectId in string format, empty for normal operation
  name: string; // Stop reason name or runtime block name
  color: string; // Color code for visualization
  isUnplannedDowntime: boolean; // True if this is an unplanned stop
  state: MachineRunState; // Current run state
}

export interface MachineOeeUpdate {
  machineName: string; // Name of the machine
  availability: number; // Percentage (0-1)
  availabilityVsLastPeriod: number; // Percentage points difference
  performance: number; // Percentage (0-1)
  performanceVsLastPeriod: number; // Percentage points difference
  quality: number; // Percentage (0-1)
  qualityVsLastPeriod: number; // Percentage points difference
  oee: number; // Percentage (0-1) - Overall Equipment Effectiveness
  oeeVsLastPeriod: number; // Percentage points difference
  goodCount: number; // Count of good products produced
  goodCountVsLastPeriod: number; // Count difference
  totalCount: number; // Total count of products produced
  totalCountVsLastPeriod: number; // Count difference
  plannedProductionTime: string; // ISO 8601 duration (e.g., "PT8H")
  runTime: string; // ISO 8601 duration (e.g., "PT7H30M")
  downtime: string; // ISO 8601 duration (e.g., "PT30M")
  speedLossTime: string; // ISO 8601 duration (e.g., "PT15M")
  currentProductName: string; // Name of current product
  runStateHistory: MachineRunStateTimeBlock[]; // History of run states
}

export interface MachineAggregation {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  goodCount: number;
  totalCount: number;
  totalRunTime: string; // ISO 8601 duration
  totalDowntime: string; // ISO 8601 duration
  totalSpeedLossTime: string; // ISO 8601 duration
  lastUpdated: string; // ISO 8601 date string
}

export class MachineHubService {
  private connection: signalR.HubConnection;

  private callbacks: Map<string, (update: MachineOeeUpdate) => void> = new Map();

  private runtimeBlockCallbacks: Map<string, (block: MachineRuntimeBlock) => void> = new Map();

  constructor(baseUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/machine`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register the MachineUpdate event handler (OEE metrics)
    this.connection.on('MachineUpdate', (update: MachineOeeUpdate) => {
      console.log('Machine OEE update received:', update);
      // Call the callback for this specific machine
      const callback = this.callbacks.get(update.machineName);
      if (callback) {
        callback(update);
      }
    });

    // Register the MachineRuntimeUpdateLastBlock event handler (runtime blocks)
    this.connection.on('MachineRuntimeUpdateLastBlock', (block: MachineRuntimeBlock) => {
      console.log('Machine runtime block update received:', block);
      // Broadcast to all runtime block callbacks
      this.runtimeBlockCallbacks.forEach((callback) => callback(block));
    });
  }

  async start(): Promise<void> {
    try {
      if (this.connection.state === 'Disconnected') {
        await this.connection.start();
        console.log('MachineHub connected');
      }
    } catch (err) {
      console.error('Error connecting to MachineHub:', err);
    }
  }

  async stop(): Promise<void> {
    if (this.connection.state !== 'Disconnected') {
      await this.connection.stop();
      console.log('MachineHub disconnected');
    } else {
      console.log('MachineHub already disconnected');
    }
  }

  async subscribeToMachine(
    machineId: string,
    callback: (update: MachineOeeUpdate) => void,
    runtimeBlockCallback?: (block: MachineRuntimeBlock) => void
  ): Promise<void> {
    try {
      await this.connection.invoke('SubscribeToMachine', machineId);
      this.callbacks.set(machineId, callback);
      if (runtimeBlockCallback) {
        this.runtimeBlockCallbacks.set(machineId, runtimeBlockCallback);
      }
      console.log(`Subscribed to machine: ${machineId}`);
    } catch (err) {
      console.error(`Error subscribing to machine ${machineId}:`, err);
      
    }
  }

  async unsubscribeFromMachine(machineId: string): Promise<void> {
    this.callbacks.delete(machineId);
    this.runtimeBlockCallbacks.delete(machineId);
    
    // Only attempt to unsubscribe if connection is active
    if (this.connection.state === 'Connected') {
      try {
        await this.connection.invoke('UnsubscribeFromMachine', machineId);
        console.log(`Unsubscribed from machine: ${machineId}`);
      } catch (err) {
        console.error(`Error unsubscribing from machine ${machineId}:`, err);
        
      }
    } else {
      console.log(`Skipped unsubscribe for machine ${machineId} - connection not active (${this.connection.state})`);
    }
  }

  async getMachineAggregation(machineId: string): Promise<MachineAggregation | null> {
    try {
      const aggregation = await this.connection.invoke<MachineAggregation>(
        'GetMachineAggregation',
        machineId
      );
      return aggregation;
    } catch (err) {
      console.error(`Error getting aggregation for machine ${machineId}:`, err);
      return null;
    }
  }

  async getMachineRuntimeBlocks(machineId: string): Promise<MachineRuntimeBlock[]> {
    try {
      const blocks = await this.connection.invoke<MachineRuntimeBlock[]>(
        'GetMachineRuntimeBlocks',
        machineId
      );
      return blocks;
    } catch (err) {
      console.error(`Error getting runtime blocks for machine ${machineId}:`, err);
      return [];
    }
  }

  async getSubscriberCount(machineId: string): Promise<number> {
    try {
      const count = await this.connection.invoke<number>('GetSubscriberCount', machineId);
      return count;
    } catch (err) {
      console.error(`Error getting subscriber count for machine ${machineId}:`, err);
      return 0;
    }
  }

  getConnectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }
}
