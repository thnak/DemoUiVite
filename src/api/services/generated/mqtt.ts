import axiosInstance from '../../axios-instance';

import type {
  MqttControllerDisconnectClientRequest,
  MqttControllerGetClientsResponsePaginationQuery,
  MqttControllerGetTemplateResponse,
  SortType,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Mqtt Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Mqtt API endpoints
 */
export const MQTT_ENDPOINTS = {
  getapiMqttdisconnectclient: '/api/Mqtt/disconnect-client',
  postapiMqttgetclients: '/api/Mqtt/get-clients',
  getapiMqttgettemplateanddocs: '/api/Mqtt/get-template-and-docs',
} as const;

/**
 * @param data - Request body
 * @returns Promise<void>
 */
export async function getapiMqttdisconnectclient(data: MqttControllerDisconnectClientRequest): Promise<void> {
  await axiosInstance.get(MQTT_ENDPOINTS.getapiMqttdisconnectclient, { data });
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MqttControllerGetClientsResponsePaginationQuery>
 */
export async function postapiMqttgetclients(data: SortType[], params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<MqttControllerGetClientsResponsePaginationQuery> {
  const response = await axiosInstance.post<MqttControllerGetClientsResponsePaginationQuery>(MQTT_ENDPOINTS.postapiMqttgetclients, data, { params });
  return response.data;
}

/**
 * @returns Promise<MqttControllerGetTemplateResponse[]>
 */
export async function getapiMqttgettemplateanddocs(): Promise<MqttControllerGetTemplateResponse[]> {
  const response = await axiosInstance.get<MqttControllerGetTemplateResponse[]>(MQTT_ENDPOINTS.getapiMqttgettemplateanddocs);
  return response.data;
}
