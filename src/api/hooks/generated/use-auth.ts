import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiAuthrevoketoken,
  postapiAuthrefreshtoken,
  getapiAuthloginwithtoken,
  postapiAuthgeneratetoken,
  postapiAuthrevokealltokens,
  postapiAuthloginwithqrtoken,
  postapiAuthgenerateqrlogintoken,
  postapiAuthgeneratetokenfromcurrent,
} from '../../services/generated/auth';

import type {
  QrLoginRequest,
  RefreshTokenRequest,
  GenerateTokenRequest,
  AuthTokenResponseResult,
  QrLoginTokenResponseResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Auth Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Auth
 */
export const authKeys = {
  all: ['auth'] as const,
  getapiAuthloginwithtoken: ['auth', 'getapiAuthloginwithtoken'] as const,
};

/**
 */
export function useGetapiAuthloginwithtoken(
  params?: { token?: string; redirectUri?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: authKeys.getapiAuthloginwithtoken,
    queryFn: () => getapiAuthloginwithtoken(params),
    ...options,
  });
}

/**
 * Generate JWT token with optional custom expiration time
 */
export function usePostapiAuthgeneratetoken(
  options?: Omit<UseMutationOptions<AuthTokenResponseResult, Error, { data: GenerateTokenRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: GenerateTokenRequest }) => postapiAuthgeneratetoken(variables.data),
    ...options,
  });
}

/**
 * Generate JWT token for currently authenticated user (cookie-based)
 */
export function usePostapiAuthgeneratetokenfromcurrent(
  options?: Omit<UseMutationOptions<void, Error, { data: number }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: number }) => postapiAuthgeneratetokenfromcurrent(variables.data),
    ...options,
  });
}

/**
 * Refresh access token using refresh token
 */
export function usePostapiAuthrefreshtoken(
  options?: Omit<UseMutationOptions<void, Error, { data: RefreshTokenRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: RefreshTokenRequest }) => postapiAuthrefreshtoken(variables.data),
    ...options,
  });
}

/**
 * Revoke a specific refresh token
 */
export function usePostapiAuthrevoketoken(
  options?: Omit<UseMutationOptions<void, Error, { data: RefreshTokenRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: RefreshTokenRequest }) => postapiAuthrevoketoken(variables.data),
    ...options,
  });
}

/**
 * Revoke all refresh tokens for the current user
 */
export function usePostapiAuthrevokealltokens(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiAuthrevokealltokens,
    ...options,
  });
}

/**
 * Generate a one-time use QR code token for authenticated user
 */
export function usePostapiAuthgenerateqrlogintoken(
  options?: Omit<UseMutationOptions<QrLoginTokenResponseResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiAuthgenerateqrlogintoken,
    ...options,
  });
}

/**
 * Login using a one-time QR code token
 */
export function usePostapiAuthloginwithqrtoken(
  options?: Omit<UseMutationOptions<AuthTokenResponseResult, Error, { data: QrLoginRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: QrLoginRequest }) => postapiAuthloginwithqrtoken(variables.data),
    ...options,
  });
}
