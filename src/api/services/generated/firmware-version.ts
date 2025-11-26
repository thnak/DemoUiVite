import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  FirmwareVersionEntity,
  FirmwareVersionEntityBasePaginationResponse,
  FirmwareVersionEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FirmwareVersion Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FirmwareVersion API endpoints
 */
export const FIRMWAREVERSION_ENDPOINTS = {
  getFirmwareVersionById: '/api/firmwareversion/{id}',
  getFirmwareVersionPage: '/api/firmwareversion/get-page',
  createFirmwareVersion: '/api/firmwareversion/create',
  updateFirmwareVersion: '/api/firmwareversion/update/{id}',
  deleteFirmwareVersion: '/api/firmwareversion/delete/{id}',
  generateNewFirmwareVersionCode: '/api/firmwareversion/generate-new-code',
} as const;

/**
 * Get Firmware Version by ID
 *
 * Retrieves a specific Firmware Version entity by its unique identifier.
 * @returns Promise<FirmwareVersionEntity>
 */
export async function getFirmwareVersionById(id: string): Promise<FirmwareVersionEntity> {
  const response = await axiosInstance.get<FirmwareVersionEntity>(`/api/firmwareversion/${id}`);
  return response.data;
}

/**
 * Get paginated list of Firmware Version
 *
 * Retrieves a paginated list of Firmware Version entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FirmwareVersionEntityBasePaginationResponse>
 */
export async function getFirmwareVersionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<FirmwareVersionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FirmwareVersionEntityBasePaginationResponse>(FIRMWAREVERSION_ENDPOINTS.getFirmwareVersionPage, data, { params });
  return response.data;
}

/**
 * Create a new Firmware Version
 *
 * Creates a new Firmware Version entity in the system.
 * @param data - Request body
 * @returns Promise<FirmwareVersionEntityResult>
 */
export async function createFirmwareVersion(data: FirmwareVersionEntity): Promise<FirmwareVersionEntityResult> {
  const response = await axiosInstance.post<FirmwareVersionEntityResult>(FIRMWAREVERSION_ENDPOINTS.createFirmwareVersion, data);
  return response.data;
}

/**
 * Update an existing Firmware Version
 *
 * Updates specific fields of an existing Firmware Version entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFirmwareVersion(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/firmwareversion/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Firmware Version
 *
 * Deletes a Firmware Version entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFirmwareVersion(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/firmwareversion/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Firmware Version
 *
 * Generates a new unique code for a Firmware Version entity.
 * @returns Promise<string>
 */
export async function generateNewFirmwareVersionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FIRMWAREVERSION_ENDPOINTS.generateNewFirmwareVersionCode);
  return response.data;
}
