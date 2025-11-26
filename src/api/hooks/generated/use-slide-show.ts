import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createSlideShow,
  deleteSlideShow,
  updateSlideShow,
  getSlideShowById,
  getSlideShowPage,
  generateNewSlideShowCode,
} from '../../services/generated/slide-show';

import type {
  SortType,
  BooleanResult,
  SlideShowEntity,
  SlideShowEntityResult,
  StringObjectKeyValuePair,
  SlideShowEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SlideShow Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for SlideShow
 */
export const slideShowKeys = {
  all: ['slideShow'] as const,
  getSlideShowById: (id: string) => ['slideShow', 'getSlideShowById', id] as const,
  generateNewSlideShowCode: ['slideShow', 'generateNewSlideShowCode'] as const,
};

/**
 * Get Slide Show by ID
 */
export function useGetSlideShowById(
  id: string,
  options?: Omit<UseQueryOptions<SlideShowEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: slideShowKeys.getSlideShowById(id),
    queryFn: () => getSlideShowById(id),
    ...options,
  });
}

/**
 * Generate a new code for Slide Show
 */
export function useGenerateNewSlideShowCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: slideShowKeys.generateNewSlideShowCode,
    queryFn: () => generateNewSlideShowCode(),
    ...options,
  });
}

/**
 * Get paginated list of Slide Show
 */
export function useGetSlideShowPage(
  options?: Omit<UseMutationOptions<SlideShowEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getSlideShowPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Slide Show
 */
export function useCreateSlideShow(
  options?: Omit<UseMutationOptions<SlideShowEntityResult, Error, { data: SlideShowEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SlideShowEntity }) => createSlideShow(variables.data),
    ...options,
  });
}

/**
 * Update an existing Slide Show
 */
export function useUpdateSlideShow(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateSlideShow(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Slide Show
 */
export function useDeleteSlideShow(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteSlideShow(variables.id),
    ...options,
  });
}
