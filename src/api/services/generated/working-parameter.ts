import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WorkingParameterEntity,
  WorkingParameterEntityBasePaginationResponse,
  WorkingParameterEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkingParameter Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * WorkingParameter API endpoints
 */
export const WORKINGPARAMETER_ENDPOINTS = {
  getWorkingParameterById: '/api/workingparameter/{id}',
  getWorkingParameterPage: '/api/workingparameter/get-page',
  createWorkingParameter: '/api/workingparameter/create',
  updateWorkingParameter: '/api/workingparameter/update/{id}',
  deleteWorkingParameter: '/api/workingparameter/delete/{id}',
  generateNewWorkingParameterCode: '/api/workingparameter/generate-new-code',
} as const;

/**
 * Get Working Parameter by ID
 *
 * Retrieves a specific Working Parameter entity by its unique identifier.
 * @returns Promise<WorkingParameterEntity>
 */
export async function getWorkingParameterById(id: string): Promise<WorkingParameterEntity> {
  const response = await axiosInstance.get<WorkingParameterEntity>(`/api/workingparameter/${id}`);
  return response.data;
}

/**
 * Get paginated list of Working Parameter
 *
 * Retrieves a paginated list of Working Parameter entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WorkingParameterEntityBasePaginationResponse>
 */
export async function getWorkingParameterPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<WorkingParameterEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WorkingParameterEntityBasePaginationResponse>(WORKINGPARAMETER_ENDPOINTS.getWorkingParameterPage, data, { params });
  return response.data;
}

/**
 * Create a new Working Parameter
 *
 * Creates a new Working Parameter entity in the system.
 * @param data - Request body
 * @returns Promise<WorkingParameterEntityResult>
 */
export async function createWorkingParameter(data: WorkingParameterEntity): Promise<WorkingParameterEntityResult> {
  const response = await axiosInstance.post<WorkingParameterEntityResult>(WORKINGPARAMETER_ENDPOINTS.createWorkingParameter, data);
  return response.data;
}

/**
 * Update an existing Working Parameter
 *
 * Updates specific fields of an existing Working Parameter entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWorkingParameter(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/workingparameter/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Working Parameter
 *
 * Deletes a Working Parameter entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWorkingParameter(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/workingparameter/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Working Parameter
 *
 * Generates a new unique code for a Working Parameter entity.
 * @returns Promise<string>
 */
export async function generateNewWorkingParameterCode(): Promise<string> {
  const response = await axiosInstance.get<string>(WORKINGPARAMETER_ENDPOINTS.generateNewWorkingParameterCode);
  return response.data;
}
