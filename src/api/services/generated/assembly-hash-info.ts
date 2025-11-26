import axiosInstance from '../../axios-instance';

import type {
  AssemblyHashInfoEntity,
  AssemblyHashInfoEntityBasePaginationResponse,
  AssemblyHashInfoEntityResult,
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// AssemblyHashInfo Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * AssemblyHashInfo API endpoints
 */
export const ASSEMBLYHASHINFO_ENDPOINTS = {
  getAssemblyHashInfoById: '/api/assemblyhashinfo/{id}',
  getAssemblyHashInfoPage: '/api/assemblyhashinfo/get-page',
  createAssemblyHashInfo: '/api/assemblyhashinfo/create',
  updateAssemblyHashInfo: '/api/assemblyhashinfo/update/{id}',
  deleteAssemblyHashInfo: '/api/assemblyhashinfo/delete/{id}',
  generateNewAssemblyHashInfoCode: '/api/assemblyhashinfo/generate-new-code',
} as const;

/**
 * Get Assembly Hash Info by ID
 *
 * Retrieves a specific Assembly Hash Info entity by its unique identifier.
 * @returns Promise<AssemblyHashInfoEntity>
 */
export async function getAssemblyHashInfoById(id: string): Promise<AssemblyHashInfoEntity> {
  const response = await axiosInstance.get<AssemblyHashInfoEntity>(`/api/assemblyhashinfo/${id}`);
  return response.data;
}

/**
 * Get paginated list of Assembly Hash Info
 *
 * Retrieves a paginated list of Assembly Hash Info entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<AssemblyHashInfoEntityBasePaginationResponse>
 */
export async function getAssemblyHashInfoPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<AssemblyHashInfoEntityBasePaginationResponse> {
  const response = await axiosInstance.post<AssemblyHashInfoEntityBasePaginationResponse>(ASSEMBLYHASHINFO_ENDPOINTS.getAssemblyHashInfoPage, data, { params });
  return response.data;
}

/**
 * Create a new Assembly Hash Info
 *
 * Creates a new Assembly Hash Info entity in the system.
 * @param data - Request body
 * @returns Promise<AssemblyHashInfoEntityResult>
 */
export async function createAssemblyHashInfo(data: AssemblyHashInfoEntity): Promise<AssemblyHashInfoEntityResult> {
  const response = await axiosInstance.post<AssemblyHashInfoEntityResult>(ASSEMBLYHASHINFO_ENDPOINTS.createAssemblyHashInfo, data);
  return response.data;
}

/**
 * Update an existing Assembly Hash Info
 *
 * Updates specific fields of an existing Assembly Hash Info entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateAssemblyHashInfo(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/assemblyhashinfo/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Assembly Hash Info
 *
 * Deletes a Assembly Hash Info entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteAssemblyHashInfo(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/assemblyhashinfo/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Assembly Hash Info
 *
 * Generates a new unique code for a Assembly Hash Info entity.
 * @returns Promise<string>
 */
export async function generateNewAssemblyHashInfoCode(): Promise<string> {
  const response = await axiosInstance.get<string>(ASSEMBLYHASHINFO_ENDPOINTS.generateNewAssemblyHashInfoCode);
  return response.data;
}
