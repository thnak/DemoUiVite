import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiChildWidgetgetid,
  postapiChildWidgetcreate,
  putapiChildWidgetdeleteid,
  postapiChildWidgetupdateid,
  postapiChildWidgetselectscriptid,
  getapiChildWidgetgetallfromparentparentId,
} from '../../services/generated/child-widget';

import type {
  BooleanResult,
  ChildWidgetConfigEntity,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ChildWidget Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ChildWidget
 */
export const childWidgetKeys = {
  all: ['childWidget'] as const,
  getapiChildWidgetgetid: (id: string) => ['childWidget', 'getapiChildWidgetgetid', id] as const,
  getapiChildWidgetgetallfromparentparentId: (parentId: string) => ['childWidget', 'getapiChildWidgetgetallfromparentparentId', parentId] as const,
};

/**
 */
export function useGetapiChildWidgetgetid(
  id: string,
  options?: Omit<UseQueryOptions<ChildWidgetConfigEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: childWidgetKeys.getapiChildWidgetgetid(id),
    queryFn: () => getapiChildWidgetgetid(id),
    ...options,
  });
}

/**
 */
export function useGetapiChildWidgetgetallfromparentparentId(
  parentId: string,
  options?: Omit<UseQueryOptions<ChildWidgetConfigEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: childWidgetKeys.getapiChildWidgetgetallfromparentparentId(parentId),
    queryFn: () => getapiChildWidgetgetallfromparentparentId(parentId),
    ...options,
  });
}

/**
 */
export function usePostapiChildWidgetcreate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: ChildWidgetConfigEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: ChildWidgetConfigEntity }) => postapiChildWidgetcreate(variables.data),
    ...options,
  });
}

/**
 */
export function usePutapiChildWidgetdeleteid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => putapiChildWidgetdeleteid(variables.id),
    ...options,
  });
}

/**
 */
export function usePostapiChildWidgetupdateid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => postapiChildWidgetupdateid(variables.id, variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiChildWidgetselectscriptid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => postapiChildWidgetselectscriptid(variables.id),
    ...options,
  });
}
