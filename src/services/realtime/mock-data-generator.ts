/**
 * Mock Data Generator for Real-Time Dashboard
 * Simulates server-side SignalR hub responses for demonstration
 * 
 * In production, this would be replaced with actual SignalR server connection
 */

import type { MetricUpdate } from './types';

export class MockRealtimeDataGenerator {
  private intervals = new Map<string, NodeJS.Timeout>();

  private baseValues = new Map<string, number>();

  /**
   * Start generating mock data for a metric
   */
  startMetric(metricId: string, callback: (data: MetricUpdate) => void, intervalMs = 1000): void {
    if (this.intervals.has(metricId)) {
      console.warn(`Mock data already running for ${metricId}`);
      return;
    }

    // Initialize base value
    this.baseValues.set(metricId, this.getInitialValue(metricId));

    // Generate updates at specified interval
    const interval = setInterval(() => {
      const update = this.generateUpdate(metricId);
      callback(update);
    }, intervalMs);

    this.intervals.set(metricId, interval);
    console.log(`🎲 Started mock data for: ${metricId}`);

    // Send initial value immediately
    callback(this.generateUpdate(metricId));
  }

  /**
   * Stop generating mock data for a metric
   */
  stopMetric(metricId: string): void {
    const interval = this.intervals.get(metricId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(metricId);
      this.baseValues.delete(metricId);
      console.log(`🛑 Stopped mock data for: ${metricId}`);
    }
  }

  /**
   * Stop all mock data generation
   */
  stopAll(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    this.baseValues.clear();
    console.log('🛑 Stopped all mock data generators');
  }

  /**
   * Generate a realistic metric update
   */
  private generateUpdate(metricId: string): MetricUpdate {
    const baseValue = this.baseValues.get(metricId) ?? 50;
    const config = this.getMetricConfig(metricId);

    // Add random variation
    const variation = (Math.random() - 0.5) * config.volatility;
    const newValue = Math.max(
      config.min,
      Math.min(config.max, baseValue + variation + config.trend)
    );

    // Store for next iteration
    this.baseValues.set(metricId, newValue);

    // Calculate trend
    const delta = newValue - baseValue;
    const trend = Math.abs(delta) < 0.1 ? 'stable' : delta > 0 ? 'up' : 'down';

    return {
      metricId,
      value: Number(newValue.toFixed(2)),
      timestamp: Date.now(),
      delta: Number(delta.toFixed(2)),
      trend: trend as 'up' | 'down' | 'stable',
      metadata: {
        source: 'mock',
        version: '1.0',
      },
    };
  }

  /**
   * Get initial value for a metric
   */
  private getInitialValue(metricId: string): number {
    const configs: Record<string, number> = {
      cpu_usage: 45,
      memory_usage: 8.5,
      active_connections: 120,
      requests_per_second: 350,
      response_time: 180,
      error_rate: 0.5,
      disk_usage: 65,
      network_throughput: 450,
      queue_depth: 25,
      cache_hit_rate: 85,
      database_queries: 200,
      active_users: 450,
    };

    return configs[metricId] ?? 50;
  }

  /**
   * Get configuration for metric behavior
   */
  private getMetricConfig(metricId: string): {
    min: number;
    max: number;
    volatility: number;
    trend: number;
  } {
    const configs: Record<
      string,
      { min: number; max: number; volatility: number; trend: number }
    > = {
      cpu_usage: { min: 0, max: 100, volatility: 10, trend: 0.1 },
      memory_usage: { min: 0, max: 16, volatility: 0.5, trend: 0.02 },
      active_connections: { min: 0, max: 1000, volatility: 20, trend: 0 },
      requests_per_second: { min: 0, max: 1000, volatility: 50, trend: 0 },
      response_time: { min: 50, max: 2000, volatility: 30, trend: 0 },
      error_rate: { min: 0, max: 10, volatility: 0.3, trend: 0 },
      disk_usage: { min: 0, max: 100, volatility: 2, trend: 0.05 },
      network_throughput: { min: 0, max: 1000, volatility: 50, trend: 0 },
      queue_depth: { min: 0, max: 100, volatility: 5, trend: 0 },
      cache_hit_rate: { min: 0, max: 100, volatility: 5, trend: 0 },
      database_queries: { min: 0, max: 500, volatility: 30, trend: 0 },
      active_users: { min: 0, max: 1000, volatility: 30, trend: 0 },
    };

    return (
      configs[metricId] ?? {
        min: 0,
        max: 100,
        volatility: 10,
        trend: 0,
      }
    );
  }

  /**
   * Check if metric is currently generating
   */
  isActive(metricId: string): boolean {
    return this.intervals.has(metricId);
  }

  /**
   * Get all active metrics
   */
  getActiveMetrics(): string[] {
    return Array.from(this.intervals.keys());
  }
}

/**
 * Mock SignalR Client that uses the data generator
 * For demo purposes - simulates SignalR connection without a server
 */
export class MockSignalRClient {
  private generator = new MockRealtimeDataGenerator();

  private handlers = new Map<string, Set<(...args: any[]) => void>>();

  private _state: 'Connected' | 'Disconnected' | 'Connecting' = 'Disconnected';

  async connect(): Promise<void> {
    this._state = 'Connecting';
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    this._state = 'Connected';
    console.log('🔗 Mock SignalR Connected');
  }

  async disconnect(): Promise<void> {
    this.generator.stopAll();
    this._state = 'Disconnected';
    console.log('🔌 Mock SignalR Disconnected');
  }

  async invoke(method: string, ...args: any[]): Promise<any> {
    if (method === 'SubscribeToMetric') {
      const metricId = args[0] as string;
      const eventName = `metric_${metricId}`;

      // Start generating mock data
      this.generator.startMetric(metricId, (data) => {
        this.emit(eventName, data);
      });
    } else if (method === 'UnsubscribeFromMetric') {
      const metricId = args[0] as string;
      this.generator.stopMetric(metricId);
    }
  }

  on(eventName: string, handler: (...args: any[]) => void): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);
  }

  off(eventName: string, handler?: (...args: any[]) => void): void {
    if (handler) {
      this.handlers.get(eventName)?.delete(handler);
    } else {
      this.handlers.delete(eventName);
    }
  }

  private emit(eventName: string, ...args: any[]): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in handler for ${eventName}:`, error);
        }
      });
    }
  }

  get state(): 'Connected' | 'Disconnected' | 'Connecting' {
    return this._state;
  }

  get isConnected(): boolean {
    return this._state === 'Connected';
  }

  get connectionId(): string {
    return 'mock-connection-id';
  }
}
