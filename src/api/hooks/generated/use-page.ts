import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createPage,
  deletePage,
  getapiPage,
  updatePage,
  getPageById,
  getPagePage,
  postapiPage,
  getapiPageid,
  putapiPageid,
  deleteapiPageid,
  getapiPagebytags,
  postapiPagebatch,
  deleteapiPagebatch,
  patchapiPageidtags,
  deleteapiPagebytags,
  generateNewPageCode,
  getapiPagepaginated,
  patchapiPageidorder,
  deleteapiPageinactive,
  patchapiPageidtoggleactive,
} from '../../services/generated/page';

import type {
  SortType,
  PageEntity,
  BooleanResult,
  PageEntityResult,
  StringObjectKeyValuePair,
  PageEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Page Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Page
 */
export const pageKeys = {
  all: ['page'] as const,
  getPageById: (id: string) => ['page', 'getPageById', id] as const,
  generateNewPageCode: ['page', 'generateNewPageCode'] as const,
  getapiPage: ['page', 'getapiPage'] as const,
  getapiPageid: (id: string) => ['page', 'getapiPageid', id] as const,
  getapiPagebytags: ['page', 'getapiPagebytags'] as const,
  getapiPagepaginated: ['page', 'getapiPagepaginated'] as const,
};

/**
 * Get Page by ID
 */
export function useGetPageById(
  id: string,
  options?: Omit<UseQueryOptions<PageEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pageKeys.getPageById(id),
    queryFn: () => getPageById(id),
    ...options,
  });
}

/**
 * Generate a new code for Page
 */
export function useGenerateNewPageCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pageKeys.generateNewPageCode,
    queryFn: () => generateNewPageCode(),
    ...options,
  });
}

/**
 * Gets all pages with optional filtering.
 */
export function useGetapiPage(
  params?: { activeOnly?: boolean; ordered?: boolean },
  options?: Omit<UseQueryOptions<PageEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pageKeys.getapiPage,
    queryFn: () => getapiPage(params),
    ...options,
  });
}

/**
 * Gets a page by its ID.
 */
export function useGetapiPageid(
  id: string,
  options?: Omit<UseQueryOptions<PageEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pageKeys.getapiPageid(id),
    queryFn: () => getapiPageid(id),
    ...options,
  });
}

/**
 * Gets pages by tags.
 */
export function useGetapiPagebytags(
  params?: { tags?: string },
  options?: Omit<UseQueryOptions<PageEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pageKeys.getapiPagebytags,
    queryFn: () => getapiPagebytags(params),
    ...options,
  });
}

/**
 * Gets pages with pagination support.
 */
export function useGetapiPagepaginated(
  params?: { page?: number; pageSize?: number; activeOnly?: boolean },
  options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pageKeys.getapiPagepaginated,
    queryFn: () => getapiPagepaginated(params),
    ...options,
  });
}

/**
 * Get paginated list of Page
 */
export function useGetPagePage(
  options?: Omit<UseMutationOptions<PageEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getPagePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Page
 */
export function useCreatePage(
  options?: Omit<UseMutationOptions<PageEntityResult, Error, { data: PageEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: PageEntity }) => createPage(variables.data),
    ...options,
  });
}

/**
 * Update an existing Page
 */
export function useUpdatePage(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updatePage(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Page
 */
export function useDeletePage(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deletePage(variables.id),
    ...options,
  });
}

/**
 * Creates a new page entity.
 */
export function usePostapiPage(
  options?: Omit<UseMutationOptions<PageEntity, Error, { data: PageEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: PageEntity }) => postapiPage(variables.data),
    ...options,
  });
}

/**
 * Creates multiple page entities in batch.
 */
export function usePostapiPagebatch(
  options?: Omit<UseMutationOptions<void, Error, { data: PageEntity[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: PageEntity[] }) => postapiPagebatch(variables.data),
    ...options,
  });
}

/**
 * Deletes multiple pages by their IDs.
 */
export function useDeleteapiPagebatch(
  options?: Omit<UseMutationOptions<void, Error, { data: string[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: string[] }) => deleteapiPagebatch(variables.data),
    ...options,
  });
}

/**
 * Deletes a page by its ID.
 */
export function useDeleteapiPageid(
  options?: Omit<UseMutationOptions<void, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteapiPageid(variables.id),
    ...options,
  });
}

/**
 * Updates an existing page entity.
 */
export function usePutapiPageid(
  options?: Omit<UseMutationOptions<PageEntity, Error, { id: string; data: PageEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: PageEntity }) => putapiPageid(variables.id, variables.data),
    ...options,
  });
}

/**
 * Deletes all pages with specified tags.
 */
export function useDeleteapiPagebytags(
  options?: Omit<UseMutationOptions<void, Error, { params?: { tags?: string; confirm?: boolean } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { tags?: string; confirm?: boolean } }) => deleteapiPagebytags(variables.params),
    ...options,
  });
}

/**
 * Deletes all inactive pages.
 */
export function useDeleteapiPageinactive(
  options?: Omit<UseMutationOptions<void, Error, { params?: { confirm?: boolean } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { confirm?: boolean } }) => deleteapiPageinactive(variables.params),
    ...options,
  });
}

/**
 * Updates only the order of a page.
 */
export function usePatchapiPageidorder(
  options?: Omit<UseMutationOptions<void, Error, { id: string; data: number }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: number }) => patchapiPageidorder(variables.id, variables.data),
    ...options,
  });
}

/**
 * Toggles the active status of a page.
 */
export function usePatchapiPageidtoggleactive(
  options?: Omit<UseMutationOptions<void, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => patchapiPageidtoggleactive(variables.id),
    ...options,
  });
}

/**
 * Updates the tags of a page.
 */
export function usePatchapiPageidtags(
  options?: Omit<UseMutationOptions<void, Error, { id: string; data: string[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: string[] }) => patchapiPageidtags(variables.id, variables.data),
    ...options,
  });
}
