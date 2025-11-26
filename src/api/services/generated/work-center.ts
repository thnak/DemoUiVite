import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// WorkCenter Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * WorkCenter API endpoints
 */
export const WORKCENTER_ENDPOINTS = {
  getapiWorkCentersearchbycode: '/api/WorkCenter/search-by-code',
} as const;

/**
 * Tìm kiếm group Code theo mã hoặc tên
 * @returns Promise<void>
 */
export async function getapiWorkCentersearchbycode(params?: { keyword?: string }): Promise<void> {
  await axiosInstance.get(WORKCENTER_ENDPOINTS.getapiWorkCentersearchbycode, { params });
}
