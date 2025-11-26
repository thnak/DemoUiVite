import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  SystemSettingEntity,
  StringObjectKeyValuePair,
  SystemSettingEntityResult,
  SystemSettingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemSetting Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * SystemSetting API endpoints
 */
export const SYSTEMSETTING_ENDPOINTS = {
  getSystemSettingById: '/api/systemsetting/{id}',
  getSystemSettingPage: '/api/systemsetting/get-page',
  createSystemSetting: '/api/systemsetting/create',
  updateSystemSetting: '/api/systemsetting/update/{id}',
  deleteSystemSetting: '/api/systemsetting/delete/{id}',
  generateNewSystemSettingCode: '/api/systemsetting/generate-new-code',
} as const;

/**
 * Get System Setting by ID
 *
 * Retrieves a specific System Setting entity by its unique identifier.
 * @returns Promise<SystemSettingEntity>
 */
export async function getSystemSettingById(id: string): Promise<SystemSettingEntity> {
  const response = await axiosInstance.get<SystemSettingEntity>(`/api/systemsetting/${id}`);
  return response.data;
}

/**
 * Get paginated list of System Setting
 *
 * Retrieves a paginated list of System Setting entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SystemSettingEntityBasePaginationResponse>
 */
export async function getSystemSettingPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<SystemSettingEntityBasePaginationResponse> {
  const response = await axiosInstance.post<SystemSettingEntityBasePaginationResponse>(
    SYSTEMSETTING_ENDPOINTS.getSystemSettingPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new System Setting
 *
 * Creates a new System Setting entity in the system.
 * @param data - Request body
 * @returns Promise<SystemSettingEntityResult>
 */
export async function createSystemSetting(
  data: SystemSettingEntity
): Promise<SystemSettingEntityResult> {
  const response = await axiosInstance.post<SystemSettingEntityResult>(
    SYSTEMSETTING_ENDPOINTS.createSystemSetting,
    data
  );
  return response.data;
}

/**
 * Update an existing System Setting
 *
 * Updates specific fields of an existing System Setting entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateSystemSetting(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/systemsetting/update/${id}`, data);
  return response.data;
}

/**
 * Delete a System Setting
 *
 * Deletes a System Setting entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteSystemSetting(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/systemsetting/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for System Setting
 *
 * Generates a new unique code for a System Setting entity.
 * @returns Promise<string>
 */
export async function generateNewSystemSettingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    SYSTEMSETTING_ENDPOINTS.generateNewSystemSettingCode
  );
  return response.data;
}
