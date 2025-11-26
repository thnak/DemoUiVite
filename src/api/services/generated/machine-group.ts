import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  MachineGroupEntity,
  MachineGroupEntityResult,
  StringObjectKeyValuePair,
  MachineGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineGroup Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * MachineGroup API endpoints
 */
export const MACHINEGROUP_ENDPOINTS = {
  getMachineGroupById: '/api/machinegroup/{id}',
  getMachineGroupPage: '/api/machinegroup/get-page',
  createMachineGroup: '/api/machinegroup/create',
  updateMachineGroup: '/api/machinegroup/update/{id}',
  deleteMachineGroup: '/api/machinegroup/delete/{id}',
  generateNewMachineGroupCode: '/api/machinegroup/generate-new-code',
  searchMachineGroup: '/api/machinegroup/search',
} as const;

/**
 * Get Machine Group by ID
 *
 * Retrieves a specific Machine Group entity by its unique identifier.
 * @returns Promise<MachineGroupEntity>
 */
export async function getMachineGroupById(id: string): Promise<MachineGroupEntity> {
  const response = await axiosInstance.get<MachineGroupEntity>(`/api/machinegroup/${id}`);
  return response.data;
}

/**
 * Get paginated list of Machine Group
 *
 * Retrieves a paginated list of Machine Group entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MachineGroupEntityBasePaginationResponse>
 */
export async function getMachineGroupPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<MachineGroupEntityBasePaginationResponse> {
  const response = await axiosInstance.post<MachineGroupEntityBasePaginationResponse>(
    MACHINEGROUP_ENDPOINTS.getMachineGroupPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Machine Group
 *
 * Creates a new Machine Group entity in the system.
 * @param data - Request body
 * @returns Promise<MachineGroupEntityResult>
 */
export async function createMachineGroup(
  data: MachineGroupEntity
): Promise<MachineGroupEntityResult> {
  const response = await axiosInstance.post<MachineGroupEntityResult>(
    MACHINEGROUP_ENDPOINTS.createMachineGroup,
    data
  );
  return response.data;
}

/**
 * Update an existing Machine Group
 *
 * Updates specific fields of an existing Machine Group entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMachineGroup(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/machinegroup/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Machine Group
 *
 * Deletes a Machine Group entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMachineGroup(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/machinegroup/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Machine Group
 *
 * Generates a new unique code for a Machine Group entity.
 * @returns Promise<string>
 */
export async function generateNewMachineGroupCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    MACHINEGROUP_ENDPOINTS.generateNewMachineGroupCode
  );
  return response.data;
}

/**
 * Search Machine Group entities
 *
 * Searches Machine Group entities by text across searchable fields.
 * @returns Promise<MachineGroupEntity[]>
 */
export async function searchMachineGroup(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<MachineGroupEntity[]> {
  const response = await axiosInstance.get<MachineGroupEntity[]>(
    MACHINEGROUP_ENDPOINTS.searchMachineGroup,
    { params }
  );
  return response.data;
}
