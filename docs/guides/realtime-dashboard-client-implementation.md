# Real-Time Dashboard Client Implementation Guide

This guide provides practical implementation patterns for integrating SignalR-based real-time dashboards in a React/TypeScript application.

## Installation

```bash
npm install @microsoft/signalr
```

## Project Structure

```
src/
├── services/
│   └── realtime/
│       ├── signalr-client.ts          # SignalR connection management
│       ├── metric-subscription.ts     # Subscription management
│       ├── realtime-store.ts          # State management for real-time data
│       └── types.ts                   # TypeScript types
├── hooks/
│   ├── use-realtime-metric.ts         # Hook for subscribing to metrics
│   ├── use-realtime-connection.ts     # Hook for connection state
│   └── use-metric-batch.ts            # Hook for batch updates
└── sections/
    └── realtime-dashboard/
        ├── realtime-dashboard-view.tsx
        ├── metric-widget.tsx
        ├── connection-status.tsx
        └── types.ts
```

## Core Implementation

### 1. SignalR Client Service

```typescript
// src/services/realtime/signalr-client.ts
import * as signalR from '@microsoft/signalr';

export interface SignalRConfig {
  hubUrl: string;
  automaticReconnect?: boolean;
  accessTokenFactory?: () => string | Promise<string>;
}

export class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private config: SignalRConfig) {}

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const builder = new signalR.HubConnectionBuilder()
      .withUrl(this.config.hubUrl, {
        accessTokenFactory: this.config.accessTokenFactory,
        transport: signalR.HttpTransportType.WebSockets | 
                   signalR.HttpTransportType.ServerSentEvents,
      });

    if (this.config.automaticReconnect !== false) {
      builder.withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          this.reconnectAttempts = retryContext.previousRetryCount;
          
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          
          return Math.min(30000, 2000 * Math.pow(2, retryContext.previousRetryCount));
        },
      });
    }

    this.connection = builder.build();

    // Setup event handlers
    this.setupConnectionHandlers();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (!this.connection) {
      throw new Error('SignalR connection not established');
    }

    return this.connection.invoke<T>(methodName, ...args);
  }

  on(eventName: string, callback: (...args: any[]) => void): void {
    this.connection?.on(eventName, callback);
  }

  off(eventName: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.connection?.off(eventName, callback);
    } else {
      this.connection?.off(eventName);
    }
  }

  get state(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  get isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log('SignalR Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR Reconnected:', connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log('SignalR Connection Closed', error);
    });
  }
}
```

### 2. Metric Subscription Manager

