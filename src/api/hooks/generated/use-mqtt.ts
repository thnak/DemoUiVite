import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapiMqttgetclients,
  getapiMqttdisconnectclient,
  getapiMqttgettemplateanddocs,
} from '../../services/generated/mqtt';

import type {
  SortType,
  MqttControllerGetTemplateResponse,
  MqttControllerDisconnectClientRequest,
  MqttControllerGetClientsResponsePaginationQuery,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Mqtt Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Mqtt
 */
export const mqttKeys = {
  all: ['mqtt'] as const,
  getapiMqttgettemplateanddocs: ['mqtt', 'getapiMqttgettemplateanddocs'] as const,
};

/**
 */
export function useGetapiMqttgettemplateanddocs(
  options?: Omit<UseQueryOptions<MqttControllerGetTemplateResponse[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: mqttKeys.getapiMqttgettemplateanddocs,
    queryFn: () => getapiMqttgettemplateanddocs(),
    ...options,
  });
}

/**
 */
export function useGetapiMqttdisconnectclient(
  options?: Omit<UseMutationOptions<void, Error, { data: MqttControllerDisconnectClientRequest }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: MqttControllerDisconnectClientRequest }) => getapiMqttdisconnectclient(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiMqttgetclients(
  options?: Omit<UseMutationOptions<MqttControllerGetClientsResponsePaginationQuery, Error, { data: SortType[]; params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiMqttgetclients(variables.data, variables.params),
    ...options,
  });
}
