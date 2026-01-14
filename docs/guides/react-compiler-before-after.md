# React Compiler Configuration - Before & After

## Before: Compiler Always Active

### Configuration
```typescript
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
});
```

### Issues
- ❌ Slow development server startup
- ❌ Slower HMR (Hot Module Replacement)
- ❌ Increased memory usage during development
- ❌ Longer build times for quick iterations

## After: Conditional Compilation

### Configuration
```typescript
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        // Only enable React Compiler in production builds
        plugins: mode === 'production' 
          ? [['babel-plugin-react-compiler', { target: '19' }]] 
          : [],
      },
    }),
  ],
}));
```

### Benefits
- ✅ Fast dev server startup (~270ms)
- ✅ Quick HMR updates
- ✅ Lower memory usage in development
- ✅ Production builds still fully optimized

## Performance Comparison

| Metric | Before | After |
|--------|--------|-------|
| Dev Server Startup | Slow with compiler overhead | ~270ms (Fast!) |
| HMR Speed | Slower (with transformations) | Quick (no compiler) |
| Development Experience | Heavy | Lightweight |
| Production Build | Optimized | Still Optimized |
| Bundle Size | N/A (same) | N/A (same) |
| Runtime Performance (prod) | Optimized | Optimized |

## How to Use

### Development (Fast Mode)
```bash
npm run dev
# Starts in ~270ms without React Compiler
# Changes reflect instantly via HMR
```

### Production (Optimized Mode)
```bash
npm run build
# Builds with React Compiler optimizations
# Components automatically memoized
# Fewer re-renders in production
```

### Preview Production Build
```bash
npm run start
# Previews the optimized production build
# Already compiled, no additional overhead
```

## Technical Details

### Mode Detection
Vite automatically sets the mode based on the command:
- `npm run dev` → `mode = 'development'`
- `npm run build` → `mode = 'production'`

### Conditional Logic
```typescript
plugins: mode === 'production' 
  ? [['babel-plugin-react-compiler', { target: '19' }]]  // Production: Enable
  : []                                                    // Development: Disable
```

## Best Practices

### Writing Compiler-Compatible Code
Even though the compiler only runs in production, write compiler-compatible code to get optimizations:

✅ **Good:**
```typescript
// Derive state with useMemo
const items = useMemo(() => {
  if (!data) return [];
  return data.items.map(transform);
}, [data]);

// Use full object dependencies
const handleSubmit = useCallback(() => {
  if (currentItem?.id) { /* ... */ }
}, [formData, currentItem]); // Full object
```

❌ **Avoid:**
```typescript
// setState in useEffect (not optimized)
useEffect(() => {
  if (data) setItems(data.items);
}, [data]);

// Partial dependencies (not optimized)
const handleSubmit = useCallback(() => {
  if (currentItem?.id) { /* ... */ }
}, [formData, currentItem?.id]); // Partial reference
```

## Verification

### Check Development Mode
```bash
npm run dev
# Look for: "VITE ready in XXXms"
# Should be fast (~270ms or similar)
```

### Check Production Build
```bash
npm run build
# Look for: "✓ built in XXs"
# React Compiler active during build
```

## Rollback (if needed)

To go back to always-on compiler:
```typescript
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
});
```

## Summary

This configuration provides the best of both worlds:
- **Fast, responsive development** without compiler overhead
- **Optimized production builds** with automatic React Compiler optimizations
- **No code changes required** - all components work as before
- **Future-proof** - ready for React 19+ features
