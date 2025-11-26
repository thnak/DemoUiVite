import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  MachineEntity,
  MachineEntityBasePaginationResponse,
  MachineEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Machine Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Machine API endpoints
 */
export const MACHINE_ENDPOINTS = {
  getMachineById: '/api/machine/{id}',
  getMachinePage: '/api/machine/get-page',
  createMachine: '/api/machine/create',
  updateMachine: '/api/machine/update/{id}',
  deleteMachine: '/api/machine/delete/{id}',
  generateNewMachineCode: '/api/machine/generate-new-code',
  searchMachine: '/api/machine/search',
} as const;

/**
 * Get Machine by ID
 *
 * Retrieves a specific Machine entity by its unique identifier.
 * @returns Promise<MachineEntity>
 */
export async function getMachineById(id: string): Promise<MachineEntity> {
  const response = await axiosInstance.get<MachineEntity>(`/api/machine/${id}`);
  return response.data;
}

/**
 * Get paginated list of Machine
 *
 * Retrieves a paginated list of Machine entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MachineEntityBasePaginationResponse>
 */
export async function getMachinePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<MachineEntityBasePaginationResponse> {
  const response = await axiosInstance.post<MachineEntityBasePaginationResponse>(MACHINE_ENDPOINTS.getMachinePage, data, { params });
  return response.data;
}

/**
 * Create a new Machine
 *
 * Creates a new Machine entity in the system.
 * @param data - Request body
 * @returns Promise<MachineEntityResult>
 */
export async function createMachine(data: MachineEntity): Promise<MachineEntityResult> {
  const response = await axiosInstance.post<MachineEntityResult>(MACHINE_ENDPOINTS.createMachine, data);
  return response.data;
}

/**
 * Update an existing Machine
 *
 * Updates specific fields of an existing Machine entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMachine(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/machine/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Machine
 *
 * Deletes a Machine entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMachine(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/machine/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Machine
 *
 * Generates a new unique code for a Machine entity.
 * @returns Promise<string>
 */
export async function generateNewMachineCode(): Promise<string> {
  const response = await axiosInstance.get<string>(MACHINE_ENDPOINTS.generateNewMachineCode);
  return response.data;
}

/**
 * Search Machine entities
 *
 * Searches Machine entities by text across searchable fields.
 * @returns Promise<MachineEntity[]>
 */
export async function searchMachine(params?: { searchText?: string; maxResults?: number }): Promise<MachineEntity[]> {
  const response = await axiosInstance.get<MachineEntity[]>(MACHINE_ENDPOINTS.searchMachine, { params });
  return response.data;
}
