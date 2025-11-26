import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Test Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Test API endpoints
 */
export const TEST_ENDPOINTS = {
  getapiTeststream: '/api/Test/stream',
} as const;

/**
 * @returns Promise<void>
 */
export async function getapiTeststream(): Promise<void> {
  await axiosInstance.get(TEST_ENDPOINTS.getapiTeststream);
}
