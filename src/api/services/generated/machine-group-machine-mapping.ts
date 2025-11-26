import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  MachineGroupMachineMapping,
  MachineGroupMachineMappingBasePaginationResponse,
  MachineGroupMachineMappingResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineGroupMachineMapping Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * MachineGroupMachineMapping API endpoints
 */
export const MACHINEGROUPMACHINEMAPPING_ENDPOINTS = {
  getMachineGroupMachineMappingById: '/api/machinegroupmachinemapping/{id}',
  getMachineGroupMachineMappingPage: '/api/machinegroupmachinemapping/get-page',
  createMachineGroupMachineMapping: '/api/machinegroupmachinemapping/create',
  updateMachineGroupMachineMapping: '/api/machinegroupmachinemapping/update/{id}',
  deleteMachineGroupMachineMapping: '/api/machinegroupmachinemapping/delete/{id}',
  generateNewMachineGroupMachineMappingCode: '/api/machinegroupmachinemapping/generate-new-code',
} as const;

/**
 * Get Machine Group Machine Mapping by ID
 *
 * Retrieves a specific Machine Group Machine Mapping entity by its unique identifier.
 * @returns Promise<MachineGroupMachineMapping>
 */
export async function getMachineGroupMachineMappingById(id: string): Promise<MachineGroupMachineMapping> {
  const response = await axiosInstance.get<MachineGroupMachineMapping>(`/api/machinegroupmachinemapping/${id}`);
  return response.data;
}

/**
 * Get paginated list of Machine Group Machine Mapping
 *
 * Retrieves a paginated list of Machine Group Machine Mapping entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MachineGroupMachineMappingBasePaginationResponse>
 */
export async function getMachineGroupMachineMappingPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<MachineGroupMachineMappingBasePaginationResponse> {
  const response = await axiosInstance.post<MachineGroupMachineMappingBasePaginationResponse>(MACHINEGROUPMACHINEMAPPING_ENDPOINTS.getMachineGroupMachineMappingPage, data, { params });
  return response.data;
}

/**
 * Create a new Machine Group Machine Mapping
 *
 * Creates a new Machine Group Machine Mapping entity in the system.
 * @param data - Request body
 * @returns Promise<MachineGroupMachineMappingResult>
 */
export async function createMachineGroupMachineMapping(data: MachineGroupMachineMapping): Promise<MachineGroupMachineMappingResult> {
  const response = await axiosInstance.post<MachineGroupMachineMappingResult>(MACHINEGROUPMACHINEMAPPING_ENDPOINTS.createMachineGroupMachineMapping, data);
  return response.data;
}

/**
 * Update an existing Machine Group Machine Mapping
 *
 * Updates specific fields of an existing Machine Group Machine Mapping entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMachineGroupMachineMapping(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/machinegroupmachinemapping/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Machine Group Machine Mapping
 *
 * Deletes a Machine Group Machine Mapping entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMachineGroupMachineMapping(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/machinegroupmachinemapping/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Machine Group Machine Mapping
 *
 * Generates a new unique code for a Machine Group Machine Mapping entity.
 * @returns Promise<string>
 */
export async function generateNewMachineGroupMachineMappingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(MACHINEGROUPMACHINEMAPPING_ENDPOINTS.generateNewMachineGroupMachineMappingCode);
  return response.data;
}
