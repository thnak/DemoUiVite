import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ScriptDefinitionEntity,
  ScriptDefinitionEntityBasePaginationResponse,
  ScriptDefinitionEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptDefinition Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ScriptDefinition API endpoints
 */
export const SCRIPTDEFINITION_ENDPOINTS = {
  getScriptDefinitionById: '/api/scriptdefinition/{id}',
  getScriptDefinitionPage: '/api/scriptdefinition/get-page',
  createScriptDefinition: '/api/scriptdefinition/create',
  updateScriptDefinition: '/api/scriptdefinition/update/{id}',
  deleteScriptDefinition: '/api/scriptdefinition/delete/{id}',
  generateNewScriptDefinitionCode: '/api/scriptdefinition/generate-new-code',
  searchScriptDefinition: '/api/scriptdefinition/search',
} as const;

/**
 * Get Script Definition by ID
 *
 * Retrieves a specific Script Definition entity by its unique identifier.
 * @returns Promise<ScriptDefinitionEntity>
 */
export async function getScriptDefinitionById(id: string): Promise<ScriptDefinitionEntity> {
  const response = await axiosInstance.get<ScriptDefinitionEntity>(`/api/scriptdefinition/${id}`);
  return response.data;
}

/**
 * Get paginated list of Script Definition
 *
 * Retrieves a paginated list of Script Definition entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ScriptDefinitionEntityBasePaginationResponse>
 */
export async function getScriptDefinitionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ScriptDefinitionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ScriptDefinitionEntityBasePaginationResponse>(SCRIPTDEFINITION_ENDPOINTS.getScriptDefinitionPage, data, { params });
  return response.data;
}

/**
 * Create a new Script Definition
 *
 * Creates a new Script Definition entity in the system.
 * @param data - Request body
 * @returns Promise<ScriptDefinitionEntityResult>
 */
export async function createScriptDefinition(data: ScriptDefinitionEntity): Promise<ScriptDefinitionEntityResult> {
  const response = await axiosInstance.post<ScriptDefinitionEntityResult>(SCRIPTDEFINITION_ENDPOINTS.createScriptDefinition, data);
  return response.data;
}

/**
 * Update an existing Script Definition
 *
 * Updates specific fields of an existing Script Definition entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateScriptDefinition(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/scriptdefinition/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Script Definition
 *
 * Deletes a Script Definition entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteScriptDefinition(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/scriptdefinition/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Script Definition
 *
 * Generates a new unique code for a Script Definition entity.
 * @returns Promise<string>
 */
export async function generateNewScriptDefinitionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(SCRIPTDEFINITION_ENDPOINTS.generateNewScriptDefinitionCode);
  return response.data;
}

/**
 * Search Script Definition entities
 *
 * Searches Script Definition entities by text across searchable fields.
 * @returns Promise<ScriptDefinitionEntity[]>
 */
export async function searchScriptDefinition(params?: { searchText?: string; maxResults?: number }): Promise<ScriptDefinitionEntity[]> {
  const response = await axiosInstance.get<ScriptDefinitionEntity[]>(SCRIPTDEFINITION_ENDPOINTS.searchScriptDefinition, { params });
  return response.data;
}
