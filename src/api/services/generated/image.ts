import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Image Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Image API endpoints
 */
export const IMAGE_ENDPOINTS = {
  getapiImagegeneratesize: '/api/Image/generate/{size}',
  postapiImagefavicon: '/api/Image/favicon',
} as const;

/**
 * @returns Promise<void>
 */
export async function getapiImagegeneratesize(size: string, params?: { text?: string }): Promise<void> {
  await axiosInstance.get(`/api/Image/generate/${size}`, { params });
}

/**
 * @returns Promise<void>
 */
export async function postapiImagefavicon(): Promise<void> {
  await axiosInstance.post(IMAGE_ENDPOINTS.postapiImagefavicon);
}
