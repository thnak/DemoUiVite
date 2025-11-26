import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  MachineTypeEntity,
  MachineTypeEntityBasePaginationResponse,
  MachineTypeEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineType Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * MachineType API endpoints
 */
export const MACHINETYPE_ENDPOINTS = {
  getMachineTypeById: '/api/machinetype/{id}',
  getMachineTypePage: '/api/machinetype/get-page',
  createMachineType: '/api/machinetype/create',
  updateMachineType: '/api/machinetype/update/{id}',
  deleteMachineType: '/api/machinetype/delete/{id}',
  generateNewMachineTypeCode: '/api/machinetype/generate-new-code',
} as const;

/**
 * Get Machine Type by ID
 *
 * Retrieves a specific Machine Type entity by its unique identifier.
 * @returns Promise<MachineTypeEntity>
 */
export async function getMachineTypeById(id: string): Promise<MachineTypeEntity> {
  const response = await axiosInstance.get<MachineTypeEntity>(`/api/machinetype/${id}`);
  return response.data;
}

/**
 * Get paginated list of Machine Type
 *
 * Retrieves a paginated list of Machine Type entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MachineTypeEntityBasePaginationResponse>
 */
export async function getMachineTypePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<MachineTypeEntityBasePaginationResponse> {
  const response = await axiosInstance.post<MachineTypeEntityBasePaginationResponse>(MACHINETYPE_ENDPOINTS.getMachineTypePage, data, { params });
  return response.data;
}

/**
 * Create a new Machine Type
 *
 * Creates a new Machine Type entity in the system.
 * @param data - Request body
 * @returns Promise<MachineTypeEntityResult>
 */
export async function createMachineType(data: MachineTypeEntity): Promise<MachineTypeEntityResult> {
  const response = await axiosInstance.post<MachineTypeEntityResult>(MACHINETYPE_ENDPOINTS.createMachineType, data);
  return response.data;
}

/**
 * Update an existing Machine Type
 *
 * Updates specific fields of an existing Machine Type entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMachineType(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/machinetype/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Machine Type
 *
 * Deletes a Machine Type entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMachineType(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/machinetype/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Machine Type
 *
 * Generates a new unique code for a Machine Type entity.
 * @returns Promise<string>
 */
export async function generateNewMachineTypeCode(): Promise<string> {
  const response = await axiosInstance.get<string>(MACHINETYPE_ENDPOINTS.generateNewMachineTypeCode);
  return response.data;
}
