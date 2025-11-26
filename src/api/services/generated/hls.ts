import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Hls Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Hls API endpoints
 */
export const HLS_ENDPOINTS = {
  getapihlsfileNameplaylistm3u8: '/api/hls/{fileName}/playlist.m3u8',
  getapihlsfileNamesegmentssegmentName: '/api/hls/{fileName}/segments/{segmentName}',
  postapihlsfileNametranscode: '/api/hls/{fileName}/transcode',
} as const;

/**
 * @returns Promise<void>
 */
export async function getapihlsfileNameplaylistm3u8(fileName: string): Promise<void> {
  await axiosInstance.get(`/api/hls/${fileName}/playlist.m3u8`);
}

/**
 * @returns Promise<void>
 */
export async function getapihlsfileNamesegmentssegmentName(
  fileName: string,
  segmentName: string
): Promise<void> {
  await axiosInstance.get(`/api/hls/${fileName}/segments/${segmentName}`);
}

/**
 * @returns Promise<void>
 */
export async function postapihlsfileNametranscode(fileName: string): Promise<void> {
  await axiosInstance.post(`/api/hls/${fileName}/transcode`);
}
