import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiModulesupload,
  getapiModulesgetmodules,
  getapiModulesgetmoduleicons,
} from '../../services/generated/modules';

// ----------------------------------------------------------------------
// Modules Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Modules
 */
export const modulesKeys = {
  all: ['modules'] as const,
  getapiModulesgetmodules: ['modules', 'getapiModulesgetmodules'] as const,
  getapiModulesgetmoduleicons: ['modules', 'getapiModulesgetmoduleicons'] as const,
};

/**
 */
export function useGetapiModulesgetmodules(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: modulesKeys.getapiModulesgetmodules,
    queryFn: () => getapiModulesgetmodules(),
    ...options,
  });
}

/**
 */
export function useGetapiModulesgetmoduleicons(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: modulesKeys.getapiModulesgetmoduleicons,
    queryFn: () => getapiModulesgetmoduleicons(),
    ...options,
  });
}

/**
 */
export function usePostapiModulesupload(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiModulesupload,
    ...options,
  });
}
