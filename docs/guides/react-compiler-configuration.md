# React Compiler Configuration Guide

## Overview

This project uses the React Compiler (babel-plugin-react-compiler) to automatically optimize React components in production builds. The compiler is configured to run **only during production builds** to maintain fast development iteration cycles.

## Why Conditional Compilation?

### The Problem
Running React Compiler in development mode adds significant overhead:
- Slower dev server startup
- Slower Hot Module Replacement (HMR)
- Increased build times during development
- More memory usage

### The Solution
Enable React Compiler only for production builds where optimization matters most:

```typescript
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        // Conditional compilation based on mode
        plugins: mode === 'production' 
          ? [['babel-plugin-react-compiler', { target: '19' }]] 
          : [],
      },
    }),
  ],
}));
```

## Performance Comparison

| Metric | Development (Without Compiler) | Production (With Compiler) |
|--------|-------------------------------|---------------------------|
| Dev Server Startup | ~270ms | N/A |
| HMR Speed | Fast | N/A |
| Build Time | N/A | ~28s |
| Bundle Optimization | None | Automatic memoization |
| Runtime Performance | Standard | Optimized (fewer re-renders) |

## Configuration

### Current Setup (vite.config.ts)

```typescript
import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PORT = 3039;

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
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
}));
```

### Mode Detection

Vite automatically sets the mode:
- **Development**: `npm run dev` → `mode = 'development'`
- **Production**: `npm run build` → `mode = 'production'`
- **Preview**: `npm run start` → Uses production build (already compiled)

## How It Works

### Development Mode (`npm run dev`)
1. Vite starts with `mode = 'development'`
2. React plugin receives empty babel plugins array `[]`
3. No React Compiler transformations applied
4. Fast compilation and HMR
5. Standard React behavior (no automatic optimizations)

### Production Mode (`npm run build`)
1. Vite builds with `mode = 'production'`
2. React plugin receives `[['babel-plugin-react-compiler', { target: '19' }]]`
3. React Compiler analyzes and optimizes all React components
4. Automatic memoization added where beneficial
5. Optimized bundle with fewer runtime re-renders

## Benefits

### Development Benefits ✅
- **Fast startup**: Dev server ready in ~270ms
- **Quick HMR**: Changes reflect instantly
- **Lower memory usage**: No compiler overhead
- **Simpler debugging**: No compiler transformations to trace through

### Production Benefits ✅
- **Automatic optimization**: Compiler adds memoization where needed
- **Fewer re-renders**: Better runtime performance
- **Smaller impact on re-renders**: Components only update when truly necessary
- **Future-proof**: Ready for React 19+ features

## Writing Compiler-Compatible Code

Even though the compiler only runs in production, you should still write compiler-compatible code to get optimizations in production builds.

### ✅ Do This

```typescript
// Derive state with useMemo
const items = useMemo(() => {
  if (!data) return [];
  return data.items.map(item => ({
    id: item.id,
    name: item.name,
  }));
}, [data]);

// Use full object dependencies
const handleSubmit = useCallback(() => {
  if (currentItem?.id) { /* ... */ }
}, [formData, currentItem]); // Full object, not currentItem?.id

// Initialize state with useMemo
const initialFormData = useMemo(() => {
  if (isEdit && currentData) {
    return { name: currentData.name };
  }
  return { name: '' };
}, [isEdit, currentData]);

const [formData, setFormData] = useState(initialFormData);
```

### ❌ Avoid This

```typescript
// WRONG: setState in useEffect
useEffect(() => {
  if (data) {
    setItems(data.items); // Won't be optimized
  }
}, [data]);

// WRONG: Partial dependencies
const handleSubmit = useCallback(() => {
  if (currentItem?.id) { /* ... */ }
}, [formData, currentItem?.id]); // Partial reference

// WRONG: Using `this` keyword
action(this: any) { 
  this.next(); // Not supported by compiler
}
```

## Testing

### Verify Development Mode (Fast)
```bash
npm run dev
```
Expected: Server starts in ~270ms

### Verify Production Build (Optimized)
```bash
npm run build
```
Expected: Build completes in ~28s with React Compiler optimizations

## Troubleshooting

### Issue: Dev server is slow
**Solution**: Check that `mode === 'production'` check is working correctly in vite.config.ts

### Issue: Production build errors
**Solution**: Fix React Compiler compatibility issues (see ESLint warnings)

### Issue: Want to test compiler in dev mode
**Solution**: Temporarily change the condition:
```typescript
// For testing only - revert after testing
plugins: [['babel-plugin-react-compiler', { target: '19' }]]
```

## References

- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [Vite Configuration API](https://vitejs.dev/config/)
- [babel-plugin-react-compiler](https://www.npmjs.com/package/babel-plugin-react-compiler)

## Migration Notes

### Previous Configuration
Previously, React Compiler ran in both dev and production modes, causing slow development cycles.

### Current Configuration
React Compiler now runs only in production, providing optimal development experience while maintaining production performance benefits.

### No Breaking Changes
- All existing code continues to work
- Components are automatically optimized in production
- Development workflow is now faster
