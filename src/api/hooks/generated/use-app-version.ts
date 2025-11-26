import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiAppVersionappversionchange,
  postapiAppVersionforcereload,
  postapiAppVersionnewversionavailable,
} from '../../services/generated/app-version';

// ----------------------------------------------------------------------
// AppVersion Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for AppVersion
 */
export const appVersionKeys = {
  all: ['appVersion'] as const,
};

/**
 */
export function usePostapiAppVersionnewversionavailable(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiAppVersionnewversionavailable,
    ...options,
  });
}

/**
 */
export function usePostapiAppVersionforcereload(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiAppVersionforcereload,
    ...options,
  });
}

/**
 */
export function usePostapiAppVersionappversionchange(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiAppVersionappversionchange,
    ...options,
  });
}
