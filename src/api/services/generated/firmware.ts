import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  GetAllFirmwareVersionsResponse,
  GetAllFirmwareVersionsResponsePaginationQuery,
  SortType,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Firmware Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Firmware API endpoints
 */
export const FIRMWARE_ENDPOINTS = {
  postapiFirmwarecraftnewrelease: '/api/Firmware/craft-new-release',
  getapiFirmwaregetid: '/api/Firmware/get/{id}',
  getapiFirmwaredownloadid: '/api/Firmware/download/{id}',
  postapiFirmwaregetlatestfirmwareversion: '/api/Firmware/get-latest-firmware-version',
  postapiFirmwarepublish: '/api/Firmware/publish',
} as const;

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiFirmwarecraftnewrelease(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(FIRMWARE_ENDPOINTS.postapiFirmwarecraftnewrelease);
  return response.data;
}

/**
 * @returns Promise<GetAllFirmwareVersionsResponse>
 */
export async function getapiFirmwaregetid(id: string): Promise<GetAllFirmwareVersionsResponse> {
  const response = await axiosInstance.get<GetAllFirmwareVersionsResponse>(`/api/Firmware/get/${id}`);
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function getapiFirmwaredownloadid(id: string): Promise<void> {
  await axiosInstance.get(`/api/Firmware/download/${id}`);
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<GetAllFirmwareVersionsResponsePaginationQuery>
 */
export async function postapiFirmwaregetlatestfirmwareversion(data: SortType[], params?: { ModelTypeId?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<GetAllFirmwareVersionsResponsePaginationQuery> {
  const response = await axiosInstance.post<GetAllFirmwareVersionsResponsePaginationQuery>(FIRMWARE_ENDPOINTS.postapiFirmwaregetlatestfirmwareversion, data, { params });
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiFirmwarepublish(params?: { id?: string }): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(FIRMWARE_ENDPOINTS.postapiFirmwarepublish, null, { params });
  return response.data;
}
