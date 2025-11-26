import axiosInstance from '../../axios-instance';

import type {
  QrLoginRequest,
  RefreshTokenRequest,
  GenerateTokenRequest,
  AuthTokenResponseResult,
  QrLoginTokenResponseResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Auth Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Auth API endpoints
 */
export const AUTH_ENDPOINTS = {
  postapiAuthgeneratetoken: '/api/Auth/generate-token',
  postapiAuthgeneratetokenfromcurrent: '/api/Auth/generate-token-from-current',
  postapiAuthrefreshtoken: '/api/Auth/refresh-token',
  postapiAuthrevoketoken: '/api/Auth/revoke-token',
  postapiAuthrevokealltokens: '/api/Auth/revoke-all-tokens',
  postapiAuthgenerateqrlogintoken: '/api/Auth/generate-qr-login-token',
  postapiAuthloginwithqrtoken: '/api/Auth/login-with-qr-token',
  getapiAuthloginwithtoken: '/api/Auth/login-with-token',
} as const;

/**
 * Generate JWT token with optional custom expiration time
 * @param data - Request body
 * @returns Promise<AuthTokenResponseResult>
 */
export async function postapiAuthgeneratetoken(data: GenerateTokenRequest): Promise<AuthTokenResponseResult> {
  const response = await axiosInstance.post<AuthTokenResponseResult>(AUTH_ENDPOINTS.postapiAuthgeneratetoken, data);
  return response.data;
}

/**
 * Generate JWT token for currently authenticated user (cookie-based)
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiAuthgeneratetokenfromcurrent(data: number): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.postapiAuthgeneratetokenfromcurrent, data);
}

/**
 * Refresh access token using refresh token
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiAuthrefreshtoken(data: RefreshTokenRequest): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.postapiAuthrefreshtoken, data);
}

/**
 * Revoke a specific refresh token
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiAuthrevoketoken(data: RefreshTokenRequest): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.postapiAuthrevoketoken, data);
}

/**
 * Revoke all refresh tokens for the current user
 * @returns Promise<void>
 */
export async function postapiAuthrevokealltokens(): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.postapiAuthrevokealltokens);
}

/**
 * Generate a one-time use QR code token for authenticated user
 *
 * This endpoint generates a secure one-time use token that can be encoded in a QR code.
The token expires after 2 minutes and can only be used once.
The authenticated user on one device can scan this QR code on another device to log in without entering credentials.
 * @returns Promise<QrLoginTokenResponseResult>
 */
export async function postapiAuthgenerateqrlogintoken(): Promise<QrLoginTokenResponseResult> {
  const response = await axiosInstance.post<QrLoginTokenResponseResult>(AUTH_ENDPOINTS.postapiAuthgenerateqrlogintoken);
  return response.data;
}

/**
 * Login using a one-time QR code token
 *
 * This endpoint consumes a one-time use token (from QR code scan) and logs the user in.
The token is validated and then marked as consumed. If successful, returns authentication tokens.
 * @param data - Request body
 * @returns Promise<AuthTokenResponseResult>
 */
export async function postapiAuthloginwithqrtoken(data: QrLoginRequest): Promise<AuthTokenResponseResult> {
  const response = await axiosInstance.post<AuthTokenResponseResult>(AUTH_ENDPOINTS.postapiAuthloginwithqrtoken, data);
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function getapiAuthloginwithtoken(params?: { token?: string; redirectUri?: string }): Promise<void> {
  await axiosInstance.get(AUTH_ENDPOINTS.getapiAuthloginwithtoken, { params });
}
