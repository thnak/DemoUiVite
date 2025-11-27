import axiosInstance from '../../axios-instance';

import type {
  SortType,
  ObjectResult,
  BooleanResult,
  CreateRequest,
  TryRunMetricRequest,
  ScriptDefinitionEntity,
  StringObjectKeyValuePair,
  ScriptDefinitionEntityPaginationQuery,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptDefine Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ScriptDefine API endpoints
 */
export const SCRIPTDEFINE_ENDPOINTS = {
  postapiScriptDefinecreate: '/api/ScriptDefine/create',
  postapiScriptDefinerecheckscriptdefineid: '/api/ScriptDefine/re-check-script-define/{id}',
  putapiScriptDefinedeletescriptdefinename: '/api/ScriptDefine/delete-script-define/{name}',
  postapiScriptDefinetryrunscript: '/api/ScriptDefine/try-run-script',
  postapiScriptDefinetryrunscriptvariantscriptId: '/api/ScriptDefine/try-run-script-variant/{scriptId}',
  getapiScriptDefinegetscriptdefinitionid: '/api/ScriptDefine/get-script-definition/{id}',
  postapiScriptDefinegetscriptdefinitions: '/api/ScriptDefine/get-script-definitions',
  postapiScriptDefinesearchscriptdefinitions: '/api/ScriptDefine/search-script-definitions',
  postapiScriptDefinesearchscriptdefinebytype: '/api/ScriptDefine/search-script-define-by-type',
  putapiScriptDefineupdatescriptdefineid: '/api/ScriptDefine/update-script-define/{id}',
  getapiScriptDefineupdateenablestateid: '/api/ScriptDefine/update-enable-state/{id}',
  postapiScriptDefineuploadpluginid: '/api/ScriptDefine/upload-plugin/{id}',
} as const;

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiScriptDefinecreate(data: CreateRequest): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(SCRIPTDEFINE_ENDPOINTS.postapiScriptDefinecreate, data);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiScriptDefinerecheckscriptdefineid(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/ScriptDefine/re-check-script-define/${id}`);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function putapiScriptDefinedeletescriptdefinename(name: string): Promise<BooleanResult> {
  const response = await axiosInstance.put<BooleanResult>(`/api/ScriptDefine/delete-script-define/${name}`);
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<ObjectResult>
 */
export async function postapiScriptDefinetryrunscript(data: TryRunMetricRequest): Promise<ObjectResult> {
  const response = await axiosInstance.post<ObjectResult>(SCRIPTDEFINE_ENDPOINTS.postapiScriptDefinetryrunscript, data);
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<ObjectResult>
 */
export async function postapiScriptDefinetryrunscriptvariantscriptId(scriptId: string, data: StringObjectKeyValuePair[]): Promise<ObjectResult> {
  const response = await axiosInstance.post<ObjectResult>(`/api/ScriptDefine/try-run-script-variant/${scriptId}`, data);
  return response.data;
}

/**
 * @returns Promise<ScriptDefinitionEntity>
 */
export async function getapiScriptDefinegetscriptdefinitionid(id: string): Promise<ScriptDefinitionEntity> {
  const response = await axiosInstance.get<ScriptDefinitionEntity>(`/api/ScriptDefine/get-script-definition/${id}`);
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ScriptDefinitionEntityPaginationQuery>
 */
export async function postapiScriptDefinegetscriptdefinitions(data: SortType[], params?: { search?: string; fromTime?: string; toTime?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ScriptDefinitionEntityPaginationQuery> {
  const response = await axiosInstance.post<ScriptDefinitionEntityPaginationQuery>(SCRIPTDEFINE_ENDPOINTS.postapiScriptDefinegetscriptdefinitions, data, { params });
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ScriptDefinitionEntityPaginationQuery>
 */
export async function postapiScriptDefinesearchscriptdefinitions(data: SortType[], params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ScriptDefinitionEntityPaginationQuery> {
  const response = await axiosInstance.post<ScriptDefinitionEntityPaginationQuery>(SCRIPTDEFINE_ENDPOINTS.postapiScriptDefinesearchscriptdefinitions, data, { params });
  return response.data;
}

/**
 * @returns Promise<ScriptDefinitionEntityPaginationQuery>
 */
export async function postapiScriptDefinesearchscriptdefinebytype(): Promise<ScriptDefinitionEntityPaginationQuery> {
  const response = await axiosInstance.post<ScriptDefinitionEntityPaginationQuery>(SCRIPTDEFINE_ENDPOINTS.postapiScriptDefinesearchscriptdefinebytype);
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function putapiScriptDefineupdatescriptdefineid(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.put<BooleanResult>(`/api/ScriptDefine/update-script-define/${id}`, data);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function getapiScriptDefineupdateenablestateid(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.get<BooleanResult>(`/api/ScriptDefine/update-enable-state/${id}`);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiScriptDefineuploadpluginid(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/ScriptDefine/upload-plugin/${id}`);
  return response.data;
}
