# Real-Time Dashboard Implementation - Complete Solution

This document provides a comprehensive overview of the real-time dashboard implementation with SignalR and Orleans-inspired patterns.

## Overview

This implementation demonstrates a production-ready architecture for real-time data visualization using:

- **SignalR** for WebSocket-based real-time communication
- **Orleans-inspired patterns** for distributed compute pipelines
- **Pub/Sub with selective computation** - metrics only computed when actively viewed
- **In-memory processing** for high-performance data computation
- **State persistence** for quick resume when clients reconnect

## Key Features

### 1. Real-Time Data Streaming

- **Bi-directional communication** via SignalR WebSockets
- **Automatic reconnection** with exponential backoff
- **Connection state tracking** with visual indicators
- **Low latency updates** (sub-second)

### 2. Selective Computation (Resource Optimization)

The system implements a sophisticated pub/sub pattern where:

- Metrics are **only computed when there are active subscribers**
- When a client subscribes to a metric, the server starts computing it
- When the last client unsubscribes, computation stops
- State is persisted so new subscribers get immediate data

**Example Flow:**
```
1. Client subscribes to "cpu_usage" → Server starts computing CPU usage
2. Multiple clients subscribe → Server continues computing (shared data)
3. All clients unsubscribe → Server stops computing, saves state
4. New client subscribes → Server resumes computing, sends cached state
```

### 3. High-Performance Compute Pipeline

Inspired by Orleans virtual actors (grains), the architecture uses:

- **Isolated metric computations** - each metric is independent
- **In-memory state** for fast access (L1 cache)
- **Shared cache layer** (L2 - Redis) for distributed scenarios
- **Persistent storage** (L3 - Database) for historical data

### 4. Client-Side Architecture

The React application provides:

- **Context Provider** for SignalR connection management
- **Custom Hooks** for easy metric subscription
- **Automatic cleanup** when components unmount
- **Throttling support** for high-frequency updates
- **Historical data tracking** for trend visualization

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Components (Dashboard View)                     │ │
│  │  - MetricWidget (live values)                          │ │
│  │  - MetricSparkline (trends)                            │ │
│  │  - ConnectionStatus (health)                           │ │
│  └──────────────────┬──────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────────┐ │
│  │  Custom React Hooks                                     │ │
│  │  - useRealtimeMetric (subscribe to metrics)            │ │
│  │  - useRealtimeConnection (connection state)            │ │
│  │  - useMetricHistory (time-series data)                 │ │
│  └──────────────────┬──────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────────┐ │
│  │  Realtime Context & Services                           │ │
│  │  - RealtimeProvider (connection management)            │ │
│  │  - MetricSubscriptionManager (pub/sub)                 │ │
│  │  - SignalRClient (WebSocket wrapper)                   │ │
│  └──────────────────┬──────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────────────┘
                     │ SignalR Connection (WebSocket)
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                      Server Application                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SignalR Hub (MetricsHub)                              │ │
│  │  - SubscribeToMetric(metricId)                         │ │
│  │  - UnsubscribeFromMetric(metricId)                     │ │
│  │  - Connection tracking                                 │ │
│  └──────────────────┬──────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────────┐ │
│  │  Orleans Cluster (Virtual Actors)                      │ │
│  │  ┌────────────────────────────────────────────────┐   │ │
│  │  │  MetricGrain (per metric instance)             │   │ │
│  │  │  - State: current value, subscribers           │   │ │
│  │  │  - Methods: UpdateValue, Subscribe, Unsubscribe│   │ │
│  │  │  - Auto-activation/deactivation                │   │ │
│  │  └────────────────────────────────────────────────┘   │ │
│  └──────────────────┬──────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────────┐ │
│  │  Storage Layers                                         │ │
│  │  - L1: Grain Memory (fastest)                          │ │
│  │  - L2: Redis Cache (shared)                            │ │
│  │  - L3: Database (persistent)                           │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Implementation Files

### Documentation
- `docs/guides/realtime-dashboard-architecture.md` - Comprehensive architecture guide
- `docs/guides/realtime-dashboard-client-implementation.md` - Client implementation guide

