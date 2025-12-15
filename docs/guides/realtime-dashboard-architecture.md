# Real-Time Dashboard Architecture Research

This document outlines the architecture and design patterns for implementing a high-performance real-time dashboard using SignalR for real-time communication and Orleans-inspired patterns for distributed compute pipelines.

## Overview

The real-time dashboard architecture is designed to:
- Deliver live data updates to connected clients with minimal latency
- Optimize resource usage by computing metrics only when actively viewed
- Scale horizontally with distributed compute pipelines
- Maintain state consistency across client connections
- Support high-frequency data ingestion and processing

## Architecture Components

### 1. Real-Time Communication Layer (SignalR)

SignalR provides bi-directional real-time communication between server and clients.

#### Key Features
- **WebSocket-first** with automatic fallback to Server-Sent Events (SSE) and Long Polling
- **Hub-based architecture** for organizing real-time endpoints
- **Connection management** with automatic reconnection
- **Group-based messaging** for selective data broadcasting

#### Integration Pattern

```typescript
// Client-side SignalR Hub Connection
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('/hubs/metrics')
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryContext) => {
      // Exponential backoff: 0s, 2s, 10s, 30s
      if (retryContext.previousRetryCount === 0) return 0;
      if (retryContext.previousRetryCount === 1) return 2000;
      if (retryContext.previousRetryCount === 2) return 10000;
      return 30000;
    }
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

// Handle reconnection
connection.onreconnecting((error) => {
  console.log('Connection lost. Reconnecting...', error);
});

connection.onreconnected((connectionId) => {
  console.log('Reconnected with ID:', connectionId);
});

connection.onclose((error) => {
  console.log('Connection closed', error);
});
```

#### Hub Organization

Organize hubs by functional domain:
- **MetricsHub**: Real-time metrics and KPI updates
- **AlertsHub**: Alert notifications and warnings
- **MonitoringHub**: System health and status updates
- **DataStreamHub**: High-frequency sensor/telemetry data

### 2. Compute Pipeline Architecture (Orleans-Inspired)

Orleans provides a virtual actor model for distributed computing. We adapt these patterns for metric computation.

#### Virtual Actor Pattern (Grains)

Each metric or data stream is represented as a "grain" (virtual actor):
- **State Isolation**: Each grain maintains its own state
- **Single-Threaded Execution**: No race conditions within a grain
- **Location Transparency**: Grains can be distributed across servers
- **Automatic Activation**: Grains activate on-demand and deactivate when idle

#### Compute Pipeline Design

```
┌─────────────────┐
│  Data Ingestion │  ← Raw data from sensors, databases, APIs
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Event Stream    │  ← Message queue (Redis, RabbitMQ, Kafka)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Compute Pipeline│
│   (Grains)      │
│ ┌─────────────┐ │
│ │ Metric Grain│ │  ← Individual metric computation units
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ Aggregator  │ │  ← Aggregate multiple metrics
│ └─────────────┘ │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ In-Memory Cache │  ← Redis, MemoryCache
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SignalR Hub    │  ← Broadcast to connected clients
└────────┬────────┘
         │
         ▼
    [Clients]
```

#### Metric Grain Example

```csharp
// Server-side Orleans Grain (C#)
public interface IMetricGrain : IGrainWithStringKey
{
    Task<MetricValue> GetCurrentValue();
    Task UpdateValue(double value, DateTime timestamp);
    Task Subscribe(string connectionId);
    Task Unsubscribe(string connectionId);
}

public class MetricGrain : Grain, IMetricGrain
{
    private MetricState _state;
    private HashSet<string> _subscribers;
    private IDisposable _timer;

    public override Task OnActivateAsync()
    {
        _state = new MetricState();
        _subscribers = new HashSet<string>();
        
        // Deactivate if no subscribers for 5 minutes
        RegisterTimer(
            CheckForDeactivation, 
            null, 
            TimeSpan.FromMinutes(1), 
            TimeSpan.FromMinutes(1)
        );
        
        return base.OnActivateAsync();
    }

    public Task Subscribe(string connectionId)
    {
        _subscribers.Add(connectionId);
        return Task.CompletedTask;
    }

    public Task Unsubscribe(string connectionId)
    {
        _subscribers.Remove(connectionId);
        return Task.CompletedTask;
    }

    public async Task UpdateValue(double value, DateTime timestamp)
    {
        _state.CurrentValue = value;
        _state.LastUpdate = timestamp;
        
        // Compute derived metrics
        _state.Average = ComputeRunningAverage(value);
        _state.Trend = ComputeTrend();
        
        // Only broadcast if there are active subscribers
        if (_subscribers.Count > 0)
        {
            var hub = GrainFactory.GetGrain<IMetricsHubGrain>(0);
            await hub.BroadcastMetricUpdate(this.GetPrimaryKeyString(), _state);
        }
    }

    private Task CheckForDeactivation(object state)
    {
        // Deactivate grain if no subscribers
        if (_subscribers.Count == 0)
        {
            DeactivateOnIdle();
        }
        return Task.CompletedTask;
    }
}
```

