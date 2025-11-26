import axiosInstance from '../axios-instance';

import type { RefreshTokenRequest, GenerateTokenRequest, AuthTokenResponseResult } from '../types';

// ----------------------------------------------------------------------
// Auth Service
// Endpoints for authentication and token management
// ----------------------------------------------------------------------

/**
 * Auth API endpoints
 */
export const AUTH_ENDPOINTS = {
  generateToken: '/api/Auth/generate-token',
  refreshToken: '/api/Auth/refresh-token',
  revokeToken: '/api/Auth/revoke-token',
  revokeAllTokens: '/api/Auth/revoke-all-tokens',
} as const;

/**
 * Generate a JWT token with optional custom expiration time
 *
 * @param data - The token generation request containing userName, password, and optional expirationMinutes
 * @returns Promise with auth token response
 */
export async function generateToken(data: GenerateTokenRequest): Promise<AuthTokenResponseResult> {
  const response = await axiosInstance.post<AuthTokenResponseResult>(
    AUTH_ENDPOINTS.generateToken,
    data
  );
  return response.data;
}

/**
 * Refresh access token using refresh token
 *
 * @param data - The refresh token request
 * @returns Promise with new auth token response
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<AuthTokenResponseResult> {
  const response = await axiosInstance.post<AuthTokenResponseResult>(
    AUTH_ENDPOINTS.refreshToken,
    data
  );
  return response.data;
}

/**
 * Revoke a specific refresh token
 *
 * @param data - The refresh token to revoke
 * @returns Promise<void>
 */
export async function revokeToken(data: RefreshTokenRequest): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.revokeToken, data);
}

/**
 * Revoke all refresh tokens for the current user
 *
 * @returns Promise<void>
 */
export async function revokeAllTokens(): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.revokeAllTokens);
}
