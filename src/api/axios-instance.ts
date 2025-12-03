import type { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { apiConfig } from './config';

// ----------------------------------------------------------------------

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
 * - Extracts error messages from API response body (for 400 errors with Result type responses)
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; isSuccess?: boolean }>) => {
    // Check if the error response has a message in the body (common for API Result types)
    if (error.response?.data?.message) {
      // Create a new error with the API message instead of the generic axios message
      const apiError = new Error(error.response.data.message);
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

export type { AxiosResponse, AxiosRequestConfig };

export default axiosInstance;
