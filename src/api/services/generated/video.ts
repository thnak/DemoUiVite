import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Video Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Video API endpoints
 */
export const VIDEO_ENDPOINTS = {
  getapiVideostreamandsavefileName: '/api/Video/streamandsave/{fileName}',
} as const;

/**
 * @returns Promise<void>
 */
export async function getapiVideostreamandsavefileName(fileName: string): Promise<void> {
  await axiosInstance.get(`/api/Video/streamandsave/${fileName}`);
}
