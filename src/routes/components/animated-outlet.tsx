import { AnimatePresence } from 'framer-motion';
import { useOutlet, useLocation } from 'react-router-dom';

import { PageTransition } from '../../components/page-transition';

/**
 * AnimatedOutlet wraps the React Router Outlet with AnimatePresence
 * to enable smooth page transitions when navigating between routes.
 *
 * The location pathname is used as the key to trigger animations
 * when the route changes.
 */
export function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>{outlet}</PageTransition>
    </AnimatePresence>
  );
}
