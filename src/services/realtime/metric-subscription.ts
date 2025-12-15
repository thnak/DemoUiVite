/**
 * Metric Subscription Manager
 * Manages subscriptions to real-time metrics with selective computation pattern
 * 
 * Key Features:
 * - Pub/Sub pattern - only compute metrics with active subscribers
 * - Automatic server notification on subscribe/unsubscribe
 * - Multiple callbacks per metric support
 * - Automatic cleanup on component unmount
 */

import type { MetricUpdate } from './types';
import type { SignalRClient } from './signalr-client';

export class MetricSubscriptionManager {
  private subscriptions = new Map<string, Set<(data: MetricUpdate) => void>>();

  private activeMetrics = new Set<string>();

  constructor(private client: SignalRClient) {}

  /**
   * Subscribe to a metric's real-time updates
   * Returns an unsubscribe function for cleanup
   */
  async subscribe(
    metricId: string,
    callback: (data: MetricUpdate) => void
  ): Promise<() => void> {
    // Add callback to subscription list
    if (!this.subscriptions.has(metricId)) {
      this.subscriptions.set(metricId, new Set());
    }
    this.subscriptions.get(metricId)!.add(callback);

    // If first subscriber, notify server to start computing
    if (!this.activeMetrics.has(metricId)) {
      await this.subscribeToServer(metricId);
      this.activeMetrics.add(metricId);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(metricId, callback);
  }

  /**
   * Subscribe to multiple metrics at once
   */
  async subscribeMultiple(
    metricIds: string[],
    callback: (metricId: string, data: MetricUpdate) => void
  ): Promise<() => void> {
    const unsubscribers = await Promise.all(
      metricIds.map((id) => this.subscribe(id, (data) => callback(id, data)))
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }

  /**
   * Register server-side subscription and event listener
   */
  private async subscribeToServer(metricId: string): Promise<void> {
    // Setup listener for this metric's updates
    const eventName = `metric_${metricId}`;
    this.client.on(eventName, (data: MetricUpdate) => {
      this.handleMetricUpdate(metricId, data);
    });

    try {
      // Notify server to start computing this metric
      await this.client.invoke('SubscribeToMetric', metricId);
      console.log(`✅ Subscribed to metric: ${metricId}`);
    } catch (error) {
      console.error(`❌ Failed to subscribe to metric ${metricId}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe a specific callback from a metric
   */
  private async unsubscribe(
    metricId: string,
    callback: (data: MetricUpdate) => void
  ): Promise<void> {
    const callbacks = this.subscriptions.get(metricId);
    if (!callbacks) return;

    callbacks.delete(callback);

    // If no more subscribers, stop server-side computation
    if (callbacks.size === 0) {
      this.subscriptions.delete(metricId);
      await this.unsubscribeFromServer(metricId);
      this.activeMetrics.delete(metricId);
    }
  }

  /**
   * Remove server-side subscription and event listener
   */
  private async unsubscribeFromServer(metricId: string): Promise<void> {
    const eventName = `metric_${metricId}`;
    this.client.off(eventName);

    try {
      // Notify server to stop computing this metric
      await this.client.invoke('UnsubscribeFromMetric', metricId);
      console.log(`🔌 Unsubscribed from metric: ${metricId}`);
    } catch (error) {
      console.error(`❌ Failed to unsubscribe from metric ${metricId}:`, error);
    }
  }

  /**
   * Handle metric update and notify all callbacks
   */
  private handleMetricUpdate(metricId: string, data: MetricUpdate): void {
    const callbacks = this.subscriptions.get(metricId);
    if (!callbacks || callbacks.size === 0) {
      console.warn(`Received update for metric ${metricId} with no callbacks`);
      return;
    }

    // Notify all registered callbacks
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in metric callback for ${metricId}:`, error);
      }
    });
  }

  /**
   * Unsubscribe from all active metrics
   * Use this for cleanup when component unmounts
   */
  async unsubscribeAll(): Promise<void> {
    const promises = Array.from(this.activeMetrics).map((metricId) =>
      this.unsubscribeFromServer(metricId)
    );

    await Promise.allSettled(promises);

    this.subscriptions.clear();
    this.activeMetrics.clear();

    console.log('🧹 Unsubscribed from all metrics');
  }

  /**
   * Get list of currently active metric subscriptions
   */
  getActiveMetrics(): string[] {
    return Array.from(this.activeMetrics);
  }

  /**
   * Get subscriber count for a specific metric
   */
  getSubscriberCount(metricId: string): number {
    return this.subscriptions.get(metricId)?.size ?? 0;
  }

  /**
   * Check if a metric has active subscriptions
   */
  isMetricActive(metricId: string): boolean {
    return this.activeMetrics.has(metricId);
  }
}
