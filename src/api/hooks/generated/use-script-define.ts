import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiScriptDefinecreate,
  postapiScriptDefinetryrunscript,
  postapiScriptDefineuploadpluginid,
  getapiScriptDefineupdateenablestateid,
  putapiScriptDefineupdatescriptdefineid,
  getapiScriptDefinegetscriptdefinitionid,
  postapiScriptDefinegetscriptdefinitions,
  postapiScriptDefinerecheckscriptdefineid,
  putapiScriptDefinedeletescriptdefinename,
  postapiScriptDefinesearchscriptdefinitions,
  postapiScriptDefinesearchscriptdefinebytype,
  postapiScriptDefinetryrunscriptvariantscriptId,
} from '../../services/generated/script-define';

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
// ScriptDefine Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ScriptDefine
 */
export const scriptDefineKeys = {
  all: ['scriptDefine'] as const,
  getapiScriptDefinegetscriptdefinitionid: (id: string) =>
    ['scriptDefine', 'getapiScriptDefinegetscriptdefinitionid', id] as const,
  getapiScriptDefineupdateenablestateid: (id: string) =>
    ['scriptDefine', 'getapiScriptDefineupdateenablestateid', id] as const,
};

/**
 */
export function useGetapiScriptDefinegetscriptdefinitionid(
  id: string,
  options?: Omit<UseQueryOptions<ScriptDefinitionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptDefineKeys.getapiScriptDefinegetscriptdefinitionid(id),
    queryFn: () => getapiScriptDefinegetscriptdefinitionid(id),
    ...options,
  });
}

/**
 */
export function useGetapiScriptDefineupdateenablestateid(
  id: string,
  options?: Omit<UseQueryOptions<BooleanResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptDefineKeys.getapiScriptDefineupdateenablestateid(id),
    queryFn: () => getapiScriptDefineupdateenablestateid(id),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinecreate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: CreateRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: CreateRequest }) => postapiScriptDefinecreate(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinerecheckscriptdefineid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) =>
      postapiScriptDefinerecheckscriptdefineid(variables.id),
    ...options,
  });
}

/**
 */
export function usePutapiScriptDefinedeletescriptdefinename(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { name: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { name: string }) =>
      putapiScriptDefinedeletescriptdefinename(variables.name),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinetryrunscript(
  options?: Omit<
    UseMutationOptions<ObjectResult, Error, { data: TryRunMetricRequest }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: TryRunMetricRequest }) =>
      postapiScriptDefinetryrunscript(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinetryrunscriptvariantscriptId(
  options?: Omit<
    UseMutationOptions<ObjectResult, Error, { scriptId: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { scriptId: string; data: StringObjectKeyValuePair[] }) =>
      postapiScriptDefinetryrunscriptvariantscriptId(variables.scriptId, variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinegetscriptdefinitions(
  options?: Omit<
    UseMutationOptions<
      ScriptDefinitionEntityPaginationQuery,
      Error,
      {
        data: SortType[];
        params?: {
          search?: string;
          fromTime?: string;
          toTime?: string;
          pageNumber?: number;
          pageSize?: number;
          searchTerm?: string;
        };
      }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: {
      data: SortType[];
      params?: {
        search?: string;
        fromTime?: string;
        toTime?: string;
        pageNumber?: number;
        pageSize?: number;
        searchTerm?: string;
      };
    }) => postapiScriptDefinegetscriptdefinitions(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinesearchscriptdefinitions(
  options?: Omit<
    UseMutationOptions<
      ScriptDefinitionEntityPaginationQuery,
      Error,
      {
        data: SortType[];
        params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string };
      }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: {
      data: SortType[];
      params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string };
    }) => postapiScriptDefinesearchscriptdefinitions(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefinesearchscriptdefinebytype(
  options?: Omit<
    UseMutationOptions<ScriptDefinitionEntityPaginationQuery, Error, void>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: postapiScriptDefinesearchscriptdefinebytype,
    ...options,
  });
}

/**
 */
export function usePutapiScriptDefineupdatescriptdefineid(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      putapiScriptDefineupdatescriptdefineid(variables.id, variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiScriptDefineuploadpluginid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => postapiScriptDefineuploadpluginid(variables.id),
    ...options,
  });
}
