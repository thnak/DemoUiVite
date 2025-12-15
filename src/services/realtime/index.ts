/**
 * Real-time service exports
 */

export { SignalRClient } from './signalr-client';
export { MetricSubscriptionManager } from './metric-subscription';
export { RealtimeProvider, useRealtimeContext } from './realtime-context';
export { MockSignalRClient, MockRealtimeDataGenerator } from './mock-data-generator';

export type {
  DataPoint,
  AlertEvent,
  AlertConfig,
  MetricUpdate,
  MetricConfig,
  TimeSeriesData,
  ConnectionState,
  RealtimeContext,
  ConnectionStatus,
  MetricSubscription,
} from './types';
