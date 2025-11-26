import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Blob Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Blob API endpoints
 */
export const BLOB_ENDPOINTS = {
  postapiBlobUploadFile: '/api/Blob/UploadFile',
  getapiBlobDownloadFile: '/api/Blob/DownloadFile',
} as const;

/**
 * @returns Promise<void>
 */
export async function postapiBlobUploadFile(): Promise<void> {
  await axiosInstance.post(BLOB_ENDPOINTS.postapiBlobUploadFile);
}

/**
 * @returns Promise<void>
 */
export async function getapiBlobDownloadFile(params?: { fileName?: string }): Promise<void> {
  await axiosInstance.get(BLOB_ENDPOINTS.getapiBlobDownloadFile, { params });
}
