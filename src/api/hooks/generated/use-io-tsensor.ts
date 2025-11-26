import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createIoTSensor,
  deleteIoTSensor,
  generateNewIoTSensorCode,
  getIoTSensorById,
  getIoTSensorPage,
  searchIoTSensor,
  updateIoTSensor,
} from '../../services/generated/io-tsensor';

import type {
  BooleanResult,
  IoTSensorEntity,
  IoTSensorEntityBasePaginationResponse,
  IoTSensorEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTSensor Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for IoTSensor
 */
export const ioTSensorKeys = {
  all: ['ioTSensor'] as const,
  getIoTSensorById: (id: string) => ['ioTSensor', 'getIoTSensorById', id] as const,
  generateNewIoTSensorCode: ['ioTSensor', 'generateNewIoTSensorCode'] as const,
  searchIoTSensor: ['ioTSensor', 'searchIoTSensor'] as const,
};

/**
 * Get Io TSensor by ID
 */
export function useGetIoTSensorById(
  id: string,
  options?: Omit<UseQueryOptions<IoTSensorEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTSensorKeys.getIoTSensorById(id),
    queryFn: () => getIoTSensorById(id),
    ...options,
  });
}

/**
 * Generate a new code for Io TSensor
 */
export function useGenerateNewIoTSensorCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTSensorKeys.generateNewIoTSensorCode,
    queryFn: () => generateNewIoTSensorCode(),
    ...options,
  });
}

/**
 * Search Io TSensor entities
 */
export function useSearchIoTSensor(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<IoTSensorEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTSensorKeys.searchIoTSensor,
    queryFn: () => searchIoTSensor(params),
    ...options,
  });
}

/**
 * Get paginated list of Io TSensor
 */
export function useGetIoTSensorPage(
  options?: Omit<UseMutationOptions<IoTSensorEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getIoTSensorPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Io TSensor
 */
export function useCreateIoTSensor(
  options?: Omit<UseMutationOptions<IoTSensorEntityResult, Error, { data: IoTSensorEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: IoTSensorEntity }) => createIoTSensor(variables.data),
    ...options,
  });
}

/**
 * Update an existing Io TSensor
 */
export function useUpdateIoTSensor(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateIoTSensor(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Io TSensor
 */
export function useDeleteIoTSensor(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteIoTSensor(variables.id),
    ...options,
  });
}
