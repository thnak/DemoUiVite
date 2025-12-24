import type { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { apiConfig } from './config';

// ----------------------------------------------------------------------

/**
 * Represents the common API Result pattern used for error responses.
 * This matches the structure of XxxResult types in the generated API types.
 */
interface ApiResultError {
  /** Indicates whether the API operation was successful. Present in all Result types. */
  isSuccess?: boolean;
  /** Indicates whether the validation was successful. Present in ValidationResult types. */
  isValid?: boolean;
  /** The error or success message from the API. Present when the API returns a message. */
  message?: string | null;
  /** The type of error (e.g., 'validation', 'notFound'). Present in error responses. */
  errorType?: string;
  /** The dictionary of property errors. Present in ValidationResult types. */
  errors?: Record<string, { message?: string | null; severity?: string }> | null;
}

/**
 * Custom API error that preserves the original axios error properties
 * while exposing the API error message and validation errors.
 */
export class ApiError extends Error {
  /** The HTTP status code from the response */
  readonly status?: number;
  /** The error type from the API response */
  readonly errorType?: string;
  /** The original axios error, if available */
  readonly originalError?: AxiosError;
  /** Indicates whether the validation was successful */
  readonly isValid?: boolean;
  /** The dictionary of property errors for ValidationResult responses */
  readonly errors?: Record<string, { message?: string | null; severity?: string }> | null;

  constructor(
    message: string,
    status?: number,
    errorType?: string,
    originalError?: AxiosError,
    isValid?: boolean,
    errors?: Record<string, { message?: string | null; severity?: string }> | null
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorType = errorType;
    this.originalError = originalError;
    this.isValid = isValid;
    this.errors = errors;
  }
}

/**
 * Create axios instance with default configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Adds base URL
 * - Adds authorization token if available
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Set base URL from config
    config.baseURL = apiConfig.baseUrl;

    // Add authorization token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * - Handles common error responses
 * - Extracts error messages and validation errors from API response body (for 400 errors with Result/ValidationResult type responses)
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResultError>) => {
    // Check if the error response has a message in the body (common for API Result types)
    // Use explicit null/undefined check to handle empty string messages
    const apiMessage = error.response?.data?.message;
    if (apiMessage !== undefined && apiMessage !== null) {
      // Create an ApiError that preserves original error properties while using the API message
      // Also include isValid and errors fields for ValidationResult responses
      const apiError = new ApiError(
        apiMessage,
        error.response?.status,
        error.response?.data?.errorType,
        error,
        error.response?.data?.isValid,
        error.response?.data?.errors
      );
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

export type { AxiosResponse, AxiosRequestConfig };

export default axiosInstance;
