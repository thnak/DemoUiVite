import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  deleteapiTenantdeleteid,
  postapiTenantcreate,
  postapiTenantgetalltenants,
  putapiTenantupdate,
} from '../../services/generated/tenant';

import type {
  CreateNewTenantRequest,
  SortType,
  UpdateTenantRequest,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Tenant Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Tenant
 */
export const tenantKeys = {
  all: ['tenant'] as const,
};

/**
 */
export function usePostapiTenantcreate(
  options?: Omit<UseMutationOptions<void, Error, { data: CreateNewTenantRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: CreateNewTenantRequest }) => postapiTenantcreate(variables.data),
    ...options,
  });
}

/**
 */
export function useDeleteapiTenantdeleteid(
  options?: Omit<UseMutationOptions<void, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteapiTenantdeleteid(variables.id),
    ...options,
  });
}

/**
 */
export function usePostapiTenantgetalltenants(
  options?: Omit<UseMutationOptions<void, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiTenantgetalltenants(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePutapiTenantupdate(
  options?: Omit<UseMutationOptions<void, Error, { data: UpdateTenantRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: UpdateTenantRequest }) => putapiTenantupdate(variables.data),
    ...options,
  });
}
