import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// StaticFile Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * StaticFile API endpoints
 */
export const STATICFILE_ENDPOINTS = {
  postapiStaticFileupload: '/api/StaticFile/upload',
  deleteapiStaticFiledelete: '/api/StaticFile/delete',
  postapiStaticFilerequestadultcontent: '/api/StaticFile/request-adult-content',
} as const;

/**
 * @returns Promise<void>
 */
export async function postapiStaticFileupload(params?: { subPath?: string }): Promise<void> {
  await axiosInstance.post(STATICFILE_ENDPOINTS.postapiStaticFileupload, null, { params });
}

/**
 * @returns Promise<void>
 */
export async function deleteapiStaticFiledelete(params?: { relativePath?: string }): Promise<void> {
  await axiosInstance.delete(STATICFILE_ENDPOINTS.deleteapiStaticFiledelete, { params });
}

/**
 * @returns Promise<void>
 */
export async function postapiStaticFilerequestadultcontent(params?: { relativePath?: string }): Promise<void> {
  await axiosInstance.post(STATICFILE_ENDPOINTS.postapiStaticFilerequestadultcontent, null, { params });
}
