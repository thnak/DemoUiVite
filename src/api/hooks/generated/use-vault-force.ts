import type { UseMutationOptions } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import {
  postshutdown,
  postAccountLogout,
  postAccountPerformExternalLogin,
  postAccountPasskeyRequestOptions,
  postAccountPasskeyCreationOptions,
  postAccountManageLinkExternalLogin,
  postAccountManageDownloadPersonalData,
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
    mutationFn: (variables: { params?: { username?: string } }) =>
      postAccountPasskeyRequestOptions(variables.params),
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
