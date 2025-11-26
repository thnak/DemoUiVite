import axiosInstance from '../../axios-instance';

import type { SortType } from '../../types/generated';

// ----------------------------------------------------------------------
// Sensor Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Sensor API endpoints
 */
export const SENSOR_ENDPOINTS = {
  postapiSensorgetdevicesensors: '/api/Sensor/get-device-sensors',
} as const;

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<void>
 */
export async function postapiSensorgetdevicesensors(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<void> {
  await axiosInstance.post(SENSOR_ENDPOINTS.postapiSensorgetdevicesensors, data, { params });
}
