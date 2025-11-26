import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  UserLoginInfoPocoEntity,
  UserLoginInfoPocoEntityBasePaginationResponse,
  UserLoginInfoPocoEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserLoginInfoPoco Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserLoginInfoPoco API endpoints
 */
export const USERLOGININFOPOCO_ENDPOINTS = {
  getUserLoginInfoPocoById: '/api/userlogininfopoco/{id}',
  getUserLoginInfoPocoPage: '/api/userlogininfopoco/get-page',
  createUserLoginInfoPoco: '/api/userlogininfopoco/create',
  updateUserLoginInfoPoco: '/api/userlogininfopoco/update/{id}',
  deleteUserLoginInfoPoco: '/api/userlogininfopoco/delete/{id}',
  generateNewUserLoginInfoPocoCode: '/api/userlogininfopoco/generate-new-code',
} as const;

/**
 * Get User Login Info Poco by ID
 *
 * Retrieves a specific User Login Info Poco entity by its unique identifier.
 * @returns Promise<UserLoginInfoPocoEntity>
 */
export async function getUserLoginInfoPocoById(id: string): Promise<UserLoginInfoPocoEntity> {
  const response = await axiosInstance.get<UserLoginInfoPocoEntity>(`/api/userlogininfopoco/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Login Info Poco
 *
 * Retrieves a paginated list of User Login Info Poco entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserLoginInfoPocoEntityBasePaginationResponse>
 */
export async function getUserLoginInfoPocoPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserLoginInfoPocoEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserLoginInfoPocoEntityBasePaginationResponse>(USERLOGININFOPOCO_ENDPOINTS.getUserLoginInfoPocoPage, data, { params });
  return response.data;
}

/**
 * Create a new User Login Info Poco
 *
 * Creates a new User Login Info Poco entity in the system.
 * @param data - Request body
 * @returns Promise<UserLoginInfoPocoEntityResult>
 */
export async function createUserLoginInfoPoco(data: UserLoginInfoPocoEntity): Promise<UserLoginInfoPocoEntityResult> {
  const response = await axiosInstance.post<UserLoginInfoPocoEntityResult>(USERLOGININFOPOCO_ENDPOINTS.createUserLoginInfoPoco, data);
  return response.data;
}

/**
 * Update an existing User Login Info Poco
 *
 * Updates specific fields of an existing User Login Info Poco entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserLoginInfoPoco(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/userlogininfopoco/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Login Info Poco
 *
 * Deletes a User Login Info Poco entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserLoginInfoPoco(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/userlogininfopoco/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Login Info Poco
 *
 * Generates a new unique code for a User Login Info Poco entity.
 * @returns Promise<string>
 */
export async function generateNewUserLoginInfoPocoCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERLOGININFOPOCO_ENDPOINTS.generateNewUserLoginInfoPocoCode);
  return response.data;
}
