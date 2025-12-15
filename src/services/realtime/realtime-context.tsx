/**
 * Real-Time Data Context Provider
 * Provides SignalR connection and subscription management to React components
 */

import type { ReactNode } from 'react';

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { SignalRClient } from './signalr-client';
import { MockSignalRClient } from './mock-data-generator';
import { MetricSubscriptionManager } from './metric-subscription';

import type { ConnectionState, RealtimeContext } from './types';

const RealtimeDataContext = createContext<RealtimeContext | null>(null);

interface RealtimeProviderProps {
  hubUrl: string;
  children: ReactNode;
  autoConnect?: boolean;
  useMockData?: boolean; // Use mock data instead of real SignalR connection
}

export function RealtimeProvider({
  hubUrl,
  children,
  autoConnect = true,
  useMockData = true, // Default to mock for demo purposes
}: RealtimeProviderProps) {
  // Create SignalR client (real or mock)
  const [client] = useState(() => {
    if (useMockData) {
      return new MockSignalRClient() as any;
    }
    return new SignalRClient({ hubUrl });
  });

  const [subscriptionManager] = useState(() => new MetricSubscriptionManager(client));

  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
  });

  const updateConnectionState = useCallback(() => {
    const state = client.state;

    if (state === 'Connected') {
      setConnectionState({
        status: 'connected',
        lastConnected: new Date(),
        connectionId: client.connectionId,
      });
    } else if (state === 'Connecting') {
      setConnectionState({ status: 'connecting' });
    } else if (state === 'Reconnecting') {
      setConnectionState({ status: 'reconnecting' });
    } else {
      setConnectionState({ status: 'disconnected' });
    }
  }, [client]);

  useEffect(() => {
    if (autoConnect) {
      client
        .connect()
        .then(() => {
          console.log('✅ Real-time connection established');
          updateConnectionState();
        })
        .catch((error: Error) => {
          console.error('❌ Failed to connect:', error);
          setConnectionState({
            status: 'disconnected',
            error,
          });
        });
    }

    return () => {
      // Cleanup on unmount
      subscriptionManager.unsubscribeAll();
      client.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount

  // Monitor connection state changes
  useEffect(() => {
    const interval = setInterval(updateConnectionState, 2000);
    return () => clearInterval(interval);
  }, [updateConnectionState]);

  const contextValue: RealtimeContext = useMemo(
    () => ({
      client,
      subscriptionManager,
      connectionState,
    }),
    [client, subscriptionManager, connectionState]
  );

  return <RealtimeDataContext.Provider value={contextValue}>{children}</RealtimeDataContext.Provider>;
}

/**
 * Hook to access real-time context
 */
export function useRealtimeContext(): RealtimeContext {
  const context = useContext(RealtimeDataContext);
  if (!context) {
    throw new Error('useRealtimeContext must be used within RealtimeProvider');
  }
  return context;
}
