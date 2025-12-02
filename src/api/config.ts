/**
 * API Configuration
 *
 * Provides base URL configuration for API calls with browser-friendly debugging support.
 *
 * Configuration priority (highest to lowest):
 * 1. localStorage: 'API_BASE_URL' - Persists across browser sessions
 * 2. window.__APP_CONFIG__.apiBaseUrl - Can be set via public/config.js or at runtime
 * 3. Vite environment variable: VITE_API_BASE_URL (only available if set at build time)
 * 4. window.location.origin - Default fallback
 *
 * Debug in Chrome DevTools Console:
 *   - Set URL: localStorage.setItem('API_BASE_URL', 'http://localhost:5000')
 *   - Remove: localStorage.removeItem('API_BASE_URL')
 *   - Reload the page after changing
 */

// ----------------------------------------------------------------------

/**
 * Storage key for API base URL in localStorage
 */
const API_BASE_URL_STORAGE_KEY = 'API_BASE_URL';

/**
 * Window config interface for runtime configuration
 */
declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }
}

type ApiConfig = {
  baseUrl: string;
};

/**
 * Get the API base URL with browser-friendly fallback chain
 *
 * Priority:
 * 1. localStorage (persists across sessions, easy to set in DevTools)
 * 2. window.__APP_CONFIG__.apiBaseUrl (can be injected at runtime)
 * 3. VITE_API_BASE_URL environment variable (set at build time)
 * 4. window.location.origin (default fallback)
 *
 * @param devBaseUrl - Optional custom base URL override
 * @returns The appropriate base URL for API calls
 */
export function getApiBaseUrl(devBaseUrl?: string): string {
  // Highest priority: explicit parameter
  if (devBaseUrl) {
    return devBaseUrl;
  }

  // Priority 1: localStorage (easy to set in Chrome DevTools for debugging)
  try {
    const storedUrl = localStorage.getItem(API_BASE_URL_STORAGE_KEY);
    if (storedUrl) {
      return storedUrl;
    }
  } catch {
    // localStorage may not be available in some contexts
  }

  // Priority 2: window config (can be set via public/config.js or at runtime)
  if (window.__APP_CONFIG__?.apiBaseUrl) {
    return window.__APP_CONFIG__.apiBaseUrl;
  }

  // Priority 3: Vite environment variable (only works if set at build time)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Priority 4: Default to current origin
  return window.location.origin;
}

/**
 * API Configuration object
 */
export const apiConfig: ApiConfig = {
  baseUrl: getApiBaseUrl(),
};

/**
 * Update the API base URL at runtime
 * This updates the in-memory config. Use setApiBaseUrlPersistent to also save to localStorage.
 *
 * @param baseUrl - The new base URL (e.g., 'http://localhost:5000' or 'http://192.168.1.100:5000')
 */
export function setApiBaseUrl(baseUrl: string): void {
  apiConfig.baseUrl = baseUrl;
}

/**
 * Set the API base URL and persist it to localStorage
 * The URL will be remembered across browser sessions and page reloads.
 *
 * @param baseUrl - The new base URL (e.g., 'http://localhost:5000')
 */
export function setApiBaseUrlPersistent(baseUrl: string): void {
  try {
    localStorage.setItem(API_BASE_URL_STORAGE_KEY, baseUrl);
  } catch {
    // localStorage may not be available
  }
  apiConfig.baseUrl = baseUrl;
}

/**
 * Clear the persisted API base URL from localStorage
 * After clearing, the URL will fall back to the next priority source.
 */
export function clearApiBaseUrl(): void {
  try {
    localStorage.removeItem(API_BASE_URL_STORAGE_KEY);
  } catch {
    // localStorage may not be available
  }
  apiConfig.baseUrl = getApiBaseUrl();
}
