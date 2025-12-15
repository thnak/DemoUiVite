/**
 * Real-time dashboard types and interfaces
 * Defines data structures for SignalR-based real-time communication
 */

export interface MetricUpdate {
  metricId: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
  trend?: 'up' | 'down' | 'stable';
  delta?: number;
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
  description?: string;
  category?: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export interface ConnectionState {
  status: ConnectionStatus;
  connectionId?: string;
  error?: Error;
  lastConnected?: Date;
  reconnectAttempts?: number;
}

export interface MetricSubscription {
  metricId: string;
  callback: (data: MetricUpdate) => void;
  unsubscribe: () => void;
}

export interface RealtimeContext {
  client: any; // SignalR HubConnection
  subscriptionManager: any;
  connectionState: ConnectionState;
}

export interface DataPoint {
  timestamp: number;
  value: number;
}

export interface TimeSeriesData {
  metricId: string;
  data: DataPoint[];
  minValue: number;
  maxValue: number;
  avgValue: number;
}

export interface AlertConfig {
  id: string;
  metricId: string;
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  severity: 'info' | 'warning' | 'error';
  message: string;
}

export interface AlertEvent {
  alertId: string;
  metricId: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
  value: number;
}
