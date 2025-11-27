import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  UserDepartmentEntity,
  StringObjectKeyValuePair,
  UserDepartmentEntityResult,
  UserDepartmentEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserDepartment Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserDepartment API endpoints
 */
export const USERDEPARTMENT_ENDPOINTS = {
  getUserDepartmentById: '/api/userdepartment/{id}',
  getUserDepartmentPage: '/api/userdepartment/get-page',
  createUserDepartment: '/api/userdepartment/create',
  updateUserDepartment: '/api/userdepartment/update/{id}',
  deleteUserDepartment: '/api/userdepartment/delete/{id}',
  generateNewUserDepartmentCode: '/api/userdepartment/generate-new-code',
} as const;

/**
 * Get User Department by ID
 *
 * Retrieves a specific User Department entity by its unique identifier.
 * @returns Promise<UserDepartmentEntity>
 */
export async function getUserDepartmentById(id: string): Promise<UserDepartmentEntity> {
  const response = await axiosInstance.get<UserDepartmentEntity>(`/api/userdepartment/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Department
 *
 * Retrieves a paginated list of User Department entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserDepartmentEntityBasePaginationResponse>
 */
export async function getUserDepartmentPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserDepartmentEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserDepartmentEntityBasePaginationResponse>(USERDEPARTMENT_ENDPOINTS.getUserDepartmentPage, data, { params });
  return response.data;
}

/**
 * Create a new User Department
 *
 * Creates a new User Department entity in the system.
 * @param data - Request body
 * @returns Promise<UserDepartmentEntityResult>
 */
export async function createUserDepartment(data: UserDepartmentEntity): Promise<UserDepartmentEntityResult> {
  const response = await axiosInstance.post<UserDepartmentEntityResult>(USERDEPARTMENT_ENDPOINTS.createUserDepartment, data);
  return response.data;
}

/**
 * Update an existing User Department
 *
 * Updates specific fields of an existing User Department entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserDepartment(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/userdepartment/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Department
 *
 * Deletes a User Department entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserDepartment(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/userdepartment/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Department
 *
 * Generates a new unique code for a User Department entity.
 * @returns Promise<string>
 */
export async function generateNewUserDepartmentCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERDEPARTMENT_ENDPOINTS.generateNewUserDepartmentCode);
  return response.data;
}
