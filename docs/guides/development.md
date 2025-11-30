# Development Guide

This guide provides detailed instructions for setting up your development environment, debugging, and troubleshooting common issues in the DemoUiVite project.

## Overview

This document covers:
- Environment variables configuration
- Debugging with VS Code and WebStorm
- Common index and routing issues
- Development tips and best practices

## Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- VS Code or WebStorm IDE
- Git

## Environment Variables

### Vite Environment Variables

Vite uses `.env` files for environment configuration. Variables must be prefixed with `VITE_` to be exposed to the client-side code.

### Setting Up Environment Files

Create environment files in the project root:

```bash
# Development environment
.env.development

# Production environment
.env.production

# Local overrides (not committed to git)
.env.local
.env.development.local
.env.production.local
```

### Example Configuration

Create a `.env.development` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true

# App Configuration
VITE_APP_NAME=Demo UI Vite (Dev)
```

### Accessing Environment Variables

In your code, access environment variables using `import.meta.env`:

```tsx
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG_MODE === 'true';
const appName = import.meta.env.VITE_APP_NAME;

// Built-in variables
const isDev = import.meta.env.DEV;        // true in development
const isProd = import.meta.env.PROD;      // true in production
const mode = import.meta.env.MODE;        // 'development' or 'production'
```

### Type Safety for Environment Variables

Add type definitions for your environment variables in `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Debugging with VS Code

### Setup Launch Configuration

Create or update `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3039",
      "webRoot": "${workspaceFolder}/src",
      "preLaunchTask": "npm: dev"
    },
    {
      "name": "Attach to Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "webRoot": "${workspaceFolder}/src",
      "url": "http://localhost:3039"
    },
    {
      "name": "Launch Edge",
      "type": "msedge",
      "request": "launch",
      "url": "http://localhost:3039",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Setup Tasks

Create or update `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm: dev",
      "type": "npm",
      "script": "dev",
      "isBackground": true,
      "problemMatcher": {
        "owner": "typescript",
        "pattern": {
          "regexp": "^(.*):(\\d+):(\\d+): (error|warning) (.*)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "severity": 4,
          "message": 5
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "VITE",
          "endsPattern": "ready in"
        }
      }
    },
    {
      "label": "npm: build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "npm: lint",
      "type": "npm",
      "script": "lint",
      "problemMatcher": ["$eslint-stylish"]
    }
  ]
}
```

### Recommended VS Code Extensions

Create or update `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "mikestead.dotenv"
  ]
}
```

### VS Code Settings for the Project

Create or update `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.paths": true,
  "files.associations": {
    "*.css": "css"
  }
}
```

### Debugging Steps for VS Code

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Set breakpoints** in your TypeScript/TSX files by clicking in the gutter (left of line numbers).

3. **Launch debugger:**
   - Press `F5` or go to Run → Start Debugging
   - Select "Launch Chrome" configuration

4. **Debug features:**
   - Step over (F10), Step into (F11), Step out (Shift+F11)
   - Watch variables in the Variables panel
   - Use the Debug Console for evaluating expressions
   - Check the Call Stack for execution flow

### Using Browser DevTools with VS Code

For debugging with environment variables visible:

1. Open Chrome DevTools (F12)
2. Go to Sources → Filesystem → Add folder to workspace
3. Select your project's `src` folder
4. Set breakpoints directly in DevTools

## Debugging with WebStorm

### Setup Run/Debug Configuration

1. **Create a new configuration:**
   - Go to Run → Edit Configurations
   - Click `+` → JavaScript Debug

2. **Configure the debugger:**
   ```
   Name: Debug DemoUiVite
   URL: http://localhost:3039
   Browser: Chrome
   ```

3. **Add a npm script configuration:**
   - Click `+` → npm
   - Configure:
     ```
     Name: Dev Server
     Command: run
     Scripts: dev
     ```

### WebStorm Compound Configuration

Create a compound configuration to start both the server and debugger:

1. Go to Run → Edit Configurations
2. Click `+` → Compound
3. Name it "Debug with Server"
4. Add both "Dev Server" and "Debug DemoUiVite" configurations

### WebStorm Debugging Steps

1. **Set breakpoints:**
   - Click in the gutter next to line numbers
   - Or press Ctrl+F8 on the target line

2. **Start debugging:**
   - Click the debug icon (bug) next to your configuration
   - Or use Shift+F9

3. **Debug controls:**
   - Step Over: F8
   - Step Into: F7
   - Step Out: Shift+F8
   - Resume: F9
   - Evaluate Expression: Alt+F8

### WebStorm Environment Variables

Configure environment variables in WebStorm:

1. Go to Run → Edit Configurations
2. Select your npm configuration
3. Find "Environment" field
4. Add variables: `VITE_API_BASE_URL=http://localhost:5000`

Or use a `.env` file (WebStorm automatically loads `.env` files).

### WebStorm TypeScript Settings

For optimal TypeScript support:

1. Go to Settings → Languages & Frameworks → TypeScript
2. Enable "TypeScript Language Service"
3. Set TypeScript version to "Project" or "Bundled"
4. Enable "Recompile on changes"