### 3. Selective Computation Pattern (Pub/Sub with Active Tracking)

Only compute metrics when clients are actively subscribed.

#### Subscription Management

```typescript
// Client-side subscription manager
class MetricSubscriptionManager {
  private connection: signalR.HubConnection;
  private activeSubscriptions = new Set<string>();

  async subscribe(metricId: string, callback: (data: any) => void) {
    if (!this.activeSubscriptions.has(metricId)) {
      // Register callback
      this.connection.on(`metric_${metricId}`, callback);
      
      // Notify server to start computing this metric
      await this.connection.invoke('SubscribeToMetric', metricId);
      
      this.activeSubscriptions.add(metricId);
    }
  }

  async unsubscribe(metricId: string) {
    if (this.activeSubscriptions.has(metricId)) {
      // Remove callback
      this.connection.off(`metric_${metricId}`);
      
      // Notify server to stop computing this metric
      await this.connection.invoke('UnsubscribeFromMetric', metricId);
      
      this.activeSubscriptions.delete(metricId);
    }
  }

  // Automatic cleanup when component unmounts
  async unsubscribeAll() {
    for (const metricId of this.activeSubscriptions) {
      await this.unsubscribe(metricId);
    }
  }
}
```

#### Server-side Active Connection Tracking

```csharp
public class MetricsHub : Hub
{
    private readonly IClusterClient _orleansClient;
    private readonly IConnectionTracker _connectionTracker;

    public async Task SubscribeToMetric(string metricId)
    {
        var connectionId = Context.ConnectionId;
        
        // Track this connection's interest
        await _connectionTracker.AddSubscription(connectionId, metricId);
        
        // Notify the metric grain
        var grain = _orleansClient.GetGrain<IMetricGrain>(metricId);
        await grain.Subscribe(connectionId);
        
        // Send current value immediately
        var currentValue = await grain.GetCurrentValue();
        await Clients.Caller.SendAsync($"metric_{metricId}", currentValue);
    }

    public async Task UnsubscribeFromMetric(string metricId)
    {
        var connectionId = Context.ConnectionId;
        
        await _connectionTracker.RemoveSubscription(connectionId, metricId);
        
        var grain = _orleansClient.GetGrain<IMetricGrain>(metricId);
        await grain.Unsubscribe(connectionId);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        // Cleanup all subscriptions for this connection
        var subscriptions = await _connectionTracker.GetSubscriptions(Context.ConnectionId);
        foreach (var metricId in subscriptions)
        {
            var grain = _orleansClient.GetGrain<IMetricGrain>(metricId);
            await grain.Unsubscribe(Context.ConnectionId);
        }
        
        await _connectionTracker.RemoveConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
```

### 4. In-Memory Storage Strategy

Use high-performance in-memory storage for hot data and computed results.

#### Storage Layers

1. **L1 Cache (Process Memory)**: 
   - Orleans grain state
   - Fastest access
   - Limited capacity
   - Grain-local data

2. **L2 Cache (Redis/Memcached)**:
   - Shared across compute nodes
   - Sub-millisecond access
   - Larger capacity
   - Distributed cache

3. **L3 Storage (Database)**:
   - Historical data
   - Cold storage
   - Persistent state
   - Analytics queries

#### Data Flow Strategy

```
Hot Path (Active Users):
  Input → L1 (Grain) → Compute → L1 → SignalR → Client

Warm Path (Background Processing):
  Input → L2 (Redis) → Batch Process → L3 (DB)

Cold Path (Historical):
  Query → L3 (DB) → Aggregate → L2 → Client
```

#### Time-Series Data Optimization

