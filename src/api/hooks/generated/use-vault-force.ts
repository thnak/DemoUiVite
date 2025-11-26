import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postAccountLogout,
  postAccountManageDownloadPersonalData,
  postAccountManageLinkExternalLogin,
  postAccountPasskeyCreationOptions,
  postAccountPasskeyRequestOptions,
  postAccountPerformExternalLogin,
  postshutdown,
} from '../../services/generated/vault-force';

// ----------------------------------------------------------------------
// VaultForce Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for VaultForce
 */
export const vaultForceKeys = {
  all: ['vaultForce'] as const,
};

/**
 */
export function usePostshutdown(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postshutdown,
    ...options,
  });
}

/**
 */
export function usePostAccountPerformExternalLogin(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postAccountPerformExternalLogin,
    ...options,
  });
}

/**
 */
export function usePostAccountLogout(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postAccountLogout,
    ...options,
  });
}

/**
 */
export function usePostAccountPasskeyCreationOptions(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postAccountPasskeyCreationOptions,
    ...options,
  });
}

/**
 */
export function usePostAccountPasskeyRequestOptions(
  options?: Omit<UseMutationOptions<void, Error, { params?: { username?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { username?: string } }) => postAccountPasskeyRequestOptions(variables.params),
    ...options,
  });
}

/**
 */
export function usePostAccountManageLinkExternalLogin(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postAccountManageLinkExternalLogin,
    ...options,
  });
}

/**
 */
export function usePostAccountManageDownloadPersonalData(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postAccountManageDownloadPersonalData,
    ...options,
  });
}
