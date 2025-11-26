import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ChildWidgetConfigEntity,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ChildWidget Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ChildWidget API endpoints
 */
export const CHILDWIDGET_ENDPOINTS = {
  postapiChildWidgetcreate: '/api/ChildWidget/create',
  putapiChildWidgetdeleteid: '/api/ChildWidget/delete/{id}',
  getapiChildWidgetgetid: '/api/ChildWidget/get/{id}',
  getapiChildWidgetgetallfromparentparentId: '/api/ChildWidget/get-all-from-parent/{parentId}',
  postapiChildWidgetupdateid: '/api/ChildWidget/update/{id}',
  postapiChildWidgetselectscriptid: '/api/ChildWidget/select-script/{id}',
} as const;

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiChildWidgetcreate(data: ChildWidgetConfigEntity): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(CHILDWIDGET_ENDPOINTS.postapiChildWidgetcreate, data);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function putapiChildWidgetdeleteid(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.put<BooleanResult>(`/api/ChildWidget/delete/${id}`);
  return response.data;
}

/**
 * @returns Promise<ChildWidgetConfigEntity>
 */
export async function getapiChildWidgetgetid(id: string): Promise<ChildWidgetConfigEntity> {
  const response = await axiosInstance.get<ChildWidgetConfigEntity>(`/api/ChildWidget/get/${id}`);
  return response.data;
}

/**
 * @returns Promise<ChildWidgetConfigEntity[]>
 */
export async function getapiChildWidgetgetallfromparentparentId(parentId: string): Promise<ChildWidgetConfigEntity[]> {
  const response = await axiosInstance.get<ChildWidgetConfigEntity[]>(`/api/ChildWidget/get-all-from-parent/${parentId}`);
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiChildWidgetupdateid(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/ChildWidget/update/${id}`, data);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiChildWidgetselectscriptid(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/ChildWidget/select-script/${id}`);
  return response.data;
}
