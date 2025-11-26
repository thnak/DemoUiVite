import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createCustomer,
  deleteCustomer,
  generateNewCustomerCode,
  getCustomerById,
  getCustomerPage,
  updateCustomer,
} from '../../services/generated/customer';

import type {
  BooleanResult,
  CustomerEntity,
  CustomerEntityBasePaginationResponse,
  CustomerEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Customer Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Customer
 */
export const customerKeys = {
  all: ['customer'] as const,
  getCustomerById: (id: string) => ['customer', 'getCustomerById', id] as const,
  generateNewCustomerCode: ['customer', 'generateNewCustomerCode'] as const,
};

/**
 * Get Customer by ID
 */
export function useGetCustomerById(
  id: string,
  options?: Omit<UseQueryOptions<CustomerEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: customerKeys.getCustomerById(id),
    queryFn: () => getCustomerById(id),
    ...options,
  });
}

/**
 * Generate a new code for Customer
 */
export function useGenerateNewCustomerCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: customerKeys.generateNewCustomerCode,
    queryFn: () => generateNewCustomerCode(),
    ...options,
  });
}

/**
 * Get paginated list of Customer
 */
export function useGetCustomerPage(
  options?: Omit<UseMutationOptions<CustomerEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getCustomerPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Customer
 */
export function useCreateCustomer(
  options?: Omit<UseMutationOptions<CustomerEntityResult, Error, { data: CustomerEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: CustomerEntity }) => createCustomer(variables.data),
    ...options,
  });
}

/**
 * Update an existing Customer
 */
export function useUpdateCustomer(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateCustomer(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Customer
 */
export function useDeleteCustomer(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteCustomer(variables.id),
    ...options,
  });
}
