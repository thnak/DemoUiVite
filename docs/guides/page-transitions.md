# Page Transitions Guide

This guide explains how smooth page transitions are implemented in the application using framer-motion.

## Overview

The application uses framer-motion's `AnimatePresence` component to create smooth fade and slide transitions when navigating between pages. This eliminates the flash/flicker that can occur with standard React Router navigation.

## Architecture

### Components

#### 1. PageTransition Component
**Location:** `src/components/page-transition/page-transition.tsx`

The `PageTransition` component wraps page content and applies animation variants:

```tsx
<PageTransition>
  <YourPageContent />
</PageTransition>
```

**Animation Details:**
- **Enter:** Fade in (opacity: 0 → 1) with 8px upward slide over 300ms
- **Exit:** Fade out (opacity: 1 → 0) with 8px downward slide over 200ms
- **Easing:** Custom cubic-bezier curves for natural motion
  - Enter: `[0.4, 0, 0.2, 1]` (ease-out)
  - Exit: `[0.4, 0, 1, 1]` (ease-in)

#### 2. AnimatedOutlet Component
**Location:** `src/routes/components/animated-outlet.tsx`

The `AnimatedOutlet` component replaces React Router's `Outlet` and adds animation support:

```tsx
<AnimatedOutlet />
```

**How it works:**
1. Uses `useOutlet()` to get the current route's content
2. Uses `useLocation()` to track route changes
3. Wraps content in `AnimatePresence` with `location.pathname` as key
4. Uses `mode="wait"` to ensure smooth transitions (exit completes before enter starts)
5. Uses `initial={false}` to skip animation on first render

### Route Integration

**File:** `src/routes/sections.tsx`

The `AnimatedOutlet` is used in place of standard `Outlet` in all layout components:

```tsx
// Before
<DashboardLayout>
  <Suspense fallback={renderFallback()}>
    <Outlet />
  </Suspense>
</DashboardLayout>

// After
<DashboardLayout>
  <Suspense fallback={renderFallback()}>
    <AnimatedOutlet />
  </Suspense>
</DashboardLayout>
```

## Animation Specifications

### Timing
- **Enter Duration:** 300ms
- **Exit Duration:** 200ms
- **Total Transition:** ~500ms (with overlap)

### Motion
- **Vertical Movement:** 8px (subtle, not distracting)
- **Opacity:** Full fade (0 → 1 → 0)
- **Transform:** GPU-accelerated for 60fps performance

### Easing Curves

#### Enter (Ease Out)
```
cubic-bezier(0.4, 0, 0.2, 1)
```
- Starts quickly, slows down at the end
- Makes content appear to "land" naturally

#### Exit (Ease In)
```
cubic-bezier(0.4, 0, 1, 1)
```
- Starts slowly, accelerates at the end
- Makes content appear to "lift off" naturally

## Performance Optimization

### GPU Acceleration
The animations only use GPU-accelerated properties:
- ✅ `opacity` - GPU accelerated
- ✅ `transform: translateY()` - GPU accelerated
- ❌ Avoids: `height`, `width`, `top`, `left` - CPU bound

### Memory Management
- Animations are automatically cleaned up when components unmount
- No memory leaks from animation frames
- Minimal impact on React reconciliation

### Bundle Size
- Framer Motion is already in the project (used elsewhere)
- PageTransition component: ~1.4 KB
- AnimatedOutlet component: ~700 bytes
- Total overhead: ~2.1 KB (minified)

## Browser Support

Works in all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Usage Examples

### Adding Transitions to a New Route

When adding a new route, transitions are automatically applied if it's a child of a layout that uses `AnimatedOutlet`:

```tsx
// src/routes/sections.tsx
{
  element: (
    <DashboardLayout>
      <Suspense fallback={renderFallback()}>
        <AnimatedOutlet />  {/* This enables transitions */}
      </Suspense>
    </DashboardLayout>
  ),
  children: [
    // All these routes get automatic transitions
    { path: 'new-page', element: <NewPage /> },
  ],
}
```

### Using PageTransition Directly

If you need to add transitions outside of routing:

```tsx
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from 'src/components/page-transition';

function MyComponent() {
  const [showContent, setShowContent] = useState(true);
  
  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <PageTransition key="content">
          <div>Your content</div>
        </PageTransition>
      )}
    </AnimatePresence>
  );
}
```

### Customizing Animation Duration

If you need different timing, modify the `PageTransition` component:

```tsx
// src/components/page-transition/page-transition.tsx
const pageVariants = {
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,  // Change from 0.3 to 0.5 for slower animation
      ease: EASE_OUT,
    },
  },
  // ...
};
```

## Troubleshooting

### Animations Not Working

**Symptoms:** Pages change instantly without animation

**Possible Causes:**
1. Missing `AnimatedOutlet` in layout
2. Missing `key` prop in AnimatePresence
3. Missing `AnimatePresence` wrapper

**Solution:**
Check that your route uses `AnimatedOutlet`:
```tsx
<Suspense fallback={renderFallback()}>
  <AnimatedOutlet />  {/* Not <Outlet /> */}
</Suspense>
```

### Janky/Stuttering Animations

**Symptoms:** Animations appear choppy or slow

**Possible Causes:**
1. Browser rendering performance issues
2. Too many elements animating at once
3. CPU-bound animations

**Solution:**
1. Check browser devtools Performance tab
2. Ensure only opacity and transform are animating
3. Reduce number of DOM elements on page

### Flash During Navigation

**Symptoms:** Brief flash of content before animation

**Possible Causes:**
1. Missing `mode="wait"` in AnimatePresence
2. Suspense boundary resolving too early

**Solution:**
Ensure AnimatePresence uses `mode="wait"`:
```tsx
<AnimatePresence mode="wait" initial={false}>
  <PageTransition key={location.pathname}>
    {outlet}
  </PageTransition>
</AnimatePresence>
```

### Layout Shift During Animation

**Symptoms:** Content jumps or shifts position

**Possible Causes:**
1. Parent container doesn't have defined dimensions
2. Content height changes during animation

**Solution:**
Ensure PageTransition has proper dimensions:
```tsx
<motion.div
  // ...
  style={{
    width: '100%',
    height: '100%',  // or 'auto' depending on layout
  }}
>
```

## Best Practices

### ✅ Do
- Use the existing `AnimatedOutlet` for route-based transitions
- Keep animations subtle (< 500ms total)
- Use GPU-accelerated properties only
- Test on slower devices
- Maintain consistent animation timing across the app

### ❌ Don't
- Don't nest multiple `AnimatePresence` components unnecessarily
- Don't animate layout properties (width, height, margin, padding)
- Don't use overly long durations (> 500ms feels sluggish)
- Don't add transitions to every single element (keep it tasteful)
- Don't forget to test with slow 3G throttling

## Related Documentation

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Router Documentation](https://reactrouter.com/)
- [Creating New Pages](./creating-new-pages.md)
- [Navigation Patterns](./navigation-patterns.md)

## Future Enhancements

Possible improvements for future iterations:

1. **Route-Specific Animations**
   - Different animations for different route types
   - Direction-aware transitions (forward vs. back)

2. **Shared Element Transitions**
   - Animate elements between pages (e.g., images)
   - Use framer-motion's layout animations

3. **Reduced Motion Support**
   - Respect `prefers-reduced-motion` media query
   - Disable animations for accessibility

4. **Performance Monitoring**
   - Track animation frame rates
   - Automatically disable on slow devices