## Fixing Common Index Issues

### Issue 1: Blank Page After Build

**Symptom:** The app works in development but shows a blank page in production.

**Cause:** Incorrect base path configuration or asset loading issues.

**Solution:**

Check `vite.config.ts` for the `base` option:

```typescript
export default defineConfig({
  base: '/', // Use '/' for root deployment
  // or
  base: '/your-sub-path/', // For subdirectory deployment
});
```

### Issue 2: 404 on Page Refresh (SPA Routing)

**Symptom:** Direct URL access or page refresh returns 404.

**Cause:** Server doesn't know to serve `index.html` for all routes.

**Solution for Development:**

The Vite dev server handles this automatically. No changes needed.

**Solution for Production:**

For Vercel (already configured in `vercel.json`):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

For Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

For Apache (`.htaccess`):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Issue 3: Module Not Found Errors

**Symptom:** `Cannot find module 'src/...'` errors.

**Cause:** Path alias not resolved correctly.

**Solution:**

1. Check `vite.config.ts` has the correct alias:

```typescript
resolve: {
  alias: [
    {
      find: /^src(.+)/,
      replacement: path.resolve(process.cwd(), 'src/$1'),
    },
  ],
},
```

2. Ensure `tsconfig.json` has matching paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "src/*": ["src/*"]
    }
  }
}
```

### Issue 4: API Service Generation Fails

**Symptom:** `npm run generate:api` fails or produces empty files.

**Cause:** Invalid or missing OpenAPI specification.

**Solution:**

1. Verify `docs/api/response.json` exists and is valid JSON
2. Check the OpenAPI spec format:
   ```bash
   npx jsonlint docs/api/response.json
   ```
3. Regenerate API services:
   ```bash
   npm run generate:api
   ```

### Issue 5: Hot Module Replacement (HMR) Not Working

**Symptom:** Changes don't reflect without full page refresh.

**Cause:** HMR connection issues or incorrect file structure.

**Solution:**

1. Check console for HMR errors
2. Ensure Vite is running with the correct host:
   ```typescript
   // vite.config.ts
   server: {
     port: 3039,
     host: true, // Allow external connections
   }
   ```
3. Try clearing the Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Issue 6: TypeScript Errors in Generated Files

**Symptom:** Type errors in `src/api/types/generated.ts` or similar.

**Cause:** Outdated generated code or OpenAPI spec changes.

**Solution:**

```bash
# Regenerate all API code
npm run generate:api

# Then fix any linting issues
npm run lint:fix
```

## Development Tips

### Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run fm:check` | Check Prettier formatting |
| `npm run fm:fix` | Auto-fix formatting |
| `npm run fix:all` | Fix all linting and formatting |
| `npm run generate:api` | Generate API services |

### Performance Debugging

Use React DevTools Profiler:

1. Install [React DevTools](https://react.dev/learn/react-developer-tools) browser extension
2. Open DevTools → Components/Profiler tab
3. Click "Start profiling" and interact with the app
4. Analyze render times and component updates

### Network Debugging

1. Open DevTools → Network tab
2. Filter by XHR/Fetch for API calls
3. Check request/response payloads
4. Look for failed requests (red entries)

### Useful Console Commands

```javascript
// Check current environment
console.log(import.meta.env);

// Get current route
console.log(window.location.pathname);

// Access React Query cache (in DevTools console)
window.__REACT_QUERY_DEVTOOLS__ // if devtools installed
```

### VS Code Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F5` | Start Debugging |
| `F9` | Toggle Breakpoint |
| `F10` | Step Over |
| `F11` | Step Into |
| `Shift+F11` | Step Out |
| `Ctrl+Shift+F5` | Restart Debugging |
| `Shift+F5` | Stop Debugging |

### WebStorm Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+F9` | Debug |
| `Ctrl+F8` | Toggle Breakpoint |
| `F8` | Step Over |
| `F7` | Step Into |
| `Shift+F8` | Step Out |
| `F9` | Resume |
| `Alt+F8` | Evaluate Expression |

## Troubleshooting

### Common Error Messages

**"Cannot find module" or "Module not found"**
- Run `npm install` to ensure all dependencies are installed
- Check import paths for typos
- Verify the file exists at the specified path

**"Port already in use"**
- Another process is using port 3039
- Find and stop the process: `lsof -i :3039` (macOS/Linux) or `netstat -ano | findstr :3039` (Windows)
- Or change the port in `vite.config.ts`

**"TypeScript error: Cannot find name 'import'"**
- Ensure you're using TypeScript 5+
- Check `tsconfig.json` has `"module": "ESNext"` or similar

**Build fails with memory issues**
- Increase Node.js memory: `export NODE_OPTIONS="--max-old-space-size=4096"`
- Then run: `npm run build`

## Related Documentation

- [Quickstart Guide](./quickstart.md) - Getting started with the project
- [API Services](./api-usage.md) - Using auto-generated API services
- [i18n Documentation](./i18n.md) - Multi-language support
