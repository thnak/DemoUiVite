import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  ManufacturerEntity,
  ManufacturerEntityResult,
  StringObjectKeyValuePair,
  ManufacturerEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Manufacturer Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Manufacturer API endpoints
 */
export const MANUFACTURER_ENDPOINTS = {
  getManufacturerById: '/api/manufacturer/{id}',
  getManufacturerPage: '/api/manufacturer/get-page',
  createManufacturer: '/api/manufacturer/create',
  updateManufacturer: '/api/manufacturer/update/{id}',
  deleteManufacturer: '/api/manufacturer/delete/{id}',
  generateNewManufacturerCode: '/api/manufacturer/generate-new-code',
  searchManufacturer: '/api/manufacturer/search',
} as const;

/**
 * Get Manufacturer by ID
 *
 * Retrieves a specific Manufacturer entity by its unique identifier.
 * @returns Promise<ManufacturerEntity>
 */
export async function getManufacturerById(id: string): Promise<ManufacturerEntity> {
  const response = await axiosInstance.get<ManufacturerEntity>(`/api/manufacturer/${id}`);
  return response.data;
}

/**
 * Get paginated list of Manufacturer
 *
 * Retrieves a paginated list of Manufacturer entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ManufacturerEntityBasePaginationResponse>
 */
export async function getManufacturerPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ManufacturerEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ManufacturerEntityBasePaginationResponse>(MANUFACTURER_ENDPOINTS.getManufacturerPage, data, { params });
  return response.data;
}

/**
 * Create a new Manufacturer
 *
 * Creates a new Manufacturer entity in the system.
 * @param data - Request body
 * @returns Promise<ManufacturerEntityResult>
 */
export async function createManufacturer(data: ManufacturerEntity): Promise<ManufacturerEntityResult> {
  const response = await axiosInstance.post<ManufacturerEntityResult>(MANUFACTURER_ENDPOINTS.createManufacturer, data);
  return response.data;
}

/**
 * Update an existing Manufacturer
 *
 * Updates specific fields of an existing Manufacturer entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateManufacturer(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/manufacturer/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Manufacturer
 *
 * Deletes a Manufacturer entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteManufacturer(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/manufacturer/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Manufacturer
 *
 * Generates a new unique code for a Manufacturer entity.
 * @returns Promise<string>
 */
export async function generateNewManufacturerCode(): Promise<string> {
  const response = await axiosInstance.get<string>(MANUFACTURER_ENDPOINTS.generateNewManufacturerCode);
  return response.data;
}

/**
 * Search Manufacturer entities
 *
 * Searches Manufacturer entities by text across searchable fields.
 * @returns Promise<ManufacturerEntity[]>
 */
export async function searchManufacturer(params?: { searchText?: string; maxResults?: number }): Promise<ManufacturerEntity[]> {
  const response = await axiosInstance.get<ManufacturerEntity[]>(MANUFACTURER_ENDPOINTS.searchManufacturer, { params });
  return response.data;
}
