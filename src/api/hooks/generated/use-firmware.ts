import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiFirmwaredownloadid,
  getapiFirmwaregetid,
  postapiFirmwarecraftnewrelease,
  postapiFirmwaregetlatestfirmwareversion,
  postapiFirmwarepublish,
} from '../../services/generated/firmware';

import type {
  BooleanResult,
  GetAllFirmwareVersionsResponse,
  GetAllFirmwareVersionsResponsePaginationQuery,
  SortType,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Firmware Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Firmware
 */
export const firmwareKeys = {
  all: ['firmware'] as const,
  getapiFirmwaregetid: (id: string) => ['firmware', 'getapiFirmwaregetid', id] as const,
  getapiFirmwaredownloadid: (id: string) => ['firmware', 'getapiFirmwaredownloadid', id] as const,
};

/**
 */
export function useGetapiFirmwaregetid(
  id: string,
  options?: Omit<UseQueryOptions<GetAllFirmwareVersionsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: firmwareKeys.getapiFirmwaregetid(id),
    queryFn: () => getapiFirmwaregetid(id),
    ...options,
  });
}

/**
 */
export function useGetapiFirmwaredownloadid(
  id: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: firmwareKeys.getapiFirmwaredownloadid(id),
    queryFn: () => getapiFirmwaredownloadid(id),
    ...options,
  });
}

/**
 */
export function usePostapiFirmwarecraftnewrelease(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiFirmwarecraftnewrelease,
    ...options,
  });
}

/**
 */
export function usePostapiFirmwaregetlatestfirmwareversion(
  options?: Omit<UseMutationOptions<GetAllFirmwareVersionsResponsePaginationQuery, Error, { data: SortType[]; params?: { ModelTypeId?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { ModelTypeId?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiFirmwaregetlatestfirmwareversion(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiFirmwarepublish(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { params?: { id?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { id?: string } }) => postapiFirmwarepublish(variables.params),
    ...options,
  });
}
