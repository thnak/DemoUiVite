import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiDashboardcreate,
  postapiDashboardgettemplate,
  postapiDashboarddeletewidget,
  postapiDashboardupdatewidget,
  getapiDashboardsearchdashboard,
  postapiDashboarddeletedashboard,
  postapiDashboardupdatetemplateid,
  getapiDashboardgetdashboardcombine,
  getapiDashboardgetwidgettemplateId,
  postapiDashboardselectscriptwidgetId,
  postapiDashboardcreatewidgetdashboard,
  postapiDashboardupdatecombinecontenttemplateId,
  getapiDashboardgetscriptdefinebywidgetidwidgetId,
  getapiDashboardgetscriptvariantbywidgetidwidgetId,
} from '../../services/generated/dashboard';

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
// Dashboard Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Dashboard
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  getapiDashboardgetwidgettemplateId: (templateId: string) => ['dashboard', 'getapiDashboardgetwidgettemplateId', templateId] as const,
  getapiDashboardgetdashboardcombine: ['dashboard', 'getapiDashboardgetdashboardcombine'] as const,
  getapiDashboardsearchdashboard: ['dashboard', 'getapiDashboardsearchdashboard'] as const,
  getapiDashboardgetscriptdefinebywidgetidwidgetId: (widgetId: string) => ['dashboard', 'getapiDashboardgetscriptdefinebywidgetidwidgetId', widgetId] as const,
  getapiDashboardgetscriptvariantbywidgetidwidgetId: (widgetId: string) => ['dashboard', 'getapiDashboardgetscriptvariantbywidgetidwidgetId', widgetId] as const,
};

/**
 */
export function useGetapiDashboardgetwidgettemplateId(
  templateId: string,
  options?: Omit<UseQueryOptions<WidgetConfigEntityPaginationQuery, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.getapiDashboardgetwidgettemplateId(templateId),
    queryFn: () => getapiDashboardgetwidgettemplateId(templateId),
    ...options,
  });
}

/**
 */
export function useGetapiDashboardgetdashboardcombine(
  params?: { id?: string },
  options?: Omit<UseQueryOptions<DashboardCombineDtoResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.getapiDashboardgetdashboardcombine,
    queryFn: () => getapiDashboardgetdashboardcombine(params),
    ...options,
  });
}

/**
 */
export function useGetapiDashboardsearchdashboard(
  params?: { query?: string; limit?: number },
  options?: Omit<UseQueryOptions<DashboardTemplateEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.getapiDashboardsearchdashboard,
    queryFn: () => getapiDashboardsearchdashboard(params),
    ...options,
  });
}

/**
 */
export function useGetapiDashboardgetscriptdefinebywidgetidwidgetId(
  widgetId: string,
  options?: Omit<UseQueryOptions<ScriptDefinitionEntityResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.getapiDashboardgetscriptdefinebywidgetidwidgetId(widgetId),
    queryFn: () => getapiDashboardgetscriptdefinebywidgetidwidgetId(widgetId),
    ...options,
  });
}

/**
 */
export function useGetapiDashboardgetscriptvariantbywidgetidwidgetId(
  widgetId: string,
  options?: Omit<UseQueryOptions<ScriptVariantEntityResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.getapiDashboardgetscriptvariantbywidgetidwidgetId(widgetId),
    queryFn: () => getapiDashboardgetscriptvariantbywidgetidwidgetId(widgetId),
    ...options,
  });
}

/**
 */
export function usePostapiDashboarddeletedashboard(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { params?: { query?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { query?: string } }) => postapiDashboarddeletedashboard(variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDashboarddeletewidget(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { params?: { query?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { query?: string } }) => postapiDashboarddeletewidget(variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardgettemplate(
  options?: Omit<UseMutationOptions<DashboardTemplateEntityPaginationQuery, Error, { data: SortType[]; params?: { search?: string; fromTime?: string; toTime?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { search?: string; fromTime?: string; toTime?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiDashboardgettemplate(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardupdatetemplateid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => postapiDashboardupdatetemplateid(variables.id, variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardupdatewidget(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: StringObjectKeyValuePair[]; params?: { WidgetId?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: StringObjectKeyValuePair[]; params?: { WidgetId?: string } }) => postapiDashboardupdatewidget(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardupdatecombinecontenttemplateId(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { templateId: string; data: DashboardCombineDto }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { templateId: string; data: DashboardCombineDto }) => postapiDashboardupdatecombinecontenttemplateId(variables.templateId, variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardselectscriptwidgetId(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { widgetId: string; data: SelectScriptRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { widgetId: string; data: SelectScriptRequest }) => postapiDashboardselectscriptwidgetId(variables.widgetId, variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardcreate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: DashboardTemplateEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DashboardTemplateEntity }) => postapiDashboardcreate(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDashboardcreatewidgetdashboard(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { dashboard: string; data: WidgetConfigEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { dashboard: string; data: WidgetConfigEntity }) => postapiDashboardcreatewidgetdashboard(variables.dashboard, variables.data),
    ...options,
  });
}
