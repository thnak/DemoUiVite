import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  OperationParameterSettingEntity,
  OperationParameterSettingEntityResult,
  OperationParameterSettingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OperationParameterSetting Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * OperationParameterSetting API endpoints
 */
export const OPERATIONPARAMETERSETTING_ENDPOINTS = {
  getOperationParameterSettingById: '/api/operationparametersetting/{id}',
  getOperationParameterSettingPage: '/api/operationparametersetting/get-page',
  createOperationParameterSetting: '/api/operationparametersetting/create',
  updateOperationParameterSetting: '/api/operationparametersetting/update/{id}',
  deleteOperationParameterSetting: '/api/operationparametersetting/delete/{id}',
  generateNewOperationParameterSettingCode: '/api/operationparametersetting/generate-new-code',
} as const;

/**
 * Get Operation Parameter Setting by ID
 *
 * Retrieves a specific Operation Parameter Setting entity by its unique identifier.
 * @returns Promise<OperationParameterSettingEntity>
 */
export async function getOperationParameterSettingById(id: string): Promise<OperationParameterSettingEntity> {
  const response = await axiosInstance.get<OperationParameterSettingEntity>(`/api/operationparametersetting/${id}`);
  return response.data;
}

/**
 * Get paginated list of Operation Parameter Setting
 *
 * Retrieves a paginated list of Operation Parameter Setting entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<OperationParameterSettingEntityBasePaginationResponse>
 */
export async function getOperationParameterSettingPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<OperationParameterSettingEntityBasePaginationResponse> {
  const response = await axiosInstance.post<OperationParameterSettingEntityBasePaginationResponse>(OPERATIONPARAMETERSETTING_ENDPOINTS.getOperationParameterSettingPage, data, { params });
  return response.data;
}

/**
 * Create a new Operation Parameter Setting
 *
 * Creates a new Operation Parameter Setting entity in the system.
 * @param data - Request body
 * @returns Promise<OperationParameterSettingEntityResult>
 */
export async function createOperationParameterSetting(data: OperationParameterSettingEntity): Promise<OperationParameterSettingEntityResult> {
  const response = await axiosInstance.post<OperationParameterSettingEntityResult>(OPERATIONPARAMETERSETTING_ENDPOINTS.createOperationParameterSetting, data);
  return response.data;
}

/**
 * Update an existing Operation Parameter Setting
 *
 * Updates specific fields of an existing Operation Parameter Setting entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateOperationParameterSetting(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/operationparametersetting/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Operation Parameter Setting
 *
 * Deletes a Operation Parameter Setting entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteOperationParameterSetting(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/operationparametersetting/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Operation Parameter Setting
 *
 * Generates a new unique code for a Operation Parameter Setting entity.
 * @returns Promise<string>
 */
export async function generateNewOperationParameterSettingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(OPERATIONPARAMETERSETTING_ENDPOINTS.generateNewOperationParameterSettingCode);
  return response.data;
}
