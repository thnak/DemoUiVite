import axiosInstance from '../../axios-instance';

import type {
  SortType,
  LocalizeAppLangDtoBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Localization Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Localization API endpoints
 */
export const LOCALIZATION_ENDPOINTS = {
  postapitranslationsgetlang: '/api/translations/get-lang',
  getapitranslationslangCode: '/api/translations/{langCode}',
  getapitranslationsbatch: '/api/translations/batch',
  postapitranslationsupload: '/api/translations/upload',
  getapitranslationsdownload: '/api/translations/download',
} as const;

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<LocalizeAppLangDtoBasePaginationResponse>
 */
export async function postapitranslationsgetlang(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<LocalizeAppLangDtoBasePaginationResponse> {
  const response = await axiosInstance.post<LocalizeAppLangDtoBasePaginationResponse>(LOCALIZATION_ENDPOINTS.postapitranslationsgetlang, data, { params });
  return response.data;
}

/**
 * Retrieves all translations for a specific language code.
GET /api/translations/{langCode}
 * @param langCode - The language code (e.g., "en", "es", "vi").
 * @returns Promise<Record<string, string>>
 */
export async function getapitranslationslangCode(langCode: string): Promise<Record<string, string>> {
  const response = await axiosInstance.get<Record<string, string>>(`/api/translations/${langCode}`);
  return response.data;
}

/**
 * Retrieves a batch of translations for specific keys and a given language code.
 * @param lang - The language code.
 * @param keys - Comma-separated list of translation keys.
 * @returns Promise<Record<string, string>>
 */
export async function getapitranslationsbatch(params?: { lang?: string; keys?: string[] }): Promise<Record<string, string>> {
  const response = await axiosInstance.get<Record<string, string>>(LOCALIZATION_ENDPOINTS.getapitranslationsbatch, { params });
  return response.data;
}

/**
 * upload excel file to update translations. the devault culture is vi-VN and it always have value while other culture can be empty
if other culture is empty, it must be auto translated by Ollama
 * @returns Promise<void>
 */
export async function postapitranslationsupload(): Promise<void> {
  await axiosInstance.post(LOCALIZATION_ENDPOINTS.postapitranslationsupload);
}

/**
 * @returns Promise<File>
 */
export async function getapitranslationsdownload(): Promise<File> {
  const response = await axiosInstance.get<File>(LOCALIZATION_ENDPOINTS.getapitranslationsdownload);
  return response.data;
}
