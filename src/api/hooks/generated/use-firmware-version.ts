import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFirmwareVersion,
  deleteFirmwareVersion,
  updateFirmwareVersion,
  getFirmwareVersionById,
  getFirmwareVersionPage,
  generateNewFirmwareVersionCode,
} from '../../services/generated/firmware-version';

import type {
  SortType,
  BooleanResult,
  FirmwareVersionEntity,
  StringObjectKeyValuePair,
  FirmwareVersionEntityResult,
  FirmwareVersionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FirmwareVersion Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FirmwareVersion
 */
export const firmwareVersionKeys = {
  all: ['firmwareVersion'] as const,
  getFirmwareVersionById: (id: string) =>
    ['firmwareVersion', 'getFirmwareVersionById', id] as const,
  generateNewFirmwareVersionCode: ['firmwareVersion', 'generateNewFirmwareVersionCode'] as const,
};

/**
 * Get Firmware Version by ID
 */
export function useGetFirmwareVersionById(
  id: string,
  options?: Omit<UseQueryOptions<FirmwareVersionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: firmwareVersionKeys.getFirmwareVersionById(id),
    queryFn: () => getFirmwareVersionById(id),
    ...options,
  });
}

/**
 * Generate a new code for Firmware Version
 */
export function useGenerateNewFirmwareVersionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: firmwareVersionKeys.generateNewFirmwareVersionCode,
    queryFn: () => generateNewFirmwareVersionCode(),
    ...options,
  });
}

/**
 * Get paginated list of Firmware Version
 */
export function useGetFirmwareVersionPage(
  options?: Omit<
    UseMutationOptions<
      FirmwareVersionEntityBasePaginationResponse,
      Error,
      { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: {
      data: SortType[];
      params?: { pageNumber?: number; pageSize?: number; searchTerm?: string };
    }) => getFirmwareVersionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Firmware Version
 */
export function useCreateFirmwareVersion(
  options?: Omit<
    UseMutationOptions<FirmwareVersionEntityResult, Error, { data: FirmwareVersionEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: FirmwareVersionEntity }) =>
      createFirmwareVersion(variables.data),
    ...options,
  });
}

/**
 * Update an existing Firmware Version
 */
export function useUpdateFirmwareVersion(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateFirmwareVersion(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Firmware Version
 */
export function useDeleteFirmwareVersion(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFirmwareVersion(variables.id),
    ...options,
  });
}
