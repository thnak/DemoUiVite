import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createIoTDevice,
  deleteIoTDevice,
  searchIoTDevice,
  updateIoTDevice,
  getIoTDeviceById,
  getIoTDevicePage,
  generateNewIoTDeviceCode,
} from '../../services/generated/io-tdevice';

import type {
  SortType,
  BooleanResult,
  IoTDeviceEntity,
  IoTDeviceEntityResult,
  StringObjectKeyValuePair,
  IoTDeviceEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTDevice Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for IoTDevice
 */
export const ioTDeviceKeys = {
  all: ['ioTDevice'] as const,
  getIoTDeviceById: (id: string) => ['ioTDevice', 'getIoTDeviceById', id] as const,
  generateNewIoTDeviceCode: ['ioTDevice', 'generateNewIoTDeviceCode'] as const,
  searchIoTDevice: ['ioTDevice', 'searchIoTDevice'] as const,
};

/**
 * Get Io TDevice by ID
 */
export function useGetIoTDeviceById(
  id: string,
  options?: Omit<UseQueryOptions<IoTDeviceEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceKeys.getIoTDeviceById(id),
    queryFn: () => getIoTDeviceById(id),
    ...options,
  });
}

/**
 * Generate a new code for Io TDevice
 */
export function useGenerateNewIoTDeviceCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceKeys.generateNewIoTDeviceCode,
    queryFn: () => generateNewIoTDeviceCode(),
    ...options,
  });
}

/**
 * Search Io TDevice entities
 */
export function useSearchIoTDevice(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<IoTDeviceEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceKeys.searchIoTDevice,
    queryFn: () => searchIoTDevice(params),
    ...options,
  });
}

/**
 * Get paginated list of Io TDevice
 */
export function useGetIoTDevicePage(
  options?: Omit<UseMutationOptions<IoTDeviceEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getIoTDevicePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Io TDevice
 */
export function useCreateIoTDevice(
  options?: Omit<UseMutationOptions<IoTDeviceEntityResult, Error, { data: IoTDeviceEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: IoTDeviceEntity }) => createIoTDevice(variables.data),
    ...options,
  });
}

/**
 * Update an existing Io TDevice
 */
export function useUpdateIoTDevice(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateIoTDevice(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Io TDevice
 */
export function useDeleteIoTDevice(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteIoTDevice(variables.id),
    ...options,
  });
}
