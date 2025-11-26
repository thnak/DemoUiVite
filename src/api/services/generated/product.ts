import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  ProductEntity,
  ProductEntityResult,
  StringObjectKeyValuePair,
  ProductEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Product Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Product API endpoints
 */
export const PRODUCT_ENDPOINTS = {
  getProductById: '/api/product/{id}',
  getProductPage: '/api/product/get-page',
  createProduct: '/api/product/create',
  updateProduct: '/api/product/update/{id}',
  deleteProduct: '/api/product/delete/{id}',
  generateNewProductCode: '/api/product/generate-new-code',
  searchProduct: '/api/product/search',
} as const;

/**
 * Get Product by ID
 *
 * Retrieves a specific Product entity by its unique identifier.
 * @returns Promise<ProductEntity>
 */
export async function getProductById(id: string): Promise<ProductEntity> {
  const response = await axiosInstance.get<ProductEntity>(`/api/product/${id}`);
  return response.data;
}

/**
 * Get paginated list of Product
 *
 * Retrieves a paginated list of Product entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ProductEntityBasePaginationResponse>
 */
export async function getProductPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<ProductEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ProductEntityBasePaginationResponse>(
    PRODUCT_ENDPOINTS.getProductPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Product
 *
 * Creates a new Product entity in the system.
 * @param data - Request body
 * @returns Promise<ProductEntityResult>
 */
export async function createProduct(data: ProductEntity): Promise<ProductEntityResult> {
  const response = await axiosInstance.post<ProductEntityResult>(
    PRODUCT_ENDPOINTS.createProduct,
    data
  );
  return response.data;
}

/**
 * Update an existing Product
 *
 * Updates specific fields of an existing Product entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateProduct(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/product/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Product
 *
 * Deletes a Product entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteProduct(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/product/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Product
 *
 * Generates a new unique code for a Product entity.
 * @returns Promise<string>
 */
export async function generateNewProductCode(): Promise<string> {
  const response = await axiosInstance.get<string>(PRODUCT_ENDPOINTS.generateNewProductCode);
  return response.data;
}

/**
 * Search Product entities
 *
 * Searches Product entities by text across searchable fields.
 * @returns Promise<ProductEntity[]>
 */
export async function searchProduct(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<ProductEntity[]> {
  const response = await axiosInstance.get<ProductEntity[]>(PRODUCT_ENDPOINTS.searchProduct, {
    params,
  });
  return response.data;
}
