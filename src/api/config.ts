/**
 * API Configuration
 *
 * Provides base URL configuration for API calls.
 * - Development: Uses configurable localhost or IP address with port
 * - Production: Uses the origin base path
 */

// ----------------------------------------------------------------------

type ApiConfig = {
  baseUrl: string;
};

/**
 * Get the API base URL based on the environment
 *
 * @param devBaseUrl - Optional custom base URL for development (e.g., 'http://localhost:5000' or 'http://192.168.1.100:5000')
 * @returns The appropriate base URL for API calls
 */
export function getApiBaseUrl(devBaseUrl?: string): string {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment && devBaseUrl) {
    return devBaseUrl;
  }

  if (isDevelopment) {
    // Default development URL - can be overridden via environment variable
    return import.meta.env.VITE_API_BASE_URL || '';
  }

  // Production: use origin (same domain)
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
 * Useful for development to switch between different backend servers
 *
 * @param baseUrl - The new base URL (e.g., 'http://localhost:5000' or 'http://192.168.1.100:5000')
 */
export function setApiBaseUrl(baseUrl: string): void {
  apiConfig.baseUrl = baseUrl;
}
