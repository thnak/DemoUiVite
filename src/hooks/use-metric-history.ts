/**
 * Hook for collecting metric history (time-series data)
 */

import type { DataPoint } from 'src/services/realtime/types';

import { useState, useEffect } from 'react';

import { useRealtimeMetric } from './use-realtime-metric';

interface UseMetricHistoryOptions {
  enabled?: boolean;
  maxPoints?: number;
  throttleMs?: number;
}

interface UseMetricHistoryReturn {
  current: number | null;
  history: DataPoint[];
  min: number;
  max: number;
  avg: number;
  isConnected: boolean;
}

/**
 * Subscribe to a metric and maintain historical data
 */
export function useMetricHistory(
  metricId: string,
  options: UseMetricHistoryOptions = {}
): UseMetricHistoryReturn {
  const { enabled = true, maxPoints = 50, throttleMs = 0 } = options;

  const { data, isConnected } = useRealtimeMetric(metricId, {
    enabled,
    throttleMs,
  });

  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (data) {
      setHistory((prev) => {
        const newHistory = [...prev, { timestamp: data.timestamp, value: data.value }];
        // Keep only the last maxPoints
        return newHistory.slice(-maxPoints);
      });
    }
  }, [data, maxPoints]);

  const values = history.map((p) => p.value);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  const avg = values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

  return {
    current: data?.value ?? null,
    history,
    min,
    max,
    avg,
    isConnected,
  };
}
