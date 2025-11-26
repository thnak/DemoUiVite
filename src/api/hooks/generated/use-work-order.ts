import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWorkOrder,
  deleteWorkOrder,
  generateNewWorkOrderCode,
  getWorkOrderById,
  getWorkOrderPage,
  updateWorkOrder,
} from '../../services/generated/work-order';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WorkOrderEntity,
  WorkOrderEntityBasePaginationResponse,
  WorkOrderEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkOrder Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for WorkOrder
 */
export const workOrderKeys = {
  all: ['workOrder'] as const,
  getWorkOrderById: (id: string) => ['workOrder', 'getWorkOrderById', id] as const,
  generateNewWorkOrderCode: ['workOrder', 'generateNewWorkOrderCode'] as const,
};

/**
 * Get Work Order by ID
 */
export function useGetWorkOrderById(
  id: string,
  options?: Omit<UseQueryOptions<WorkOrderEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workOrderKeys.getWorkOrderById(id),
    queryFn: () => getWorkOrderById(id),
    ...options,
  });
}

/**
 * Generate a new code for Work Order
 */
export function useGenerateNewWorkOrderCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workOrderKeys.generateNewWorkOrderCode,
    queryFn: () => generateNewWorkOrderCode(),
    ...options,
  });
}

/**
 * Get paginated list of Work Order
 */
export function useGetWorkOrderPage(
  options?: Omit<UseMutationOptions<WorkOrderEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getWorkOrderPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Work Order
 */
export function useCreateWorkOrder(
  options?: Omit<UseMutationOptions<WorkOrderEntityResult, Error, { data: WorkOrderEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: WorkOrderEntity }) => createWorkOrder(variables.data),
    ...options,
  });
}

/**
 * Update an existing Work Order
 */
export function useUpdateWorkOrder(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateWorkOrder(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Work Order
 */
export function useDeleteWorkOrder(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWorkOrder(variables.id),
    ...options,
  });
}