```csharp
public class TimeSeriesBuffer
{
    private readonly CircularBuffer<DataPoint> _buffer;
    private readonly TimeSpan _windowSize;
    
    public TimeSeriesBuffer(int capacity, TimeSpan windowSize)
    {
        _buffer = new CircularBuffer<DataPoint>(capacity);
        _windowSize = windowSize;
    }

    public void Add(DataPoint point)
    {
        _buffer.Add(point);
        PurgeOldData();
    }

    private void PurgeOldData()
    {
        var cutoff = DateTime.UtcNow - _windowSize;
        while (_buffer.Count > 0 && _buffer.First().Timestamp < cutoff)
        {
            _buffer.RemoveFirst();
        }
    }

    public IEnumerable<DataPoint> GetWindow() => _buffer;
    
    public double ComputeAverage() => _buffer.Average(p => p.Value);
    
    public double ComputeRate()
    {
        if (_buffer.Count < 2) return 0;
        var first = _buffer.First();
        var last = _buffer.Last();
        var duration = (last.Timestamp - first.Timestamp).TotalSeconds;
        return duration > 0 ? (last.Value - first.Value) / duration : 0;
    }
}
```

### 5. State Management When Inactive

When no users are subscribed, persist state for quick resume.

#### State Persistence Pattern

```csharp
public class MetricGrain : Grain, IMetricGrain
{
    private MetricState _state;
    private HashSet<string> _subscribers;

    public override async Task OnActivateAsync()
    {
        // Restore state from persistent storage
        _state = await LoadStateAsync();
        _subscribers = new HashSet<string>();
        await base.OnActivateAsync();
    }

    public override async Task OnDeactivateAsync()
    {
        // Save state before deactivation
        if (_state.IsDirty)
        {
            await SaveStateAsync(_state);
        }
        await base.OnDeactivateAsync();
    }

    private async Task<MetricState> LoadStateAsync()
    {
        var cache = GrainFactory.GetGrain<ICacheGrain>("metric-cache");
        var state = await cache.Get<MetricState>(this.GetPrimaryKeyString());
        
        if (state == null)
        {
            // Load from database if not in cache
            state = await LoadFromDatabaseAsync();
        }
        
        return state ?? new MetricState();
    }

    private async Task SaveStateAsync(MetricState state)
    {
        var cache = GrainFactory.GetGrain<ICacheGrain>("metric-cache");
        await cache.Set(this.GetPrimaryKeyString(), state, TimeSpan.FromHours(24));
        
        // Optionally persist to database
        if (ShouldPersistToDatabase(state))
        {
            await SaveToDatabaseAsync(state);
        }
    }
}
```

## Performance Optimization Strategies

### 1. Batching Updates

Batch multiple metric updates into single SignalR messages:

```typescript
class MetricBatcher {
  private batch: Map<string, any> = new Map();
  private timer: NodeJS.Timeout | null = null;
  
  constructor(
    private connection: signalR.HubConnection,
    private batchInterval: number = 100 // ms
  ) {}
  
  addUpdate(metricId: string, value: any) {
    this.batch.set(metricId, value);
    
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchInterval);
    }
  }
  
  private flush() {
    if (this.batch.size > 0) {
      this.connection.invoke('UpdateMetricsBatch', Object.fromEntries(this.batch));
      this.batch.clear();
    }
    this.timer = null;
  }
}
```

### 2. Throttling High-Frequency Updates

Limit update frequency for high-velocity data:

```typescript
function useThrottledMetric(metricId: string, throttleMs: number = 1000) {
  const [value, setValue] = useState<number | null>(null);
  const lastUpdate = useRef<number>(0);
  
  useEffect(() => {
    const handleUpdate = (newValue: number) => {
      const now = Date.now();
      if (now - lastUpdate.current >= throttleMs) {
        setValue(newValue);
        lastUpdate.current = now;
      }
    };
    
    connection.on(`metric_${metricId}`, handleUpdate);
    
    return () => {
      connection.off(`metric_${metricId}`, handleUpdate);
    };
  }, [metricId, throttleMs]);
  
  return value;
}
```

### 3. Delta Compression

Send only changed values:

```csharp
public class DeltaCompressor
{
    private readonly Dictionary<string, object> _previousState = new();

    public object ComputeDelta(string key, object newValue)
    {
        if (!_previousState.TryGetValue(key, out var oldValue))
        {
            _previousState[key] = newValue;
            return newValue; // First time, send full value
        }

        var delta = ComputeDifference(oldValue, newValue);
        if (delta != null)
        {
            _previousState[key] = newValue;
        }
        
        return delta;
    }
}
```

## Scalability Considerations

### Horizontal Scaling

1. **Stateless SignalR Servers**: Use Redis backplane for multi-server deployments
2. **Orleans Cluster**: Distribute grains across multiple silo nodes
3. **Database Sharding**: Partition historical data by time or entity

### Load Balancing

```
              Load Balancer
                    |
      +-------------+-------------+
      |             |             |
   Server 1      Server 2      Server 3
   (SignalR)     (SignalR)     (SignalR)
      |             |             |
      +-------------+-------------+
                    |
              Redis Backplane
                    |
      +-------------+-------------+
      |             |             |
   Silo 1        Silo 2        Silo 3
   (Orleans)     (Orleans)     (Orleans)
```

