import * as signalR from '@microsoft/signalr';

// ----------------------------------------------------------------------

export enum MachineRunState {
  Running = "running",
  SpeedLoss = "speedloss",
  Downtime = "downtime",
}

export interface MachineRunStateTimeBlock {
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
  state: MachineRunState;
}

export interface MachineOeeUpdate {
  availability: number; // Percentage (0-100)
  performance: number; // Percentage (0-100)
  quality: number; // Percentage (0-100)
  oee: number; // Percentage (0-100) - Overall Equipment Effectiveness
  goodCount: number; // Count of good products produced
  totalCount: number; // Total count of products produced
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

  constructor(baseUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/machine`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register the MachineUpdate event handler
    this.connection.on('MachineUpdate', (update: MachineOeeUpdate) => {
      console.log('Machine OEE update received:', update);
      // Trigger all callbacks (in case we support multiple subscriptions)
      this.callbacks.forEach((callback) => {
        callback(update);
      });
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
      throw err;
    }
  }

  async stop(): Promise<void> {
    await this.connection.stop();
    console.log('MachineHub disconnected');
  }

  async subscribeToMachine(
    machineId: string,
    callback: (update: MachineOeeUpdate) => void
  ): Promise<void> {
    try {
      await this.connection.invoke('SubscribeToMachine', machineId);
      this.callbacks.set(machineId, callback);
      console.log(`Subscribed to machine: ${machineId}`);
    } catch (err) {
      console.error(`Error subscribing to machine ${machineId}:`, err);
      throw err;
    }
  }

  async unsubscribeFromMachine(machineId: string): Promise<void> {
    this.callbacks.delete(machineId);
    try {
      await this.connection.invoke('UnsubscribeFromMachine', machineId);
      console.log(`Unsubscribed from machine: ${machineId}`);
    } catch (err) {
      console.error(`Error unsubscribing from machine ${machineId}:`, err);
      throw err;
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
      throw err;
    }
  }

  async getSubscriberCount(machineId: string): Promise<number> {
    try {
      const count = await this.connection.invoke<number>('GetSubscriberCount', machineId);
      return count;
    } catch (err) {
      console.error(`Error getting subscriber count for machine ${machineId}:`, err);
      throw err;
    }
  }

  getConnectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }
}