```typescript
// src/services/realtime/metric-subscription.ts
import type { SignalRClient } from './signalr-client';
import type { MetricUpdate, MetricSubscription } from './types';

export class MetricSubscriptionManager {
  private subscriptions = new Map<string, Set<(data: MetricUpdate) => void>>();
  private activeMetrics = new Set<string>();

  constructor(private client: SignalRClient) {}

  async subscribe(
    metricId: string,
    callback: (data: MetricUpdate) => void
  ): Promise<() => void> {
    // Add callback to subscription list
    if (!this.subscriptions.has(metricId)) {
      this.subscriptions.set(metricId, new Set());
    }
    this.subscriptions.get(metricId)!.add(callback);

    // If first subscriber, notify server
    if (!this.activeMetrics.has(metricId)) {
      await this.subscribeToServer(metricId);
      this.activeMetrics.add(metricId);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(metricId, callback);
  }

  private async subscribeToServer(metricId: string): Promise<void> {
    // Setup listener for this metric
    const eventName = `metric_${metricId}`;
    this.client.on(eventName, (data: MetricUpdate) => {
      this.handleMetricUpdate(metricId, data);
    });

    // Notify server to start computing
    try {
      await this.client.invoke('SubscribeToMetric', metricId);
      console.log(`Subscribed to metric: ${metricId}`);
    } catch (error) {
      console.error(`Failed to subscribe to metric ${metricId}:`, error);
    }
  }

  private async unsubscribe(
    metricId: string,
    callback: (data: MetricUpdate) => void
  ): Promise<void> {
    const callbacks = this.subscriptions.get(metricId);
    if (!callbacks) return;

    callbacks.delete(callback);

    // If no more subscribers, notify server
    if (callbacks.size === 0) {
      this.subscriptions.delete(metricId);
      await this.unsubscribeFromServer(metricId);
      this.activeMetrics.delete(metricId);
    }
  }

  private async unsubscribeFromServer(metricId: string): Promise<void> {
    const eventName = `metric_${metricId}`;
    this.client.off(eventName);

    try {
      await this.client.invoke('UnsubscribeFromMetric', metricId);
      console.log(`Unsubscribed from metric: ${metricId}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from metric ${metricId}:`, error);
    }
  }

  private handleMetricUpdate(metricId: string, data: MetricUpdate): void {
    const callbacks = this.subscriptions.get(metricId);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in metric callback for ${metricId}:`, error);
        }
      });
    }
  }

  async unsubscribeAll(): Promise<void> {
    const promises = Array.from(this.activeMetrics).map((metricId) =>
      this.unsubscribeFromServer(metricId)
    );

    await Promise.all(promises);
    
    this.subscriptions.clear();
    this.activeMetrics.clear();
  }

  getActiveMetrics(): string[] {
    return Array.from(this.activeMetrics);
  }
}
```

### 3. TypeScript Types

```typescript
// src/services/realtime/types.ts
export interface MetricUpdate {
  metricId: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface MetricConfig {
  id: string;
  name: string;
  unit?: string;
  refreshInterval?: number;
  thresholds?: {
    warning?: number;
    critical?: number;
  };
}

export interface ConnectionState {
  status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
  connectionId?: string;
  error?: Error;
  lastConnected?: Date;
}

export interface MetricSubscription {
  metricId: string;
  callback: (data: MetricUpdate) => void;
  unsubscribe: () => void;
}

export interface RealtimeContext {
  client: SignalRClient;
  subscriptionManager: MetricSubscriptionManager;
  connectionState: ConnectionState;
}
```

### 4. React Context Provider

```typescript
// src/services/realtime/realtime-context.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { SignalRClient } from './signalr-client';
import { MetricSubscriptionManager } from './metric-subscription';
import type { ConnectionState, RealtimeContext } from './types';

const RealtimeDataContext = createContext<RealtimeContext | null>(null);

interface RealtimeProviderProps {
  hubUrl: string;
  children: ReactNode;
  autoConnect?: boolean;
}

export function RealtimeProvider({ 
  hubUrl, 
  children, 
  autoConnect = true 
}: RealtimeProviderProps) {
  const [client] = useState(() => new SignalRClient({ hubUrl }));
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
      client.connect()
        .then(() => updateConnectionState())
        .catch((error) => {
          console.error('Failed to connect:', error);
          setConnectionState({
            status: 'disconnected',
            error,
          });
        });
    }

    return () => {
      subscriptionManager.unsubscribeAll();
      client.disconnect();
    };
  }, [client, subscriptionManager, autoConnect, updateConnectionState]);

  // Monitor connection state changes
  useEffect(() => {
    const interval = setInterval(updateConnectionState, 1000);
    return () => clearInterval(interval);
  }, [updateConnectionState]);

  const contextValue: RealtimeContext = {
    client,
    subscriptionManager,
    connectionState,
  };

  return (
    <RealtimeDataContext.Provider value={contextValue}>
      {children}
    </RealtimeDataContext.Provider>
  );
}

export function useRealtimeContext(): RealtimeContext {
  const context = useContext(RealtimeDataContext);
  if (!context) {
    throw new Error('useRealtimeContext must be used within RealtimeProvider');
  }
  return context;
}
```

### 5. React Hooks

#### useRealtimeMetric Hook

```typescript
// src/hooks/use-realtime-metric.ts
import { useState, useEffect, useCallback } from 'react';
import { useRealtimeContext } from 'src/services/realtime/realtime-context';
import type { MetricUpdate } from 'src/services/realtime/types';

interface UseRealtimeMetricOptions {
  enabled?: boolean;
  throttleMs?: number;
  onUpdate?: (data: MetricUpdate) => void;
}

