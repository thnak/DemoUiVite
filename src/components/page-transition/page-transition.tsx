import type { ReactNode } from 'react';

import { motion } from 'framer-motion';

// ----------------------------------------------------------------------

type PageTransitionProps = {
  children: ReactNode;
};

// Optimized easing for smooth, natural motion
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

/**
 * PageTransition component wraps page content with smooth fade and slide animations
 *
 * Features:
 * - Smooth fade in/out (300ms enter, 200ms exit)
 * - Subtle vertical slide (8px) for natural motion
 * - Optimized easing curves for perceived smoothness
 * - Minimal performance impact with GPU-accelerated transforms
 *
 * Usage:
 * ```tsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{
        width: '100%',
      }}
    >
      {children}
    </motion.div>
  );
}
