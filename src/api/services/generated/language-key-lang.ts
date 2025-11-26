import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  LanguageKeyLangEntity,
  StringObjectKeyValuePair,
  LanguageKeyLangEntityResult,
  LanguageKeyLangEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// LanguageKeyLang Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * LanguageKeyLang API endpoints
 */
export const LANGUAGEKEYLANG_ENDPOINTS = {
  getLanguageKeyLangById: '/api/languagekeylang/{id}',
  getLanguageKeyLangPage: '/api/languagekeylang/get-page',
  createLanguageKeyLang: '/api/languagekeylang/create',
  updateLanguageKeyLang: '/api/languagekeylang/update/{id}',
  deleteLanguageKeyLang: '/api/languagekeylang/delete/{id}',
  generateNewLanguageKeyLangCode: '/api/languagekeylang/generate-new-code',
} as const;

/**
 * Get Language Key Lang by ID
 *
 * Retrieves a specific Language Key Lang entity by its unique identifier.
 * @returns Promise<LanguageKeyLangEntity>
 */
export async function getLanguageKeyLangById(id: string): Promise<LanguageKeyLangEntity> {
  const response = await axiosInstance.get<LanguageKeyLangEntity>(`/api/languagekeylang/${id}`);
  return response.data;
}

/**
 * Get paginated list of Language Key Lang
 *
 * Retrieves a paginated list of Language Key Lang entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<LanguageKeyLangEntityBasePaginationResponse>
 */
export async function getLanguageKeyLangPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<LanguageKeyLangEntityBasePaginationResponse> {
  const response = await axiosInstance.post<LanguageKeyLangEntityBasePaginationResponse>(LANGUAGEKEYLANG_ENDPOINTS.getLanguageKeyLangPage, data, { params });
  return response.data;
}

/**
 * Create a new Language Key Lang
 *
 * Creates a new Language Key Lang entity in the system.
 * @param data - Request body
 * @returns Promise<LanguageKeyLangEntityResult>
 */
export async function createLanguageKeyLang(data: LanguageKeyLangEntity): Promise<LanguageKeyLangEntityResult> {
  const response = await axiosInstance.post<LanguageKeyLangEntityResult>(LANGUAGEKEYLANG_ENDPOINTS.createLanguageKeyLang, data);
  return response.data;
}

/**
 * Update an existing Language Key Lang
 *
 * Updates specific fields of an existing Language Key Lang entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateLanguageKeyLang(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/languagekeylang/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Language Key Lang
 *
 * Deletes a Language Key Lang entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteLanguageKeyLang(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/languagekeylang/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Language Key Lang
 *
 * Generates a new unique code for a Language Key Lang entity.
 * @returns Promise<string>
 */
export async function generateNewLanguageKeyLangCode(): Promise<string> {
  const response = await axiosInstance.get<string>(LANGUAGEKEYLANG_ENDPOINTS.generateNewLanguageKeyLangCode);
  return response.data;
}