export function useRealtimeMetric(
  metricId: string,
  options: UseRealtimeMetricOptions = {}
) {
  const { enabled = true, throttleMs = 0, onUpdate } = options;
  const { subscriptionManager, connectionState } = useRealtimeContext();
  
  const [data, setData] = useState<MetricUpdate | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleUpdate = useCallback(
    (update: MetricUpdate) => {
      setData(update);
      onUpdate?.(update);
    },
    [onUpdate]
  );

  useEffect(() => {
    if (!enabled || connectionState.status !== 'connected') {
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let lastUpdate = 0;

    const throttledCallback = (update: MetricUpdate) => {
      const now = Date.now();
      if (throttleMs === 0 || now - lastUpdate >= throttleMs) {
        handleUpdate(update);
        lastUpdate = now;
      }
    };

    subscriptionManager
      .subscribe(metricId, throttledCallback)
      .then((unsub) => {
        unsubscribe = unsub;
        setIsSubscribed(true);
        setError(null);
      })
      .catch((err) => {
        console.error(`Failed to subscribe to ${metricId}:`, err);
        setError(err);
        setIsSubscribed(false);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
        setIsSubscribed(false);
      }
    };
  }, [metricId, enabled, throttleMs, subscriptionManager, connectionState.status, handleUpdate]);

  return {
    data,
    isSubscribed,
    isConnected: connectionState.status === 'connected',
    error,
  };
}
```

#### useRealtimeConnection Hook

```typescript
// src/hooks/use-realtime-connection.ts
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
    connect,
    disconnect,
  };
}
```

### 6. Dashboard Components

#### Connection Status Component

```tsx
// src/sections/realtime-dashboard/connection-status.tsx
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useRealtimeConnection } from 'src/hooks/use-realtime-connection';

export function ConnectionStatus() {
  const { connectionState, isConnected, isConnecting, isReconnecting } = useRealtimeConnection();

  const getStatusConfig = () => {
    if (isConnected) {
      return { label: 'Connected', color: 'success' as const };
    }
    if (isReconnecting) {
      return { label: 'Reconnecting...', color: 'warning' as const };
    }
    if (isConnecting) {
      return { label: 'Connecting...', color: 'info' as const };
    }
    return { label: 'Disconnected', color: 'error' as const };
  };

  const { label, color } = getStatusConfig();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        label={label}
        color={color}
        size="small"
        variant="outlined"
      />
      {connectionState.lastConnected && isConnected && (
        <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
          Connected at {connectionState.lastConnected.toLocaleTimeString()}
        </Box>
      )}
    </Box>
  );
}
```

#### Metric Widget Component

```tsx
// src/sections/realtime-dashboard/metric-widget.tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRealtimeMetric } from 'src/hooks/use-realtime-metric';
import type { MetricConfig } from 'src/services/realtime/types';

interface MetricWidgetProps {
  config: MetricConfig;
  formatValue?: (value: number) => string;
}

