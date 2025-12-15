# Frontend Developer Guide: Real-Time Dashboard Metrics

This guide shows frontend developers how to connect to the real-time dashboard metrics system and test the implementation.

## Table of Contents

1. [Quick Start](#quick-start)
2. [JavaScript/TypeScript Client](#javascripttypescript-client)
3. [React Integration](#react-integration)
4. [Vue.js Integration](#vuejs-integration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

1. Install SignalR client package:

```bash
npm install @microsoft/signalr
```

2. Ensure backend server is running on `https://localhost:5001` (or your configured URL)

3. Demo dashboards are available:
   - `demo-dashboard-1` - System metrics (CPU, memory, disk, network)
   - `demo-dashboard-2` - Environmental metrics (temperature, humidity, pressure, air quality)
   - `demo-dashboard-3` - Business metrics (orders, revenue, users, errors)

---

## JavaScript/TypeScript Client

### Basic Connection Example

```typescript
import * as signalR from "@microsoft/signalr";

// Initialize SignalR connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/hubs/dashboard-metrics", {
        accessTokenFactory: () => "your-jwt-token-here" // If authentication required
    })
    .withAutomaticReconnect() // Automatic reconnection
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Handle metric updates
connection.on("MetricUpdate", (data) => {
    console.log("Received metric update:", data);
    // data.DashboardId - Dashboard identifier
    // data.MetricName - Name of the metric
    // data.Value - Current metric value
    // data.Timestamp - When the metric was recorded
    // data.AggregatedMetrics - Optional aggregated stats (avg, min, max, etc.)
    
    updateChart(data.MetricName, data.Value, data.Timestamp);
});

// Handle subscription confirmation
connection.on("SubscriptionConfirmed", (data) => {
    console.log("Successfully subscribed to dashboard:", data.DashboardId);
    console.log("Subscribed at:", data.SubscribedAt);
});

// Handle subscription errors
connection.on("SubscriptionError", (data) => {
    console.error("Subscription error for dashboard:", data.DashboardId);
    console.error("Error:", data.Error);
});

// Handle unsubscription confirmation
connection.on("UnsubscriptionConfirmed", (data) => {
    console.log("Successfully unsubscribed from dashboard:", data.DashboardId);
});

// Handle historical metrics results
connection.on("HistoricalMetricsResult", (data) => {
    console.log("Historical metrics:", data);
    displayHistoricalData(data.Aggregation);
});

// Handle available metrics results
connection.on("AvailableMetricsResult", (data) => {
    console.log("Available metrics for dashboard:", data.DashboardId);
    console.log("Metrics:", data.Metrics);
    populateMetricSelector(data.Metrics);
});

// Start connection
async function startConnection() {
    try {
        await connection.start();
        console.log("SignalR Connected!");
        
        // Subscribe to a dashboard
        await subscribeToDashboard("demo-dashboard-1");
    } catch (err) {
        console.error("Error connecting:", err);
        setTimeout(startConnection, 5000); // Retry after 5 seconds
    }
}

// Subscribe to a dashboard
async function subscribeToDashboard(dashboardId: string) {
    try {
        await connection.invoke("SubscribeToDashboard", dashboardId);
        console.log(`Subscribed to dashboard: ${dashboardId}`);
    } catch (err) {
        console.error("Error subscribing:", err);
    }
}

// Unsubscribe from a dashboard
async function unsubscribeFromDashboard(dashboardId: string) {
    try {
        await connection.invoke("UnsubscribeFromDashboard", dashboardId);
        console.log(`Unsubscribed from dashboard: ${dashboardId}`);
    } catch (err) {
        console.error("Error unsubscribing:", err);
    }
}

// Get subscriber count
async function getSubscriberCount(dashboardId: string) {
    try {
        const count = await connection.invoke<number>("GetSubscriberCount", dashboardId);
        console.log(`Subscriber count for ${dashboardId}: ${count}`);
        return count;
    } catch (err) {
        console.error("Error getting subscriber count:", err);
        return 0;
    }
}

// Get historical metrics
async function getHistoricalMetrics(
    dashboardId: string,
    metricName: string,
    startTime: Date,
    endTime: Date
) {
    try {
        await connection.invoke(
            "GetHistoricalMetrics",
            dashboardId,
            metricName,
            startTime.toISOString(),
            endTime.toISOString()
        );
    } catch (err) {
        console.error("Error getting historical metrics:", err);
    }
}

// Get available metrics
async function getAvailableMetrics(dashboardId: string) {
    try {
        await connection.invoke("GetAvailableMetrics", dashboardId);
    } catch (err) {
        console.error("Error getting available metrics:", err);
    }
}

// Handle connection closure
connection.onclose((error) => {
    console.error("Connection closed:", error);
    setTimeout(startConnection, 5000); // Attempt to reconnect
});

// Handle reconnection
connection.onreconnecting((error) => {
    console.warn("Reconnecting:", error);
});

connection.onreconnected((connectionId) => {
    console.log("Reconnected! ConnectionId:", connectionId);
    // Re-subscribe to dashboards after reconnection
    subscribeToDashboard("demo-dashboard-1");
});

// Start the connection
startConnection();

// Cleanup on page unload
window.addEventListener("beforeunload", async () => {
    await connection.stop();
});
```

---

## React Integration

### Custom Hook: `useDashboardMetrics`

```typescript
// hooks/useDashboardMetrics.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

interface MetricUpdate {
    dashboardId: string;
    metricName: string;
    value: number;
    timestamp: string;
    aggregatedMetrics?: {
        average: number;
        min: number;
        max: number;
        sum: number;
        count: number;
    };
}

interface UseDashboardMetricsOptions {
    dashboardId: string;
    autoConnect?: boolean;
    hubUrl?: string;
}

export function useDashboardMetrics({
    dashboardId,
    autoConnect = true,
    hubUrl = '/hubs/dashboard-metrics'
}: UseDashboardMetricsOptions) {
    const [metrics, setMetrics] = useState<Record<string, MetricUpdate>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    // Initialize connection
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionRef.current = connection;

        // Setup event handlers
        connection.on('MetricUpdate', (data: MetricUpdate) => {
            setMetrics(prev => ({
                ...prev,
                [data.metricName]: data
            }));
        });

        connection.on('SubscriptionConfirmed', (data) => {
            console.log('Subscription confirmed:', data);
            setError(null);
        });

        connection.on('SubscriptionError', (data) => {
            setError(data.Error);
        });

        connection.onclose(() => setIsConnected(false));
        connection.onreconnected(() => {
            setIsConnected(true);
            // Re-subscribe after reconnection
            connection.invoke('SubscribeToDashboard', dashboardId);
        });

        if (autoConnect) {
            connection.start()
                .then(() => {
                    setIsConnected(true);
                    return connection.invoke('SubscribeToDashboard', dashboardId);
                })
                .catch(err => setError(err.toString()));
        }

        return () => {
            connection.invoke('UnsubscribeFromDashboard', dashboardId)
                .finally(() => connection.stop());
        };
    }, [dashboardId, autoConnect, hubUrl]);

    const getHistoricalMetrics = useCallback(async (
        metricName: string,
        startTime: Date,
        endTime: Date
    ) => {
        if (connectionRef.current) {
            await connectionRef.current.invoke(
                'GetHistoricalMetrics',
                dashboardId,
                metricName,
                startTime.toISOString(),
                endTime.toISOString()
            );
        }
    }, [dashboardId]);

    return {
        metrics,
        isConnected,
        error,
        getHistoricalMetrics
    };
}
```

### React Component Example

```tsx
// components/DashboardMetrics.tsx
import React from 'react';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { Line } from 'react-chartjs-2';

interface DashboardMetricsProps {
    dashboardId: string;
}

export function DashboardMetrics({ dashboardId }: DashboardMetricsProps) {
    const { metrics, isConnected, error } = useDashboardMetrics({ dashboardId });

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!isConnected) {
        return <div className="loading">Connecting...</div>;
    }

    return (
        <div className="dashboard-metrics">
            <h2>Dashboard: {dashboardId}</h2>
            <div className="connection-status">
                Status: <span className="connected">● Connected</span>
            </div>
            
            <div className="metrics-grid">
                {Object.entries(metrics).map(([metricName, data]) => (
                    <div key={metricName} className="metric-card">
                        <h3>{metricName}</h3>
                        <div className="metric-value">
                            {data.value.toFixed(2)}
                        </div>
                        {data.aggregatedMetrics && (
                            <div className="metric-stats">
                                <small>
                                    Avg: {data.aggregatedMetrics.average.toFixed(2)} | 
                                    Min: {data.aggregatedMetrics.min.toFixed(2)} | 
                                    Max: {data.aggregatedMetrics.max.toFixed(2)}
                                </small>
                            </div>
                        )}
                        <div className="metric-timestamp">
                            {new Date(data.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

---

## Vue.js Integration

### Vue 3 Composable

```typescript
// composables/useDashboardMetrics.ts
import { ref, onMounted, onUnmounted } from 'vue';
import * as signalR from '@microsoft/signalr';

export function useDashboardMetrics(dashboardId: string) {
    const metrics = ref<Record<string, any>>({});
    const isConnected = ref(false);
    const error = ref<string | null>(null);
    let connection: signalR.HubConnection | null = null;

    const connect = async () => {
        connection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/dashboard-metrics')
            .withAutomaticReconnect()
            .build();

        connection.on('MetricUpdate', (data) => {
            metrics.value[data.metricName] = data;
        });

        connection.on('SubscriptionError', (data) => {
            error.value = data.Error;
        });

        connection.onclose(() => {
            isConnected.value = false;
        });

        try {
            await connection.start();
            isConnected.value = true;
            await connection.invoke('SubscribeToDashboard', dashboardId);
        } catch (err) {
            error.value = err.toString();
        }
    };

    const disconnect = async () => {
        if (connection) {
            await connection.invoke('UnsubscribeFromDashboard', dashboardId);
            await connection.stop();
        }
    };

    onMounted(connect);
    onUnmounted(disconnect);

    return {
        metrics,
        isConnected,
        error
    };
}
```

### Vue Component

```vue
<template>
  <div class="dashboard-metrics">
    <h2>Dashboard: {{ dashboardId }}</h2>
    
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="!isConnected" class="loading">Connecting...</div>
    
    <div v-else class="metrics-grid">
      <div
        v-for="(data, metricName) in metrics"
        :key="metricName"
        class="metric-card"
      >
        <h3>{{ metricName }}</h3>
        <div class="metric-value">{{ data.value.toFixed(2) }}</div>
        <div v-if="data.aggregatedMetrics" class="metric-stats">
          <small>
            Avg: {{ data.aggregatedMetrics.average.toFixed(2) }} |
            Min: {{ data.aggregatedMetrics.min.toFixed(2) }} |
            Max: {{ data.aggregatedMetrics.max.toFixed(2) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardMetrics } from '@/composables/useDashboardMetrics';

const props = defineProps<{
  dashboardId: string;
}>();

const { metrics, isConnected, error } = useDashboardMetrics(props.dashboardId);
</script>
```

---

## Testing

### Manual Testing Steps

1. **Start the backend server**:
   ```bash
   cd VaultForce/VaultForce
   dotnet run
   ```

2. **Open browser console** (F12)

3. **Copy and paste this test script**:

```javascript
// Quick test script for browser console
(async function() {
    // Load SignalR from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@microsoft/signalr@latest/dist/browser/signalr.min.js';
    document.head.appendChild(script);
    
    await new Promise(resolve => script.onload = resolve);
    
    // Connect to hub
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/dashboard-metrics')
        .withAutomaticReconnect()
        .build();
    
    // Log all metric updates
    connection.on('MetricUpdate', (data) => {
        console.log('📊 Metric Update:', {
            dashboard: data.dashboardId,
            metric: data.metricName,
            value: data.value.toFixed(2),
            time: new Date(data.timestamp).toLocaleTimeString()
        });
    });
    
    connection.on('SubscriptionConfirmed', (data) => {
        console.log('✅ Subscribed to:', data.dashboardId);
    });
    
    // Start connection
    await connection.start();
    console.log('🔗 Connected to SignalR');
    
    // Subscribe to demo dashboard
    await connection.invoke('SubscribeToDashboard', 'demo-dashboard-1');
    
    console.log('🎉 Test started! Watch for metric updates...');
    console.log('💡 To stop: connection.stop()');
    
    // Make connection available globally
    window.dashboardConnection = connection;
})();
```

4. **Expected output**: You should see metric updates every 2 seconds in the console

### Automated Testing with Jest

```typescript
// __tests__/dashboardMetrics.test.ts
import * as signalR from '@microsoft/signalr';

describe('Dashboard Metrics Hub', () => {
    let connection: signalR.HubConnection;

    beforeAll(async () => {
        connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:5001/hubs/dashboard-metrics')
            .build();
        
        await connection.start();
    });

    afterAll(async () => {
        await connection.stop();
    });

    test('should subscribe to dashboard', async () => {
        const confirmationPromise = new Promise((resolve) => {
            connection.on('SubscriptionConfirmed', resolve);
        });

        await connection.invoke('SubscribeToDashboard', 'demo-dashboard-1');
        
        const confirmation = await confirmationPromise;
        expect(confirmation).toHaveProperty('dashboardId', 'demo-dashboard-1');
    });

    test('should receive metric updates', async () => {
        const metricPromise = new Promise((resolve) => {
            connection.on('MetricUpdate', resolve);
        });

        await connection.invoke('SubscribeToDashboard', 'demo-dashboard-1');
        
        const update = await metricPromise;
        expect(update).toHaveProperty('dashboardId');
        expect(update).toHaveProperty('metricName');
        expect(update).toHaveProperty('value');
        expect(update).toHaveProperty('timestamp');
    });

    test('should get subscriber count', async () => {
        const count = await connection.invoke<number>(
            'GetSubscriberCount',
            'demo-dashboard-1'
        );
        
        expect(typeof count).toBe('number');
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
```

---

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to SignalR hub

**Solutions**:
1. Check if backend is running: `https://localhost:5001/hubs/dashboard-metrics`
2. Verify CORS configuration allows your origin
3. Check browser console for errors
4. Ensure SSL certificate is trusted (for development)

### No Metric Updates

**Problem**: Connected but not receiving updates

**Solutions**:
1. Verify dashboard ID exists (use `demo-dashboard-1`, `demo-dashboard-2`, or `demo-dashboard-3`)
2. Check if `DashboardMetricSimulatorService` is running (look for logs)
3. Verify subscription was confirmed (check for `SubscriptionConfirmed` event)
4. Check server logs for errors

### Authentication Issues

**Problem**: 401 Unauthorized errors

**Solutions**:
1. Add JWT token to connection:
   ```typescript
   .withUrl('/hubs/dashboard-metrics', {
       accessTokenFactory: () => 'your-jwt-token'
   })
   ```
2. Ensure token is valid and not expired
3. Check if authentication is required (may not be for demo)

### Reconnection Issues

**Problem**: Connection drops frequently

**Solutions**:
1. Enable automatic reconnect:
   ```typescript
   .withAutomaticReconnect([0, 2000, 10000, 30000])
   ```
2. Implement reconnection logic to re-subscribe:
   ```typescript
   connection.onreconnected(() => {
       connection.invoke('SubscribeToDashboard', dashboardId);
   });
   ```

---

## Next Steps

1. **Explore Backend Developer Guide** - Learn how to create your own metrics and dashboards
2. **Customize Visualizations** - Integrate with charting libraries (Chart.js, D3.js, ApexCharts)
3. **Add Alerts** - Implement threshold-based alerts for critical metrics
4. **Historical Data** - Use `GetHistoricalMetrics` for time-series analysis
5. **Mobile Support** - Adapt for mobile apps using SignalR clients for iOS/Android

---

## Support & Resources

- **Backend Developer Guide**: See `BACKEND_DEV_GUIDE.md`
- **Architecture Documentation**: See `REALTIME_DASHBOARD_ARCHITECTURE.md`
- **Orleans Streams Guide**: See `ORLEANS_STREAMS_DASHBOARD_GUIDE.md`
- **SignalR Documentation**: https://docs.microsoft.com/aspnet/core/signalr/
