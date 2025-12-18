import * as signalR from '@microsoft/signalr';

export interface DeviceStateUpdate {
  deviceId: string;
  currentState: 'Offline' | 'Online' | 'UpdatingFirmware' | 'Error';
  lastSeen: string; // ISO 8601 date string
  firmwareVersion: string;
  lastError: string;
}

export interface DeviceState {
  currentState: 'Offline' | 'Online' | 'UpdatingFirmware' | 'Error';
  lastSeen: string;
  firmwareVersion: string;
  lastError: string;
}

export class DeviceHubService {
  private connection: signalR.HubConnection;

  private callbacks: Map<string, (update: DeviceStateUpdate) => void> = new Map();

  constructor(baseUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/device`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register the DeviceUpdate event handler
    this.connection.on('DeviceUpdate', (update: DeviceStateUpdate) => {
      console.log('Device update received:', update);
      const callback = this.callbacks.get(update.deviceId);
      if (callback) {
        callback(update);
      }
    });
  }

  async start(): Promise<void> {
    try {
      await this.connection.start();
      console.log('DeviceHub connected');
    } catch (err) {
      console.error('Error connecting to DeviceHub:', err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    await this.connection.stop();
    console.log('DeviceHub disconnected');
  }

  async subscribeToDevice(
    deviceId: string,
    callback: (update: DeviceStateUpdate) => void
  ): Promise<void> {
    try {
      await this.connection.invoke('SubscribeToDevice', deviceId);
      this.callbacks.set(deviceId, callback);
      console.log(`Subscribed to device: ${deviceId}`);
    } catch (err) {
      console.error(`Error subscribing to device ${deviceId}:`, err);
      throw err;
    }
  }

  async unsubscribeFromDevice(deviceId: string): Promise<void> {
    this.callbacks.delete(deviceId);
    try {
      await this.connection.invoke('UnsubscribeFromDevice', deviceId);
      console.log(`Unsubscribed from device: ${deviceId}`);
    } catch (err) {
      console.error(`Error unsubscribing from device ${deviceId}:`, err);
      throw err;
    }
  }

  async getDeviceState(deviceId: string): Promise<DeviceState | null> {
    try {
      const state = await this.connection.invoke<DeviceState>('GetDeviceState', deviceId);
      return state;
    } catch (err) {
      console.error(`Error getting state for device ${deviceId}:`, err);
      throw err;
    }
  }

  async getSubscriberCount(deviceId: string): Promise<number> {
    try {
      const count = await this.connection.invoke<number>('GetSubscriberCount', deviceId);
      return count;
    } catch (err) {
      console.error(`Error getting subscriber count for device ${deviceId}:`, err);
      throw err;
    }
  }

  getConnectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }
}
