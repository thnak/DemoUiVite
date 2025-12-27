// ----------------------------------------------------------------------
// Auth API Types
// Based on OpenAPI specification from docs/response.json
// ----------------------------------------------------------------------

/**
 * Request payload for generating a JWT token
 */
export type GenerateTokenRequest = {
  username?: string;
  password?: string;
  expirationMinutes?: number;
  setRefreshTokenInCookie?: boolean;
};

/**
 * Request payload for refreshing or revoking a token
 */
export type RefreshTokenRequest = {
  refreshToken?: string;
};

/**
 * Auth token response
 */
export type AuthTokenResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};

/**
 * Result wrapper for auth token response
 */
export type AuthTokenResponseResult = {
  value?: AuthTokenResponse;
  isSuccess?: boolean;
  message?: string;
  errorType?: ErrorType;
};

/**
 * QR Login request
 */
export type QrLoginRequest = {
  token?: string;
};

/**
 * QR Login token response
 */
export type QrLoginTokenResponse = {
  token?: string;
  expiresAt?: string;
};

/**
 * Result wrapper for QR login token response
 */
export type QrLoginTokenResponseResult = {
  value?: QrLoginTokenResponse;
  isSuccess?: boolean;
  message?: string;
  errorType?: ErrorType;
};

/**
 * Error types enum
 */
export type ErrorType =
  | 'none'
  | 'validation'
  | 'notFound'
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'internal'
  | 'external'
  | 'timeout'
  | 'cancelled';