export function MetricWidget({ config, formatValue }: MetricWidgetProps) {
  const { data, isSubscribed, isConnected } = useRealtimeMetric(config.id, {
    throttleMs: config.refreshInterval,
  });

  const formattedValue = data?.value !== undefined 
    ? (formatValue?.(data.value) ?? data.value.toFixed(2))
    : '--';

  const getStatusColor = () => {
    if (!data || !config.thresholds) return 'text.primary';
    
    if (config.thresholds.critical && data.value >= config.thresholds.critical) {
      return 'error.main';
    }
    if (config.thresholds.warning && data.value >= config.thresholds.warning) {
      return 'warning.main';
    }
    return 'success.main';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {config.name}
          </Typography>
          {!isConnected && (
            <Typography variant="caption" color="error">
              Offline
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          {!isSubscribed && isConnected ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography
                variant="h3"
                sx={{
                  color: getStatusColor(),
                  fontWeight: 600,
                }}
              >
                {formattedValue}
              </Typography>
              {config.unit && (
                <Typography variant="body2" color="text.secondary">
                  {config.unit}
                </Typography>
              )}
            </>
          )}
        </Box>

        {data?.timestamp && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Updated: {new Date(data.timestamp).toLocaleTimeString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Real-Time Dashboard View

```tsx
// src/sections/realtime-dashboard/view/realtime-dashboard-view.tsx
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DashboardContent } from 'src/layouts/dashboard';
import { ConnectionStatus } from '../connection-status';
import { MetricWidget } from '../metric-widget';
import type { MetricConfig } from 'src/services/realtime/types';

const SAMPLE_METRICS: MetricConfig[] = [
  {
    id: 'cpu_usage',
    name: 'CPU Usage',
    unit: '%',
    refreshInterval: 1000,
    thresholds: { warning: 70, critical: 90 },
  },
  {
    id: 'memory_usage',
    name: 'Memory Usage',
    unit: 'GB',
    refreshInterval: 1000,
    thresholds: { warning: 12, critical: 15 },
  },
  {
    id: 'active_connections',
    name: 'Active Connections',
    unit: 'conn',
    refreshInterval: 500,
  },
  {
    id: 'requests_per_second',
    name: 'Requests/Second',
    unit: 'req/s',
    refreshInterval: 500,
  },
  {
    id: 'response_time',
    name: 'Avg Response Time',
    unit: 'ms',
    refreshInterval: 1000,
    thresholds: { warning: 500, critical: 1000 },
  },
  {
    id: 'error_rate',
    name: 'Error Rate',
    unit: '%',
    refreshInterval: 1000,
    thresholds: { warning: 1, critical: 5 },
  },
];

export function RealtimeDashboardView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4">Real-Time Dashboard</Typography>
        <ConnectionStatus />
      </Box>

      <Grid container spacing={3}>
        {SAMPLE_METRICS.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricWidget config={metric} />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}
```

## Integration with App

### 1. Add Provider to App Root

```tsx
// src/app.tsx
import { RealtimeProvider } from 'src/services/realtime/realtime-context';

export function App() {
  return (
    <RealtimeProvider hubUrl="http://localhost:5000/hubs/metrics">
      {/* Your app content */}
    </RealtimeProvider>
  );
}
```

### 2. Add Route

```tsx
// src/routes/sections.tsx
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const RealtimeDashboardView = lazy(() => 
  import('src/sections/realtime-dashboard/view/realtime-dashboard-view')
    .then((m) => ({ default: m.RealtimeDashboardView }))
);

export const dashboardRoutes = [
  {
    path: 'realtime-dashboard',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RealtimeDashboardView />
      </Suspense>
    ),
  },
  // ... other routes
];
```

## Advanced Patterns

### Batch Updates

```typescript
// src/hooks/use-metric-batch.ts
import { useState, useEffect, useCallback } from 'react';
import { useRealtimeContext } from 'src/services/realtime/realtime-context';

export function useMetricBatch(metricIds: string[], batchInterval: number = 100) {
  const { client } = useRealtimeContext();
  const [metrics, setMetrics] = useState<Record<string, any>>({});

  useEffect(() => {
    const handleBatchUpdate = (updates: Record<string, any>) => {
      setMetrics((prev) => ({ ...prev, ...updates }));
    };

    client.on('metricsBatchUpdate', handleBatchUpdate);

    // Subscribe to batch
    client.invoke('SubscribeToMetricsBatch', metricIds, batchInterval);

    return () => {
      client.off('metricsBatchUpdate', handleBatchUpdate);
      client.invoke('UnsubscribeFromMetricsBatch', metricIds);
    };
  }, [client, metricIds, batchInterval]);

  return metrics;
}
```

### Historical Data with Live Updates

```typescript
// src/hooks/use-metric-with-history.ts
import { useState, useEffect } from 'react';
import { useRealtimeMetric } from './use-realtime-metric';

interface DataPoint {
  timestamp: number;
  value: number;
}

export function useMetricWithHistory(metricId: string, maxPoints: number = 50) {
  const { data } = useRealtimeMetric(metricId);
  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (data) {
      setHistory((prev) => {
        const newHistory = [...prev, { timestamp: data.timestamp, value: data.value }];
        return newHistory.slice(-maxPoints);
      });
    }
  }, [data, maxPoints]);

  return {
    current: data,
    history,
    min: Math.min(...history.map((p) => p.value)),
    max: Math.max(...history.map((p) => p.value)),
    avg: history.reduce((sum, p) => sum + p.value, 0) / history.length,
  };
}
```

## Performance Tips

1. **Throttle High-Frequency Updates**: Use the `throttleMs` option to limit update frequency
2. **Unsubscribe When Not Visible**: Use React's visibility API to pause subscriptions
3. **Batch Multiple Metrics**: Use batch subscriptions for multiple related metrics
4. **Memoize Callbacks**: Use `useCallback` to prevent unnecessary re-subscriptions
5. **Debounce Render-Heavy Components**: Use `useMemo` for expensive calculations

## Testing

### Mock SignalR Client

```typescript
// src/services/realtime/__tests__/mock-signalr-client.ts
export class MockSignalRClient {
  private handlers = new Map<string, Function[]>();
  
  async connect() {
    return Promise.resolve();
  }
  
  async disconnect() {
    return Promise.resolve();
  }
  
  async invoke(method: string, ...args: any[]) {
    return Promise.resolve();
  }
  
  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }
  
  off(event: string) {
    this.handlers.delete(event);
  }
  
  // Test helper
  simulateEvent(event: string, data: any) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach((h) => h(data));
  }
}
```

## References

- [SignalR JavaScript Client](https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [React Real-Time Apps](https://react.dev/learn/synchronizing-with-effects)
- [Performance Optimization](https://react.dev/learn/render-and-commit)
