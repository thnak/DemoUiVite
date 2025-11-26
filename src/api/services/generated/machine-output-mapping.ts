import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  MachineOutputMapping,
  MachineOutputMappingBasePaginationResponse,
  MachineOutputMappingResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineOutputMapping Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * MachineOutputMapping API endpoints
 */
export const MACHINEOUTPUTMAPPING_ENDPOINTS = {
  getMachineOutputMappingById: '/api/machineoutputmapping/{id}',
  getMachineOutputMappingPage: '/api/machineoutputmapping/get-page',
  createMachineOutputMapping: '/api/machineoutputmapping/create',
  updateMachineOutputMapping: '/api/machineoutputmapping/update/{id}',
  deleteMachineOutputMapping: '/api/machineoutputmapping/delete/{id}',
  generateNewMachineOutputMappingCode: '/api/machineoutputmapping/generate-new-code',
} as const;

/**
 * Get Machine Output Mapping by ID
 *
 * Retrieves a specific Machine Output Mapping entity by its unique identifier.
 * @returns Promise<MachineOutputMapping>
 */
export async function getMachineOutputMappingById(id: string): Promise<MachineOutputMapping> {
  const response = await axiosInstance.get<MachineOutputMapping>(`/api/machineoutputmapping/${id}`);
  return response.data;
}

/**
 * Get paginated list of Machine Output Mapping
 *
 * Retrieves a paginated list of Machine Output Mapping entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MachineOutputMappingBasePaginationResponse>
 */
export async function getMachineOutputMappingPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<MachineOutputMappingBasePaginationResponse> {
  const response = await axiosInstance.post<MachineOutputMappingBasePaginationResponse>(MACHINEOUTPUTMAPPING_ENDPOINTS.getMachineOutputMappingPage, data, { params });
  return response.data;
}

/**
 * Create a new Machine Output Mapping
 *
 * Creates a new Machine Output Mapping entity in the system.
 * @param data - Request body
 * @returns Promise<MachineOutputMappingResult>
 */
export async function createMachineOutputMapping(data: MachineOutputMapping): Promise<MachineOutputMappingResult> {
  const response = await axiosInstance.post<MachineOutputMappingResult>(MACHINEOUTPUTMAPPING_ENDPOINTS.createMachineOutputMapping, data);
  return response.data;
}

/**
 * Update an existing Machine Output Mapping
 *
 * Updates specific fields of an existing Machine Output Mapping entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMachineOutputMapping(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/machineoutputmapping/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Machine Output Mapping
 *
 * Deletes a Machine Output Mapping entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMachineOutputMapping(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/machineoutputmapping/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Machine Output Mapping
 *
 * Generates a new unique code for a Machine Output Mapping entity.
 * @returns Promise<string>
 */
export async function generateNewMachineOutputMappingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(MACHINEOUTPUTMAPPING_ENDPOINTS.generateNewMachineOutputMappingCode);
  return response.data;
}
