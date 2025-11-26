import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ScriptVariantDto,
  ScriptVariantEntity,
  ScriptVariantEntityBasePaginationResponse,
  ScriptVariantEntityPaginationQuery,
  ScriptVariantEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptVariant Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ScriptVariant API endpoints
 */
export const SCRIPTVARIANT_ENDPOINTS = {
  getScriptVariantById: '/api/scriptvariant/{id}',
  getScriptVariantPage: '/api/scriptvariant/get-page',
  createScriptVariant: '/api/scriptvariant/create',
  updateScriptVariant: '/api/scriptvariant/update/{id}',
  deleteScriptVariant: '/api/scriptvariant/delete/{id}',
  generateNewScriptVariantCode: '/api/scriptvariant/generate-new-code',
  searchScriptVariant: '/api/scriptvariant/search',
  postapiScriptVariantcreate: '/api/ScriptVariant/create',
  putapiScriptVariantdeletename: '/api/ScriptVariant/delete/{name}',
  getapiScriptVariantgetid: '/api/ScriptVariant/get/{id}',
  postapiScriptVariantgetscripts: '/api/ScriptVariant/get-scripts',
  getapiScriptVariantgetscriptbyresponsetype: '/api/ScriptVariant/get-script-by-response-type',
  postapiScriptVariantupdateid: '/api/ScriptVariant/update/{id}',
} as const;

/**
 * Get Script Variant by ID
 *
 * Retrieves a specific Script Variant entity by its unique identifier.
 * @returns Promise<ScriptVariantEntity>
 */
export async function getScriptVariantById(id: string): Promise<ScriptVariantEntity> {
  const response = await axiosInstance.get<ScriptVariantEntity>(`/api/scriptvariant/${id}`);
  return response.data;
}

/**
 * Get paginated list of Script Variant
 *
 * Retrieves a paginated list of Script Variant entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ScriptVariantEntityBasePaginationResponse>
 */
export async function getScriptVariantPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ScriptVariantEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ScriptVariantEntityBasePaginationResponse>(SCRIPTVARIANT_ENDPOINTS.getScriptVariantPage, data, { params });
  return response.data;
}

/**
 * Create a new Script Variant
 *
 * Creates a new Script Variant entity in the system.
 * @param data - Request body
 * @returns Promise<ScriptVariantEntityResult>
 */
export async function createScriptVariant(data: ScriptVariantEntity): Promise<ScriptVariantEntityResult> {
  const response = await axiosInstance.post<ScriptVariantEntityResult>(SCRIPTVARIANT_ENDPOINTS.createScriptVariant, data);
  return response.data;
}

/**
 * Update an existing Script Variant
 *
 * Updates specific fields of an existing Script Variant entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateScriptVariant(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/scriptvariant/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Script Variant
 *
 * Deletes a Script Variant entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteScriptVariant(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/scriptvariant/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Script Variant
 *
 * Generates a new unique code for a Script Variant entity.
 * @returns Promise<string>
 */
export async function generateNewScriptVariantCode(): Promise<string> {
  const response = await axiosInstance.get<string>(SCRIPTVARIANT_ENDPOINTS.generateNewScriptVariantCode);
  return response.data;
}

/**
 * Search Script Variant entities
 *
 * Searches Script Variant entities by text across searchable fields.
 * @returns Promise<ScriptVariantEntity[]>
 */
export async function searchScriptVariant(params?: { searchText?: string; maxResults?: number }): Promise<ScriptVariantEntity[]> {
  const response = await axiosInstance.get<ScriptVariantEntity[]>(SCRIPTVARIANT_ENDPOINTS.searchScriptVariant, { params });
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiScriptVariantcreate(data: ScriptVariantEntity): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(SCRIPTVARIANT_ENDPOINTS.postapiScriptVariantcreate, data);
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function putapiScriptVariantdeletename(name: string): Promise<void> {
  await axiosInstance.put(`/api/ScriptVariant/delete/${name}`);
}

/**
 * @returns Promise<ScriptVariantEntity>
 */
export async function getapiScriptVariantgetid(id: string): Promise<ScriptVariantEntity> {
  const response = await axiosInstance.get<ScriptVariantEntity>(`/api/ScriptVariant/get/${id}`);
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ScriptVariantEntityPaginationQuery>
 */
export async function postapiScriptVariantgetscripts(data: SortType[], params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ScriptVariantEntityPaginationQuery> {
  const response = await axiosInstance.post<ScriptVariantEntityPaginationQuery>(SCRIPTVARIANT_ENDPOINTS.postapiScriptVariantgetscripts, data, { params });
  return response.data;
}

/**
 * @param type - Type of response result
 * @returns Promise<ScriptVariantDto[]>
 */
export async function getapiScriptVariantgetscriptbyresponsetype(params?: { type?: string; search?: string; pageSize?: number }): Promise<ScriptVariantDto[]> {
  const response = await axiosInstance.get<ScriptVariantDto[]>(SCRIPTVARIANT_ENDPOINTS.getapiScriptVariantgetscriptbyresponsetype, { params });
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiScriptVariantupdateid(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/ScriptVariant/update/${id}`, data);
  return response.data;
}
