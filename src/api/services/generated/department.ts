import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  DepartmentEntity,
  DepartmentEntityBasePaginationResponse,
  DepartmentEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Department Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Department API endpoints
 */
export const DEPARTMENT_ENDPOINTS = {
  getDepartmentById: '/api/department/{id}',
  getDepartmentPage: '/api/department/get-page',
  createDepartment: '/api/department/create',
  updateDepartment: '/api/department/update/{id}',
  deleteDepartment: '/api/department/delete/{id}',
  generateNewDepartmentCode: '/api/department/generate-new-code',
  searchDepartment: '/api/department/search',
} as const;

/**
 * Get Department by ID
 *
 * Retrieves a specific Department entity by its unique identifier.
 * @returns Promise<DepartmentEntity>
 */
export async function getDepartmentById(id: string): Promise<DepartmentEntity> {
  const response = await axiosInstance.get<DepartmentEntity>(`/api/department/${id}`);
  return response.data;
}

/**
 * Get paginated list of Department
 *
 * Retrieves a paginated list of Department entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DepartmentEntityBasePaginationResponse>
 */
export async function getDepartmentPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<DepartmentEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DepartmentEntityBasePaginationResponse>(DEPARTMENT_ENDPOINTS.getDepartmentPage, data, { params });
  return response.data;
}

/**
 * Create a new Department
 *
 * Creates a new Department entity in the system.
 * @param data - Request body
 * @returns Promise<DepartmentEntityResult>
 */
export async function createDepartment(data: DepartmentEntity): Promise<DepartmentEntityResult> {
  const response = await axiosInstance.post<DepartmentEntityResult>(DEPARTMENT_ENDPOINTS.createDepartment, data);
  return response.data;
}

/**
 * Update an existing Department
 *
 * Updates specific fields of an existing Department entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDepartment(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/department/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Department
 *
 * Deletes a Department entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDepartment(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/department/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Department
 *
 * Generates a new unique code for a Department entity.
 * @returns Promise<string>
 */
export async function generateNewDepartmentCode(): Promise<string> {
  const response = await axiosInstance.get<string>(DEPARTMENT_ENDPOINTS.generateNewDepartmentCode);
  return response.data;
}

/**
 * Search Department entities
 *
 * Searches Department entities by text across searchable fields.
 * @returns Promise<DepartmentEntity[]>
 */
export async function searchDepartment(params?: { searchText?: string; maxResults?: number }): Promise<DepartmentEntity[]> {
  const response = await axiosInstance.get<DepartmentEntity[]>(DEPARTMENT_ENDPOINTS.searchDepartment, { params });
  return response.data;
}
