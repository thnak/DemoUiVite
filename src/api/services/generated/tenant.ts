import axiosInstance from '../../axios-instance';

import type { SortType, UpdateTenantRequest, CreateNewTenantRequest } from '../../types/generated';

// ----------------------------------------------------------------------
// Tenant Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Tenant API endpoints
 */
export const TENANT_ENDPOINTS = {
  postapiTenantcreate: '/api/Tenant/create',
  deleteapiTenantdeleteid: '/api/Tenant/delete/{id}',
  postapiTenantgetalltenants: '/api/Tenant/get-all-tenants',
  putapiTenantupdate: '/api/Tenant/update',
} as const;

/**
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiTenantcreate(data: CreateNewTenantRequest): Promise<void> {
  await axiosInstance.post(TENANT_ENDPOINTS.postapiTenantcreate, data);
}

/**
 * @returns Promise<void>
 */
export async function deleteapiTenantdeleteid(id: string): Promise<void> {
  await axiosInstance.delete(`/api/Tenant/delete/${id}`);
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiTenantgetalltenants(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<void> {
  await axiosInstance.post(TENANT_ENDPOINTS.postapiTenantgetalltenants, data, { params });
}

/**
 * @param data - Request body
 * @returns Promise<void>
 */
export async function putapiTenantupdate(data: UpdateTenantRequest): Promise<void> {
  await axiosInstance.put(TENANT_ENDPOINTS.putapiTenantupdate, data);
}
