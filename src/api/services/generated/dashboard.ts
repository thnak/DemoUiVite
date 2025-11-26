import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  WidgetConfigEntity,
  DashboardCombineDto,
  SelectScriptRequest,
  DashboardTemplateEntity,
  StringObjectKeyValuePair,
  DashboardCombineDtoResult,
  ScriptVariantEntityResult,
  ScriptDefinitionEntityResult,
  WidgetConfigEntityPaginationQuery,
  DashboardTemplateEntityPaginationQuery,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Dashboard Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Dashboard API endpoints
 */
export const DASHBOARD_ENDPOINTS = {
  postapiDashboarddeletedashboard: '/api/Dashboard/delete-dashboard',
  postapiDashboarddeletewidget: '/api/Dashboard/delete-widget',
  postapiDashboardgettemplate: '/api/Dashboard/get-template',
  getapiDashboardgetwidgettemplateId: '/api/Dashboard/get-widget/{templateId}',
  getapiDashboardgetdashboardcombine: '/api/Dashboard/get-dashboard-combine',
  getapiDashboardsearchdashboard: '/api/Dashboard/search-dashboard',
  getapiDashboardgetscriptdefinebywidgetidwidgetId:
    '/api/Dashboard/get-script-define-by-widget-id/{widgetId}',
  getapiDashboardgetscriptvariantbywidgetidwidgetId:
    '/api/Dashboard/get-script-variant-by-widget-id/{widgetId}',
  postapiDashboardupdatetemplateid: '/api/Dashboard/update-template/{id}',
  postapiDashboardupdatewidget: '/api/Dashboard/update-widget',
  postapiDashboardupdatecombinecontenttemplateId:
    '/api/Dashboard/update-combine-content/{templateId}',
  postapiDashboardselectscriptwidgetId: '/api/Dashboard/select-script/{widgetId}',
  postapiDashboardcreate: '/api/Dashboard/create',
  postapiDashboardcreatewidgetdashboard: '/api/Dashboard/create-widget/{dashboard}',
} as const;

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboarddeletedashboard(params?: {
  query?: string;
}): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    DASHBOARD_ENDPOINTS.postapiDashboarddeletedashboard,
    null,
    { params }
  );
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboarddeletewidget(params?: {
  query?: string;
}): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    DASHBOARD_ENDPOINTS.postapiDashboarddeletewidget,
    null,
    { params }
  );
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DashboardTemplateEntityPaginationQuery>
 */
export async function postapiDashboardgettemplate(
  data: SortType[],
  params?: {
    search?: string;
    fromTime?: string;
    toTime?: string;
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }
): Promise<DashboardTemplateEntityPaginationQuery> {
  const response = await axiosInstance.post<DashboardTemplateEntityPaginationQuery>(
    DASHBOARD_ENDPOINTS.postapiDashboardgettemplate,
    data,
    { params }
  );
  return response.data;
}

/**
 * @returns Promise<WidgetConfigEntityPaginationQuery>
 */
export async function getapiDashboardgetwidgettemplateId(
  templateId: string
): Promise<WidgetConfigEntityPaginationQuery> {
  const response = await axiosInstance.get<WidgetConfigEntityPaginationQuery>(
    `/api/Dashboard/get-widget/${templateId}`
  );
  return response.data;
}

/**
 * @returns Promise<DashboardCombineDtoResult>
 */
export async function getapiDashboardgetdashboardcombine(params?: {
  id?: string;
}): Promise<DashboardCombineDtoResult> {
  const response = await axiosInstance.get<DashboardCombineDtoResult>(
    DASHBOARD_ENDPOINTS.getapiDashboardgetdashboardcombine,
    { params }
  );
  return response.data;
}

/**
 * @returns Promise<DashboardTemplateEntity[]>
 */
export async function getapiDashboardsearchdashboard(params?: {
  query?: string;
  limit?: number;
}): Promise<DashboardTemplateEntity[]> {
  const response = await axiosInstance.get<DashboardTemplateEntity[]>(
    DASHBOARD_ENDPOINTS.getapiDashboardsearchdashboard,
    { params }
  );
  return response.data;
}

/**
 * @returns Promise<ScriptDefinitionEntityResult>
 */
export async function getapiDashboardgetscriptdefinebywidgetidwidgetId(
  widgetId: string
): Promise<ScriptDefinitionEntityResult> {
  const response = await axiosInstance.get<ScriptDefinitionEntityResult>(
    `/api/Dashboard/get-script-define-by-widget-id/${widgetId}`
  );
  return response.data;
}

/**
 * @returns Promise<ScriptVariantEntityResult>
 */
export async function getapiDashboardgetscriptvariantbywidgetidwidgetId(
  widgetId: string
): Promise<ScriptVariantEntityResult> {
  const response = await axiosInstance.get<ScriptVariantEntityResult>(
    `/api/Dashboard/get-script-variant-by-widget-id/${widgetId}`
  );
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboardupdatetemplateid(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/Dashboard/update-template/${id}`,
    data
  );
  return response.data;
}

/**
 * @param WidgetId - The ID of the widget to be updated
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboardupdatewidget(
  data: StringObjectKeyValuePair[],
  params?: { WidgetId?: string }
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    DASHBOARD_ENDPOINTS.postapiDashboardupdatewidget,
    data,
    { params }
  );
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboardupdatecombinecontenttemplateId(
  templateId: string,
  data: DashboardCombineDto
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/Dashboard/update-combine-content/${templateId}`,
    data
  );
  return response.data;
}

/**
 * @param widgetId - The ID of the widget to be updated
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboardselectscriptwidgetId(
  widgetId: string,
  data: SelectScriptRequest
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/Dashboard/select-script/${widgetId}`,
    data
  );
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboardcreate(
  data: DashboardTemplateEntity
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    DASHBOARD_ENDPOINTS.postapiDashboardcreate,
    data
  );
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDashboardcreatewidgetdashboard(
  dashboard: string,
  data: WidgetConfigEntity
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/Dashboard/create-widget/${dashboard}`,
    data
  );
  return response.data;
}
