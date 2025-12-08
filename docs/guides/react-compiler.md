# React Compiler

This project uses the [React Compiler](https://react.dev/learn/react-compiler) (babel-plugin-react-compiler) to automatically optimize React components for better performance.

## What is React Compiler?

React Compiler is an experimental compiler that automatically optimizes your React code. It reduces the need for manual memoization with `useMemo`, `useCallback`, and `memo` by automatically applying optimizations during the build process.

## Features

- **Automatic Memoization**: The compiler automatically memoizes components and values where beneficial
- **Reduced Boilerplate**: Less need for manual `useMemo`, `useCallback`, and `React.memo`
- **Better Performance**: Optimized re-renders without manual intervention
- **Backward Compatible**: Works with existing React code without requiring changes

## How It Works

The React Compiler is integrated into the Vite build pipeline through the `@vitejs/plugin-react` plugin with Babel. During development and production builds, the compiler analyzes your React components and automatically applies optimizations.

## Configuration

The compiler is configured in `vite.config.ts`:

```typescript
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}],
        ],
      },
    }),
  ],
});
```

## Best Practices

While the React Compiler handles many optimizations automatically, keep these practices in mind:

1. **Write idiomatic React**: The compiler works best with standard React patterns
2. **Avoid side effects in render**: Keep renders pure for best optimization results
3. **Test thoroughly**: While the compiler is designed to be safe, always test your components
4. **Profile performance**: Use React DevTools Profiler to verify optimizations

## Limitations

- The React Compiler is experimental and may change
- Some edge cases might not be optimized
- Complex patterns with side effects may not benefit as much

## Disabling for Specific Components

If you need to opt-out of compilation for specific components, you can use the `"use no memo"` directive:

```tsx
function MyComponent() {
  "use no memo";
  // Component code that should not be compiled
}
```

## Learn More

- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [React Compiler Playground](https://playground.react.dev/)

## Migration Notes

This project was migrated from `@vitejs/plugin-react-swc` to `@vitejs/plugin-react` to enable React Compiler support, as the compiler requires Babel for transformation.
