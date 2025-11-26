import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Cache Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Cache API endpoints
 */
export const CACHE_ENDPOINTS = {
  getapiCacheclear: '/api/Cache/clear',
} as const;

/**
 * @returns Promise<void>
 */
export async function getapiCacheclear(): Promise<void> {
  await axiosInstance.get(CACHE_ENDPOINTS.getapiCacheclear);
}