### Services
- `src/services/realtime/signalr-client.ts` - SignalR connection wrapper
- `src/services/realtime/metric-subscription.ts` - Subscription manager
- `src/services/realtime/realtime-context.tsx` - React context provider
- `src/services/realtime/mock-data-generator.ts` - Mock data for demo
- `src/services/realtime/types.ts` - TypeScript type definitions

### Hooks
- `src/hooks/use-realtime-metric.ts` - Subscribe to real-time metrics
- `src/hooks/use-realtime-connection.ts` - Connection state management
- `src/hooks/use-metric-history.ts` - Historical data tracking

### Components
- `src/sections/realtime-dashboard/metric-widget.tsx` - Live metric display
- `src/sections/realtime-dashboard/metric-sparkline.tsx` - Trend visualization
- `src/sections/realtime-dashboard/connection-status.tsx` - Connection indicator
- `src/sections/realtime-dashboard/view/realtime-dashboard-view.tsx` - Main dashboard

### Pages & Routes
- `src/pages/realtime-dashboard.tsx` - Dashboard page
- Route: `/realtime-dashboard`
- Navigation: Dashboard > Real-Time Dashboard

## Usage Examples

### Basic Metric Subscription

```tsx
import { useRealtimeMetric } from 'src/hooks/use-realtime-metric';

function CPUMonitor() {
  const { data, isConnected, isSubscribed } = useRealtimeMetric('cpu_usage', {
    throttleMs: 1000, // Update at most once per second
  });

  if (!isConnected) return <div>Connecting...</div>;
  if (!isSubscribed) return <div>Loading...</div>;

  return (
    <div>
      CPU Usage: {data?.value.toFixed(2)}%
      <small>Last update: {new Date(data?.timestamp).toLocaleTimeString()}</small>
    </div>
  );
}
```

### Multiple Metrics

```tsx
import { useRealtimeMetric } from 'src/hooks/use-realtime-metric';

function SystemMonitor() {
  const cpu = useRealtimeMetric('cpu_usage');
  const memory = useRealtimeMetric('memory_usage');
  const disk = useRealtimeMetric('disk_usage');

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <MetricCard title="CPU" value={cpu.data?.value} unit="%" />
      </Grid>
      <Grid item xs={4}>
        <MetricCard title="Memory" value={memory.data?.value} unit="GB" />
      </Grid>
      <Grid item xs={4}>
        <MetricCard title="Disk" value={disk.data?.value} unit="%" />
      </Grid>
    </Grid>
  );
}
```

### Historical Trends

```tsx
import { useMetricHistory } from 'src/hooks/use-metric-history';

function CPUTrend() {
  const { current, history, min, max, avg } = useMetricHistory('cpu_usage', {
    maxPoints: 50,
  });

  return (
    <div>
      <h3>CPU Usage Trend</h3>
      <LineChart data={history} />
      <div>
        Current: {current}% | Min: {min}% | Max: {max}% | Avg: {avg}%
      </div>
    </div>
  );
}
```

## Performance Considerations

### Client-Side Optimizations

1. **Throttling**: Limit update frequency for high-velocity metrics
   ```tsx
   useRealtimeMetric('sensor_data', { throttleMs: 100 });
   ```

2. **Conditional Subscription**: Only subscribe when component is visible
   ```tsx
   const isVisible = usePageVisibility();
   useRealtimeMetric('metric', { enabled: isVisible });
   ```

3. **Batching**: Group multiple metric updates (server-side feature)

### Server-Side Optimizations

1. **Lazy Activation**: Grains only activate when needed
2. **Automatic Deactivation**: Grains deactivate after idle period
3. **State Compression**: Send only changed values (delta compression)
4. **Connection Pooling**: Share connections across metrics

## Scalability

The architecture is designed to scale horizontally:

### Multi-Server Deployment

```
Load Balancer
    |
    ├─ SignalR Server 1 ─┐
    ├─ SignalR Server 2 ─┼─ Redis Backplane
    └─ SignalR Server 3 ─┘
              |
    ┌─────────┴─────────┐
    |  Orleans Cluster   |
    ├─ Silo 1            |
    ├─ Silo 2            |
    └─ Silo 3            |
              |
        Storage Layer
```

