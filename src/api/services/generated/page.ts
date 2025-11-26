import axiosInstance from '../../axios-instance';

import type {
  SortType,
  PageEntity,
  BooleanResult,
  PageEntityResult,
  StringObjectKeyValuePair,
  PageEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Page Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Page API endpoints
 */
export const PAGE_ENDPOINTS = {
  getPageById: '/api/page/{id}',
  getPagePage: '/api/page/get-page',
  createPage: '/api/page/create',
  updatePage: '/api/page/update/{id}',
  deletePage: '/api/page/delete/{id}',
  generateNewPageCode: '/api/page/generate-new-code',
  postapiPage: '/api/Page',
  getapiPage: '/api/Page',
  postapiPagebatch: '/api/Page/batch',
  deleteapiPagebatch: '/api/Page/batch',
  deleteapiPageid: '/api/Page/{id}',
  getapiPageid: '/api/Page/{id}',
  putapiPageid: '/api/Page/{id}',
  deleteapiPagebytags: '/api/Page/by-tags',
  getapiPagebytags: '/api/Page/by-tags',
  deleteapiPageinactive: '/api/Page/inactive',
  getapiPagepaginated: '/api/Page/paginated',
  patchapiPageidorder: '/api/Page/{id}/order',
  patchapiPageidtoggleactive: '/api/Page/{id}/toggle-active',
  patchapiPageidtags: '/api/Page/{id}/tags',
} as const;

/**
 * Get Page by ID
 *
 * Retrieves a specific Page entity by its unique identifier.
 * @returns Promise<PageEntity>
 */
export async function getPageById(id: string): Promise<PageEntity> {
  const response = await axiosInstance.get<PageEntity>(`/api/page/${id}`);
  return response.data;
}

/**
 * Get paginated list of Page
 *
 * Retrieves a paginated list of Page entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<PageEntityBasePaginationResponse>
 */
export async function getPagePage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<PageEntityBasePaginationResponse> {
  const response = await axiosInstance.post<PageEntityBasePaginationResponse>(
    PAGE_ENDPOINTS.getPagePage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Page
 *
 * Creates a new Page entity in the system.
 * @param data - Request body
 * @returns Promise<PageEntityResult>
 */
export async function createPage(data: PageEntity): Promise<PageEntityResult> {
  const response = await axiosInstance.post<PageEntityResult>(PAGE_ENDPOINTS.createPage, data);
  return response.data;
}

/**
 * Update an existing Page
 *
 * Updates specific fields of an existing Page entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updatePage(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/page/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Page
 *
 * Deletes a Page entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deletePage(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/page/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Page
 *
 * Generates a new unique code for a Page entity.
 * @returns Promise<string>
 */
export async function generateNewPageCode(): Promise<string> {
  const response = await axiosInstance.get<string>(PAGE_ENDPOINTS.generateNewPageCode);
  return response.data;
}

/**
 * Creates a new page entity.
 * @param data - Request body
 * @returns Promise<PageEntity>
 */
export async function postapiPage(data: PageEntity): Promise<PageEntity> {
  const response = await axiosInstance.post<PageEntity>(PAGE_ENDPOINTS.postapiPage, data);
  return response.data;
}

/**
 * Gets all pages with optional filtering.
 * @param activeOnly - If true, returns only active pages.
 * @param ordered - If true, returns pages ordered by their Order property.
 * @returns Promise<PageEntity[]>
 */
export async function getapiPage(params?: {
  activeOnly?: boolean;
  ordered?: boolean;
}): Promise<PageEntity[]> {
  const response = await axiosInstance.get<PageEntity[]>(PAGE_ENDPOINTS.getapiPage, { params });
  return response.data;
}

/**
 * Creates multiple page entities in batch.
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiPagebatch(data: PageEntity[]): Promise<void> {
  await axiosInstance.post(PAGE_ENDPOINTS.postapiPagebatch, data);
}

/**
 * Deletes multiple pages by their IDs.
 * @param data - Request body
 * @returns Promise<void>
 */
export async function deleteapiPagebatch(data: string[]): Promise<void> {
  await axiosInstance.delete(PAGE_ENDPOINTS.deleteapiPagebatch, { data });
}

/**
 * Deletes a page by its ID.
 * @param id - The page ID to delete.
 * @returns Promise<void>
 */
export async function deleteapiPageid(id: string): Promise<void> {
  await axiosInstance.delete(`/api/Page/${id}`);
}

/**
 * Gets a page by its ID.
 * @param id - The page ID.
 * @returns Promise<PageEntity>
 */
export async function getapiPageid(id: string): Promise<PageEntity> {
  const response = await axiosInstance.get<PageEntity>(`/api/Page/${id}`);
  return response.data;
}

/**
 * Updates an existing page entity.
 * @param id - The page ID to update.
 * @param data - Request body
 * @returns Promise<PageEntity>
 */
export async function putapiPageid(id: string, data: PageEntity): Promise<PageEntity> {
  const response = await axiosInstance.put<PageEntity>(`/api/Page/${id}`, data);
  return response.data;
}

/**
 * Deletes all pages with specified tags.
 * @param tags - Comma-separated list of tags.
 * @param confirm - Confirmation flag (must be true to proceed).
 * @returns Promise<void>
 */
export async function deleteapiPagebytags(params?: {
  tags?: string;
  confirm?: boolean;
}): Promise<void> {
  await axiosInstance.delete(PAGE_ENDPOINTS.deleteapiPagebytags, { params });
}

/**
 * Gets pages by tags.
 * @param tags - Comma-separated list of tags.
 * @returns Promise<PageEntity[]>
 */
export async function getapiPagebytags(params?: { tags?: string }): Promise<PageEntity[]> {
  const response = await axiosInstance.get<PageEntity[]>(PAGE_ENDPOINTS.getapiPagebytags, {
    params,
  });
  return response.data;
}

/**
 * Deletes all inactive pages.
 * @param confirm - Confirmation flag (must be true to proceed).
 * @returns Promise<void>
 */
export async function deleteapiPageinactive(params?: { confirm?: boolean }): Promise<void> {
  await axiosInstance.delete(PAGE_ENDPOINTS.deleteapiPageinactive, { params });
}

/**
 * Gets pages with pagination support.
 * @param page - Page number (1-based).
 * @param pageSize - Number of items per page.
 * @param activeOnly - If true, returns only active pages.
 * @returns Promise<unknown>
 */
export async function getapiPagepaginated(params?: {
  page?: number;
  pageSize?: number;
  activeOnly?: boolean;
}): Promise<unknown> {
  const response = await axiosInstance.get<unknown>(PAGE_ENDPOINTS.getapiPagepaginated, { params });
  return response.data;
}

/**
 * Updates only the order of a page.
 * @param id - The page ID to update.
 * @param data - Request body
 * @returns Promise<void>
 */
export async function patchapiPageidorder(id: string, data: number): Promise<void> {
  await axiosInstance.patch(`/api/Page/${id}/order`, data);
}

/**
 * Toggles the active status of a page.
 * @param id - The page ID to toggle.
 * @returns Promise<void>
 */
export async function patchapiPageidtoggleactive(id: string): Promise<void> {
  await axiosInstance.patch(`/api/Page/${id}/toggle-active`);
}

/**
 * Updates the tags of a page.
 * @param id - The page ID to update.
 * @param data - Request body
 * @returns Promise<void>
 */
export async function patchapiPageidtags(id: string, data: string[]): Promise<void> {
  await axiosInstance.patch(`/api/Page/${id}/tags`, data);
}
