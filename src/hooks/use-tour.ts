import { useRef, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

// Define types inline to avoid namespace issues
export interface TourStep {
  id: string;
  title: string;
  text: string;
  attachTo?: {
    element: string;
    on: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
  };
  buttons?: Array<{
    text: string;
    action?: () => void;
    classes?: string;
    secondary?: boolean;
  }>;
  classes?: string;
  scrollTo?: boolean | { behavior?: 'auto' | 'smooth'; block?: 'start' | 'center' | 'end' | 'nearest' };
  when?: {
    show?: () => void;
    hide?: () => void;
  };
}

export interface UseTourOptions {
  steps: TourStep[];
  tourOptions?: any;
  onComplete?: () => void;
  onCancel?: () => void;
}

// ----------------------------------------------------------------------

/**
 * Custom hook for managing Shepherd.js guided tours
 * 
 * @param options - Configuration for the tour
 * @returns Tour control functions
 * 
 * @example
 * const { startTour, isActive } = useTour({
 *   steps: [...],
 *   onComplete: () => console.log('Tour completed'),
 * });
 */
export function useTour({ steps, tourOptions, onComplete, onCancel }: UseTourOptions) {
  const tourRef = useRef<any | null>(null);

  // Initialize tour
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('shepherd.js').then(({ default: Shepherd }) => {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          cancelIcon: {
            enabled: true,
          },
          classes: 'shepherd-theme-custom',
          scrollTo: { behavior: 'smooth', block: 'center' },
          modalOverlayOpeningPadding: 8,
          modalOverlayOpeningRadius: 8,
          ...tourOptions?.defaultStepOptions,
        },
        ...tourOptions,
      });

      // Add steps
      steps.forEach((step) => {
        const { buttons, ...stepOptions } = step;
        
        tour.addStep({
          ...stepOptions,
          buttons: buttons?.map((btn) => ({
            text: btn.text,
            action: btn.action || function handleAction(this: any) {
              if (btn.text === 'Next' || btn.text === 'Start Tour' || btn.text === 'Finish') {
                this.next();
              } else if (btn.text === 'Skip') {
                this.cancel();
              } else {
                this.back();
              }
            },
            classes: btn.classes || (btn.secondary ? 'shepherd-button-secondary' : 'shepherd-button-primary'),
          })) || [
            {
              text: 'Back',
              action(this: any) { this.back(); },
              classes: 'shepherd-button-secondary',
            },
            {
              text: 'Next',
              action(this: any) { this.next(); },
              classes: 'shepherd-button-primary',
            },
          ],
        } as any);
      });

      // Add complete and cancel handlers
      tour.on('complete', () => {
        onComplete?.();
      });

      tour.on('cancel', () => {
        onCancel?.();
      });

      tourRef.current = tour;
    });

    return () => {
      if (tourRef.current) {
        tourRef.current.complete();
        tourRef.current = null;
      }
    };
  }, [steps, tourOptions, onComplete, onCancel]);

  const startTour = useCallback(() => {
    if (tourRef.current) {
      tourRef.current.start();
    }
  }, []);

  const cancelTour = useCallback(() => {
    if (tourRef.current) {
      tourRef.current.cancel();
    }
  }, []);

  const completeTour = useCallback(() => {
    if (tourRef.current) {
      tourRef.current.complete();
    }
  }, []);

  const isActive = useCallback(() => tourRef.current?.isActive() || false, []);

  return {
    startTour,
    cancelTour,
    completeTour,
    isActive,
    tour: tourRef.current,
  };
}