### Capacity Planning

- **SignalR Servers**: ~10,000 concurrent connections per server
- **Orleans Silos**: ~100,000 active grains per silo
- **Redis**: Sub-millisecond latency for cached data

## Monitoring & Observability

Key metrics to track:

1. **Connection Metrics**
   - Active connections
   - Connection duration
   - Reconnection rate

2. **Subscription Metrics**
   - Active subscriptions per metric
   - Subscription rate
   - Unsubscription rate

3. **Performance Metrics**
   - Message latency (end-to-end)
   - Grain activation time
   - Cache hit rate

4. **Resource Metrics**
   - CPU usage
   - Memory usage
   - Network bandwidth

## Security

### Authentication & Authorization

```csharp
[Authorize]
public class MetricsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Verify user has access to metrics
        if (!await _authService.CanAccessMetrics(userId))
        {
            Context.Abort();
            return;
        }
        
        await base.OnConnectedAsync();
    }
}
```

### Rate Limiting

Implement rate limiting to prevent abuse:
- Max subscriptions per client: 50
- Max requests per second: 100
- Max message size: 1 MB

## Testing

### Unit Tests

```typescript
// Test metric subscription
test('should subscribe to metric', async () => {
  const manager = new MetricSubscriptionManager(mockClient);
  const callback = jest.fn();
  
  await manager.subscribe('test-metric', callback);
  
  expect(mockClient.invoke).toHaveBeenCalledWith('SubscribeToMetric', 'test-metric');
});
```

### Integration Tests

```typescript
// Test SignalR connection
test('should receive metric updates', async () => {
  const client = new SignalRClient({ hubUrl: testHubUrl });
  await client.connect();
  
  const updates: MetricUpdate[] = [];
  client.on('metric_cpu_usage', (update) => updates.push(update));
  
  await waitFor(() => expect(updates.length).toBeGreaterThan(0));
});
```

### Load Tests

Simulate concurrent clients:
```typescript
async function loadTest(numClients: number) {
  const clients = await Promise.all(
    Array(numClients).fill(0).map(() => createClient())
  );
  
  // Measure latency, throughput, error rate
}
```

## Deployment

### Docker Deployment

```dockerfile
# Client (React)
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3039
CMD ["npm", "start"]

# Server (ASP.NET Core + Orleans)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "RealtimeServer.dll"]
```

### Environment Variables

```bash
# Client
VITE_API_BASE_URL=https://api.example.com
VITE_SIGNALR_HUB_URL=https://api.example.com/hubs/metrics

# Server
ORLEANS_CLUSTER_ID=realtime-cluster
ORLEANS_SERVICE_ID=realtime-service
REDIS_CONNECTION_STRING=redis:6379
DATABASE_CONNECTION_STRING=...
```

## Demo Mode

The current implementation includes a **mock data generator** for demonstration:

- Simulates server-side SignalR responses
- Generates realistic metric variations
- No backend server required
- Perfect for UI development and testing

To use real SignalR connection:
```tsx
<RealtimeProvider 
  hubUrl="/hubs/metrics" 
  useMockData={false}  // Disable mock data
>
  <RealtimeDashboardView />
</RealtimeProvider>
```

## Next Steps

To deploy with a real backend:

1. **Implement SignalR Hub** (ASP.NET Core)
2. **Set up Orleans Cluster** with silo configuration
3. **Configure Redis** for backplane and caching
4. **Set up Database** for persistent storage
5. **Implement Metric Grains** with business logic
6. **Add Authentication** and authorization
7. **Configure Monitoring** and logging
8. **Load Test** and optimize

## Resources

- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/)
- [Orleans Documentation](https://docs.microsoft.com/en-us/dotnet/orleans/)
- [React Hooks Guide](https://react.dev/reference/react)
- [WebSocket Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check documentation in `docs/guides/`
- Review code examples in `src/sections/realtime-dashboard/`
- Open an issue on GitHub
