import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  CategoryEntity,
  CategoryEntityBasePaginationResponse,
  CategoryEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Category Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Category API endpoints
 */
export const CATEGORY_ENDPOINTS = {
  getCategoryById: '/api/category/{id}',
  getCategoryPage: '/api/category/get-page',
  createCategory: '/api/category/create',
  updateCategory: '/api/category/update/{id}',
  deleteCategory: '/api/category/delete/{id}',
  generateNewCategoryCode: '/api/category/generate-new-code',
} as const;

/**
 * Get Category by ID
 *
 * Retrieves a specific Category entity by its unique identifier.
 * @returns Promise<CategoryEntity>
 */
export async function getCategoryById(id: string): Promise<CategoryEntity> {
  const response = await axiosInstance.get<CategoryEntity>(`/api/category/${id}`);
  return response.data;
}

/**
 * Get paginated list of Category
 *
 * Retrieves a paginated list of Category entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<CategoryEntityBasePaginationResponse>
 */
export async function getCategoryPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<CategoryEntityBasePaginationResponse> {
  const response = await axiosInstance.post<CategoryEntityBasePaginationResponse>(CATEGORY_ENDPOINTS.getCategoryPage, data, { params });
  return response.data;
}

/**
 * Create a new Category
 *
 * Creates a new Category entity in the system.
 * @param data - Request body
 * @returns Promise<CategoryEntityResult>
 */
export async function createCategory(data: CategoryEntity): Promise<CategoryEntityResult> {
  const response = await axiosInstance.post<CategoryEntityResult>(CATEGORY_ENDPOINTS.createCategory, data);
  return response.data;
}

/**
 * Update an existing Category
 *
 * Updates specific fields of an existing Category entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateCategory(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/category/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Category
 *
 * Deletes a Category entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteCategory(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/category/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Category
 *
 * Generates a new unique code for a Category entity.
 * @returns Promise<string>
 */
export async function generateNewCategoryCode(): Promise<string> {
  const response = await axiosInstance.get<string>(CATEGORY_ENDPOINTS.generateNewCategoryCode);
  return response.data;
}
