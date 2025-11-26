import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  AdminGlobalSettingEntity,
  StringObjectKeyValuePair,
  AdminGlobalSettingEntityResult,
  AdminGlobalSettingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// AdminGlobalSetting Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * AdminGlobalSetting API endpoints
 */
export const ADMINGLOBALSETTING_ENDPOINTS = {
  getAdminGlobalSettingById: '/api/adminglobalsetting/{id}',
  getAdminGlobalSettingPage: '/api/adminglobalsetting/get-page',
  createAdminGlobalSetting: '/api/adminglobalsetting/create',
  updateAdminGlobalSetting: '/api/adminglobalsetting/update/{id}',
  deleteAdminGlobalSetting: '/api/adminglobalsetting/delete/{id}',
  generateNewAdminGlobalSettingCode: '/api/adminglobalsetting/generate-new-code',
} as const;

/**
 * Get Admin Global Setting by ID
 *
 * Retrieves a specific Admin Global Setting entity by its unique identifier.
 * @returns Promise<AdminGlobalSettingEntity>
 */
export async function getAdminGlobalSettingById(id: string): Promise<AdminGlobalSettingEntity> {
  const response = await axiosInstance.get<AdminGlobalSettingEntity>(
    `/api/adminglobalsetting/${id}`
  );
  return response.data;
}

/**
 * Get paginated list of Admin Global Setting
 *
 * Retrieves a paginated list of Admin Global Setting entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<AdminGlobalSettingEntityBasePaginationResponse>
 */
export async function getAdminGlobalSettingPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<AdminGlobalSettingEntityBasePaginationResponse> {
  const response = await axiosInstance.post<AdminGlobalSettingEntityBasePaginationResponse>(
    ADMINGLOBALSETTING_ENDPOINTS.getAdminGlobalSettingPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Admin Global Setting
 *
 * Creates a new Admin Global Setting entity in the system.
 * @param data - Request body
 * @returns Promise<AdminGlobalSettingEntityResult>
 */
export async function createAdminGlobalSetting(
  data: AdminGlobalSettingEntity
): Promise<AdminGlobalSettingEntityResult> {
  const response = await axiosInstance.post<AdminGlobalSettingEntityResult>(
    ADMINGLOBALSETTING_ENDPOINTS.createAdminGlobalSetting,
    data
  );
  return response.data;
}

/**
 * Update an existing Admin Global Setting
 *
 * Updates specific fields of an existing Admin Global Setting entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateAdminGlobalSetting(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/adminglobalsetting/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Admin Global Setting
 *
 * Deletes a Admin Global Setting entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteAdminGlobalSetting(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(
    `/api/adminglobalsetting/delete/${id}`
  );
  return response.data;
}

/**
 * Generate a new code for Admin Global Setting
 *
 * Generates a new unique code for a Admin Global Setting entity.
 * @returns Promise<string>
 */
export async function generateNewAdminGlobalSettingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    ADMINGLOBALSETTING_ENDPOINTS.generateNewAdminGlobalSettingCode
  );
  return response.data;
}
