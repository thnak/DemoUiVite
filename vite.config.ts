import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        // Only enable React Compiler in production builds for better performance
        // Keep dev mode fast by skipping compiler transformations
        plugins: mode === 'production' ? [['babel-plugin-react-compiler', { target: '19' }]] : [],
      },
    }),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
      enableBuild: false, // Disable checker in production build to avoid blocking on warnings
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
