import { useRef, useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export type UseIdleTimerProps = {
  timeout?: number; // Timeout in milliseconds
  onIdle?: () => void;
  onActive?: () => void;
  enabled?: boolean;
};

/**
 * Hook to detect user idle state
 * @param timeout - Time in milliseconds before considering user idle (default: 30000ms = 30s)
 * @param onIdle - Callback when user becomes idle
 * @param onActive - Callback when user becomes active again
 * @param enabled - Whether the idle detection is enabled (default: true)
 */
export function useIdleTimer({
  timeout = 30000,
  onIdle,
  onActive,
  enabled = true,
}: UseIdleTimerProps = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleActivity = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If was idle, mark as active
      if (isIdle) {
        setIsIdle(false);
        onActive?.();
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        onIdle?.();
      }, timeout);
    };

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'wheel',
    ];

    // Initialize timeout
    handleActivity();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, timeout, isIdle, onIdle, onActive]);

  return { isIdle };
}
