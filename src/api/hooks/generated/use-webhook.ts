import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWebhook,
  deleteWebhook,
  generateNewWebhookCode,
  getWebhookById,
  getWebhookPage,
  searchWebhook,
  updateWebhook,
} from '../../services/generated/webhook';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WebhookEntity,
  WebhookEntityBasePaginationResponse,
  WebhookEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Webhook Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Webhook
 */
export const webhookKeys = {
  all: ['webhook'] as const,
  getWebhookById: (id: string) => ['webhook', 'getWebhookById', id] as const,
  generateNewWebhookCode: ['webhook', 'generateNewWebhookCode'] as const,
  searchWebhook: ['webhook', 'searchWebhook'] as const,
};

/**
 * Get Webhook by ID
 */
export function useGetWebhookById(
  id: string,
  options?: Omit<UseQueryOptions<WebhookEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: webhookKeys.getWebhookById(id),
    queryFn: () => getWebhookById(id),
    ...options,
  });
}

/**
 * Generate a new code for Webhook
 */
export function useGenerateNewWebhookCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: webhookKeys.generateNewWebhookCode,
    queryFn: () => generateNewWebhookCode(),
    ...options,
  });
}

/**
 * Search Webhook entities
 */
export function useSearchWebhook(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<WebhookEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: webhookKeys.searchWebhook,
    queryFn: () => searchWebhook(params),
    ...options,
  });
}

/**
 * Get paginated list of Webhook
 */
export function useGetWebhookPage(
  options?: Omit<UseMutationOptions<WebhookEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getWebhookPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Webhook
 */
export function useCreateWebhook(
  options?: Omit<UseMutationOptions<WebhookEntityResult, Error, { data: WebhookEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: WebhookEntity }) => createWebhook(variables.data),
    ...options,
  });
}

/**
 * Update an existing Webhook
 */
export function useUpdateWebhook(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateWebhook(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Webhook
 */
export function useDeleteWebhook(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWebhook(variables.id),
    ...options,
  });
}
