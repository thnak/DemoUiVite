import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WebhookEntity,
  WebhookEntityBasePaginationResponse,
  WebhookEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Webhook Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Webhook API endpoints
 */
export const WEBHOOK_ENDPOINTS = {
  getWebhookById: '/api/webhook/{id}',
  getWebhookPage: '/api/webhook/get-page',
  createWebhook: '/api/webhook/create',
  updateWebhook: '/api/webhook/update/{id}',
  deleteWebhook: '/api/webhook/delete/{id}',
  generateNewWebhookCode: '/api/webhook/generate-new-code',
  searchWebhook: '/api/webhook/search',
} as const;

/**
 * Get Webhook by ID
 *
 * Retrieves a specific Webhook entity by its unique identifier.
 * @returns Promise<WebhookEntity>
 */
export async function getWebhookById(id: string): Promise<WebhookEntity> {
  const response = await axiosInstance.get<WebhookEntity>(`/api/webhook/${id}`);
  return response.data;
}

/**
 * Get paginated list of Webhook
 *
 * Retrieves a paginated list of Webhook entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WebhookEntityBasePaginationResponse>
 */
export async function getWebhookPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<WebhookEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WebhookEntityBasePaginationResponse>(WEBHOOK_ENDPOINTS.getWebhookPage, data, { params });
  return response.data;
}

/**
 * Create a new Webhook
 *
 * Creates a new Webhook entity in the system.
 * @param data - Request body
 * @returns Promise<WebhookEntityResult>
 */
export async function createWebhook(data: WebhookEntity): Promise<WebhookEntityResult> {
  const response = await axiosInstance.post<WebhookEntityResult>(WEBHOOK_ENDPOINTS.createWebhook, data);
  return response.data;
}

/**
 * Update an existing Webhook
 *
 * Updates specific fields of an existing Webhook entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWebhook(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/webhook/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Webhook
 *
 * Deletes a Webhook entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWebhook(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/webhook/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Webhook
 *
 * Generates a new unique code for a Webhook entity.
 * @returns Promise<string>
 */
export async function generateNewWebhookCode(): Promise<string> {
  const response = await axiosInstance.get<string>(WEBHOOK_ENDPOINTS.generateNewWebhookCode);
  return response.data;
}

/**
 * Search Webhook entities
 *
 * Searches Webhook entities by text across searchable fields.
 * @returns Promise<WebhookEntity[]>
 */
export async function searchWebhook(params?: { searchText?: string; maxResults?: number }): Promise<WebhookEntity[]> {
  const response = await axiosInstance.get<WebhookEntity[]>(WEBHOOK_ENDPOINTS.searchWebhook, { params });
  return response.data;
}
