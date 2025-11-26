import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createIoTDeviceGroup,
  deleteIoTDeviceGroup,
  generateNewIoTDeviceGroupCode,
  getIoTDeviceGroupById,
  getIoTDeviceGroupPage,
  searchIoTDeviceGroup,
  updateIoTDeviceGroup,
} from '../../services/generated/io-tdevice-group';

import type {
  BooleanResult,
  IoTDeviceGroupEntity,
  IoTDeviceGroupEntityBasePaginationResponse,
  IoTDeviceGroupEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTDeviceGroup Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for IoTDeviceGroup
 */
export const ioTDeviceGroupKeys = {
  all: ['ioTDeviceGroup'] as const,
  getIoTDeviceGroupById: (id: string) => ['ioTDeviceGroup', 'getIoTDeviceGroupById', id] as const,
  generateNewIoTDeviceGroupCode: ['ioTDeviceGroup', 'generateNewIoTDeviceGroupCode'] as const,
  searchIoTDeviceGroup: ['ioTDeviceGroup', 'searchIoTDeviceGroup'] as const,
};

/**
 * Get Io TDevice Group by ID
 */
export function useGetIoTDeviceGroupById(
  id: string,
  options?: Omit<UseQueryOptions<IoTDeviceGroupEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceGroupKeys.getIoTDeviceGroupById(id),
    queryFn: () => getIoTDeviceGroupById(id),
    ...options,
  });
}

/**
 * Generate a new code for Io TDevice Group
 */
export function useGenerateNewIoTDeviceGroupCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceGroupKeys.generateNewIoTDeviceGroupCode,
    queryFn: () => generateNewIoTDeviceGroupCode(),
    ...options,
  });
}

/**
 * Search Io TDevice Group entities
 */
export function useSearchIoTDeviceGroup(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<IoTDeviceGroupEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceGroupKeys.searchIoTDeviceGroup,
    queryFn: () => searchIoTDeviceGroup(params),
    ...options,
  });
}

/**
 * Get paginated list of Io TDevice Group
 */
export function useGetIoTDeviceGroupPage(
  options?: Omit<UseMutationOptions<IoTDeviceGroupEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getIoTDeviceGroupPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Io TDevice Group
 */
export function useCreateIoTDeviceGroup(
  options?: Omit<UseMutationOptions<IoTDeviceGroupEntityResult, Error, { data: IoTDeviceGroupEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: IoTDeviceGroupEntity }) => createIoTDeviceGroup(variables.data),
    ...options,
  });
}

/**
 * Update an existing Io TDevice Group
 */
export function useUpdateIoTDeviceGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateIoTDeviceGroup(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Io TDevice Group
 */
export function useDeleteIoTDeviceGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteIoTDeviceGroup(variables.id),
    ...options,
  });
}
