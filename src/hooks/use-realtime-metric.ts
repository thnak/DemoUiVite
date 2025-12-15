/**
 * Hook for subscribing to real-time metrics
 * Provides automatic subscription management and cleanup
 */

import type { MetricUpdate } from 'src/services/realtime/types';

import { useState, useEffect, useCallback } from 'react';

import { useRealtimeContext } from 'src/services/realtime/realtime-context';

interface UseRealtimeMetricOptions {
  enabled?: boolean;
  throttleMs?: number;
  onUpdate?: (data: MetricUpdate) => void;
  onError?: (error: Error) => void;
}

interface UseRealtimeMetricReturn {
  data: MetricUpdate | null;
  isSubscribed: boolean;
  isConnected: boolean;
  error: Error | null;
}

/**
 * Subscribe to a real-time metric
 * Automatically manages subscription lifecycle
 */
export function useRealtimeMetric(
  metricId: string,
  options: UseRealtimeMetricOptions = {}
): UseRealtimeMetricReturn {
  const { enabled = true, throttleMs = 0, onUpdate, onError } = options;
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
      return undefined;
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
      .then((unsub: () => void) => {
        unsubscribe = unsub;
        setIsSubscribed(true);
        setError(null);
      })
      .catch((err: Error) => {
        console.error(`Failed to subscribe to ${metricId}:`, err);
        setError(err);
        setIsSubscribed(false);
        onError?.(err);
      });

    // Cleanup function for unmounting
    const cleanup = () => {
      if (unsubscribe) {
        unsubscribe();
        setIsSubscribed(false);
      }
    };
    return cleanup;
  }, [
    metricId,
    enabled,
    throttleMs,
    subscriptionManager,
    connectionState.status,
    handleUpdate,
    onError,
  ]);

  return {
    data,
    isSubscribed,
    isConnected: connectionState.status === 'connected',
    error,
  };
}