### Resource Management

```csharp
public class ResourceGovernor
{
    private readonly int _maxActiveGrains;
    private readonly SemaphoreSlim _semaphore;
    
    public ResourceGovernor(int maxActiveGrains = 10000)
    {
        _maxActiveGrains = maxActiveGrains;
        _semaphore = new SemaphoreSlim(maxActiveGrains);
    }
    
    public async Task<bool> TryAcquireSlot()
    {
        return await _semaphore.WaitAsync(TimeSpan.FromSeconds(1));
    }
    
    public void ReleaseSlot()
    {
        _semaphore.Release();
    }
}
```

## Monitoring and Observability

### Key Metrics to Track

1. **Connection Metrics**:
   - Active connections count
   - Connection duration
   - Reconnection rate
   - Connection errors

2. **Compute Metrics**:
   - Active grains count
   - Grain activation rate
   - Grain deactivation rate
   - Computation latency
   - Queue depth

3. **Data Metrics**:
   - Messages per second
   - Message size
   - Data ingestion rate
   - Cache hit rate

4. **Performance Metrics**:
   - End-to-end latency
   - Server CPU/Memory usage
   - Network bandwidth
   - Database query time

### Logging Strategy

```typescript
// Client-side logging
connection.on('metric_update', (data) => {
  const latency = Date.now() - data.timestamp;
  
  if (latency > 1000) {
    console.warn(`High latency detected: ${latency}ms for ${data.metricId}`);
  }
  
  // Send telemetry
  telemetry.track('metric_received', {
    metricId: data.metricId,
    latency,
    value: data.value
  });
});
```

## Security Considerations

### Authentication & Authorization

```csharp
[Authorize]
public class MetricsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Add to user-specific group
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        
        await base.OnConnectedAsync();
    }
    
    public async Task SubscribeToMetric(string metricId)
    {
        // Check if user has permission to view this metric
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!await _authService.CanViewMetric(userId, metricId))
        {
            throw new UnauthorizedAccessException();
        }
        
        // Proceed with subscription
        // ...
    }
}
```

### Rate Limiting

```csharp
public class RateLimitingMiddleware
{
    private readonly Dictionary<string, TokenBucket> _buckets = new();
    
    public async Task<bool> CheckRateLimit(string connectionId, int requestsPerSecond)
    {
        if (!_buckets.TryGetValue(connectionId, out var bucket))
        {
            bucket = new TokenBucket(requestsPerSecond, requestsPerSecond);
            _buckets[connectionId] = bucket;
        }
        
        return bucket.TryConsume();
    }
}
```

## Testing Strategies

### Load Testing

```typescript
// Simulate multiple concurrent clients
async function loadTest(numClients: number, duration: number) {
  const clients: signalR.HubConnection[] = [];
  
  for (let i = 0; i < numClients; i++) {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/metrics')
      .build();
    
    await connection.start();
    await connection.invoke('SubscribeToMetric', 'test-metric');
    
    clients.push(connection);
  }
  
  await new Promise(resolve => setTimeout(resolve, duration));
  
  // Cleanup
  for (const client of clients) {
    await client.stop();
  }
}
```

### Integration Testing

```csharp
[Test]
public async Task MetricGrain_WithSubscribers_ShouldBroadcastUpdates()
{
    // Arrange
    var grain = _cluster.GrainFactory.GetGrain<IMetricGrain>("test-metric");
    await grain.Subscribe("connection-1");
    
    // Act
    await grain.UpdateValue(42.0, DateTime.UtcNow);
    
    // Assert
    var broadcasts = await _mockHub.GetBroadcastsAsync();
    Assert.That(broadcasts, Has.Count.EqualTo(1));
    Assert.That(broadcasts[0].Value, Is.EqualTo(42.0));
}

[Test]
public async Task MetricGrain_WithoutSubscribers_ShouldNotBroadcast()
{
    // Arrange
    var grain = _cluster.GrainFactory.GetGrain<IMetricGrain>("test-metric");
    
    // Act
    await grain.UpdateValue(42.0, DateTime.UtcNow);
    
    // Assert
    var broadcasts = await _mockHub.GetBroadcastsAsync();
    Assert.That(broadcasts, Is.Empty);
}
```

## References

- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/)
- [Orleans Documentation](https://docs.microsoft.com/en-us/dotnet/orleans/)
- [Real-Time Web Applications Guide](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [Distributed Systems Patterns](https://www.microsoft.com/en-us/research/publication/orleans-distributed-virtual-actors-for-programmability-and-scalability/)
