import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Culture Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Culture API endpoints
 */
export const CULTURE_ENDPOINTS = {
  getCultureset: '/Culture/set',
} as const;

/**
 * @returns Promise<void>
 */
export async function getCultureset(params?: {
  culture?: string;
  redirectUri?: string;
}): Promise<void> {
  await axiosInstance.get(CULTURE_ENDPOINTS.getCultureset, { params });
}
