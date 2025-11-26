import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  SystemErrorReportEntity,
  StringObjectKeyValuePair,
  SystemErrorReportEntityResult,
  SystemErrorReportEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemErrorReport Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * SystemErrorReport API endpoints
 */
export const SYSTEMERRORREPORT_ENDPOINTS = {
  getSystemErrorReportById: '/api/systemerrorreport/{id}',
  getSystemErrorReportPage: '/api/systemerrorreport/get-page',
  createSystemErrorReport: '/api/systemerrorreport/create',
  updateSystemErrorReport: '/api/systemerrorreport/update/{id}',
  deleteSystemErrorReport: '/api/systemerrorreport/delete/{id}',
  generateNewSystemErrorReportCode: '/api/systemerrorreport/generate-new-code',
} as const;

/**
 * Get System Error Report by ID
 *
 * Retrieves a specific System Error Report entity by its unique identifier.
 * @returns Promise<SystemErrorReportEntity>
 */
export async function getSystemErrorReportById(id: string): Promise<SystemErrorReportEntity> {
  const response = await axiosInstance.get<SystemErrorReportEntity>(`/api/systemerrorreport/${id}`);
  return response.data;
}

/**
 * Get paginated list of System Error Report
 *
 * Retrieves a paginated list of System Error Report entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SystemErrorReportEntityBasePaginationResponse>
 */
export async function getSystemErrorReportPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<SystemErrorReportEntityBasePaginationResponse> {
  const response = await axiosInstance.post<SystemErrorReportEntityBasePaginationResponse>(
    SYSTEMERRORREPORT_ENDPOINTS.getSystemErrorReportPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new System Error Report
 *
 * Creates a new System Error Report entity in the system.
 * @param data - Request body
 * @returns Promise<SystemErrorReportEntityResult>
 */
export async function createSystemErrorReport(
  data: SystemErrorReportEntity
): Promise<SystemErrorReportEntityResult> {
  const response = await axiosInstance.post<SystemErrorReportEntityResult>(
    SYSTEMERRORREPORT_ENDPOINTS.createSystemErrorReport,
    data
  );
  return response.data;
}

/**
 * Update an existing System Error Report
 *
 * Updates specific fields of an existing System Error Report entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateSystemErrorReport(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/systemerrorreport/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a System Error Report
 *
 * Deletes a System Error Report entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteSystemErrorReport(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/systemerrorreport/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for System Error Report
 *
 * Generates a new unique code for a System Error Report entity.
 * @returns Promise<string>
 */
export async function generateNewSystemErrorReportCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    SYSTEMERRORREPORT_ENDPOINTS.generateNewSystemErrorReportCode
  );
  return response.data;
}
