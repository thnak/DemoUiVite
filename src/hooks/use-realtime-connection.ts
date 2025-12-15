/**
 * Hook for managing real-time connection state
 */

import { useRealtimeContext } from 'src/services/realtime/realtime-context';

export function useRealtimeConnection() {
  const { client, connectionState } = useRealtimeContext();

  const connect = async () => {
    try {
      await client.connect();
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await client.disconnect();
    } catch (error) {
      console.error('Disconnect failed:', error);
      throw error;
    }
  };

  return {
    connectionState,
    isConnected: connectionState.status === 'connected',
    isConnecting: connectionState.status === 'connecting',
    isReconnecting: connectionState.status === 'reconnecting',
    isDisconnected: connectionState.status === 'disconnected',
    connect,
    disconnect,
  };
}
