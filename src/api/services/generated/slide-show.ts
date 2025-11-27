import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  SlideShowEntity,
  SlideShowEntityResult,
  StringObjectKeyValuePair,
  SlideShowEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SlideShow Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * SlideShow API endpoints
 */
export const SLIDESHOW_ENDPOINTS = {
  getSlideShowById: '/api/slideshow/{id}',
  getSlideShowPage: '/api/slideshow/get-page',
  createSlideShow: '/api/slideshow/create',
  updateSlideShow: '/api/slideshow/update/{id}',
  deleteSlideShow: '/api/slideshow/delete/{id}',
  generateNewSlideShowCode: '/api/slideshow/generate-new-code',
} as const;

/**
 * Get Slide Show by ID
 *
 * Retrieves a specific Slide Show entity by its unique identifier.
 * @returns Promise<SlideShowEntity>
 */
export async function getSlideShowById(id: string): Promise<SlideShowEntity> {
  const response = await axiosInstance.get<SlideShowEntity>(`/api/slideshow/${id}`);
  return response.data;
}

/**
 * Get paginated list of Slide Show
 *
 * Retrieves a paginated list of Slide Show entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SlideShowEntityBasePaginationResponse>
 */
export async function getSlideShowPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<SlideShowEntityBasePaginationResponse> {
  const response = await axiosInstance.post<SlideShowEntityBasePaginationResponse>(SLIDESHOW_ENDPOINTS.getSlideShowPage, data, { params });
  return response.data;
}

/**
 * Create a new Slide Show
 *
 * Creates a new Slide Show entity in the system.
 * @param data - Request body
 * @returns Promise<SlideShowEntityResult>
 */
export async function createSlideShow(data: SlideShowEntity): Promise<SlideShowEntityResult> {
  const response = await axiosInstance.post<SlideShowEntityResult>(SLIDESHOW_ENDPOINTS.createSlideShow, data);
  return response.data;
}

/**
 * Update an existing Slide Show
 *
 * Updates specific fields of an existing Slide Show entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateSlideShow(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/slideshow/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Slide Show
 *
 * Deletes a Slide Show entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteSlideShow(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/slideshow/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Slide Show
 *
 * Generates a new unique code for a Slide Show entity.
 * @returns Promise<string>
 */
export async function generateNewSlideShowCode(): Promise<string> {
  const response = await axiosInstance.get<string>(SLIDESHOW_ENDPOINTS.generateNewSlideShowCode);
  return response.data;
}
