import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  BrandEntity,
  BrandEntityBasePaginationResponse,
  BrandEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Brand Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Brand API endpoints
 */
export const BRAND_ENDPOINTS = {
  getBrandById: '/api/brand/{id}',
  getBrandPage: '/api/brand/get-page',
  createBrand: '/api/brand/create',
  updateBrand: '/api/brand/update/{id}',
  deleteBrand: '/api/brand/delete/{id}',
  generateNewBrandCode: '/api/brand/generate-new-code',
} as const;

/**
 * Get Brand by ID
 *
 * Retrieves a specific Brand entity by its unique identifier.
 * @returns Promise<BrandEntity>
 */
export async function getBrandById(id: string): Promise<BrandEntity> {
  const response = await axiosInstance.get<BrandEntity>(`/api/brand/${id}`);
  return response.data;
}

/**
 * Get paginated list of Brand
 *
 * Retrieves a paginated list of Brand entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<BrandEntityBasePaginationResponse>
 */
export async function getBrandPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<BrandEntityBasePaginationResponse> {
  const response = await axiosInstance.post<BrandEntityBasePaginationResponse>(BRAND_ENDPOINTS.getBrandPage, data, { params });
  return response.data;
}

/**
 * Create a new Brand
 *
 * Creates a new Brand entity in the system.
 * @param data - Request body
 * @returns Promise<BrandEntityResult>
 */
export async function createBrand(data: BrandEntity): Promise<BrandEntityResult> {
  const response = await axiosInstance.post<BrandEntityResult>(BRAND_ENDPOINTS.createBrand, data);
  return response.data;
}

/**
 * Update an existing Brand
 *
 * Updates specific fields of an existing Brand entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateBrand(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/brand/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Brand
 *
 * Deletes a Brand entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteBrand(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/brand/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Brand
 *
 * Generates a new unique code for a Brand entity.
 * @returns Promise<string>
 */
export async function generateNewBrandCode(): Promise<string> {
  const response = await axiosInstance.get<string>(BRAND_ENDPOINTS.generateNewBrandCode);
  return response.data;
}
