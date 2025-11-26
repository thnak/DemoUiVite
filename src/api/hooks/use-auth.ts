import type { UseMutationOptions } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import {
  revokeToken,
  refreshToken,
  generateToken,
  revokeAllTokens,
} from '../services/auth';

import type {
  RefreshTokenRequest,
  GenerateTokenRequest,
  AuthTokenResponseResult,
} from '../types';

// ----------------------------------------------------------------------
// Auth Hooks - TanStack Query hooks for authentication
// ----------------------------------------------------------------------

/**
 * Hook to generate a JWT token
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useGenerateToken({
 *   onSuccess: (data) => {
 *     if (data.isSuccess && data.value) {
 *       localStorage.setItem('accessToken', data.value.accessToken);
 *       localStorage.setItem('refreshToken', data.value.refreshToken);
 *     }
 *   },
 * });
 *
 * mutate({ userName: 'user', password: 'password' });
 * ```
 */
export function useGenerateToken(
  options?: Omit<
    UseMutationOptions<AuthTokenResponseResult, Error, GenerateTokenRequest>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: generateToken,
    ...options,
  });
}

/**
 * Hook to refresh access token
 *
 * @example
 * ```tsx
 * const { mutate } = useRefreshToken({
 *   onSuccess: (data) => {
 *     if (data.isSuccess && data.value) {
 *       // Store tokens securely based on your app's requirements
 *       // Note: Consider using httpOnly cookies for better security
 *       storeTokenSecurely('accessToken', data.value.accessToken);
 *     }
 *   },
 * });
 *
 * mutate({ refreshToken: getStoredRefreshToken() });
 * ```
 */
export function useRefreshToken(
  options?: Omit<
    UseMutationOptions<AuthTokenResponseResult, Error, RefreshTokenRequest>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: refreshToken,
    ...options,
  });
}

/**
 * Hook to revoke a specific refresh token
 *
 * @example
 * ```tsx
 * const { mutate } = useRevokeToken({
 *   onSuccess: () => {
 *     // Clear stored refresh token
 *     clearStoredRefreshToken();
 *   },
 * });
 *
 * mutate({ refreshToken: getStoredRefreshToken() });
 * ```
 */
export function useRevokeToken(
  options?: Omit<UseMutationOptions<void, Error, RefreshTokenRequest>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: revokeToken,
    ...options,
  });
}

/**
 * Hook to revoke all refresh tokens for the current user
 *
 * @example
 * ```tsx
 * const { mutate } = useRevokeAllTokens({
 *   onSuccess: () => {
 *     localStorage.removeItem('accessToken');
 *     localStorage.removeItem('refreshToken');
 *     // Redirect to login page
 *   },
 * });
 *
 * mutate();
 * ```
 */
export function useRevokeAllTokens(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: revokeAllTokens,
    ...options,
  });
}
