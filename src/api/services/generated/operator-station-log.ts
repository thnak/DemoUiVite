import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  OperatorStationLogEntity,
  StringObjectKeyValuePair,
  OperatorStationLogEntityResult,
  OperatorStationLogEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OperatorStationLog Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * OperatorStationLog API endpoints
 */
export const OPERATORSTATIONLOG_ENDPOINTS = {
  getOperatorStationLogById: '/api/operatorstationlog/{id}',
  getOperatorStationLogPage: '/api/operatorstationlog/get-page',
  createOperatorStationLog: '/api/operatorstationlog/create',
  updateOperatorStationLog: '/api/operatorstationlog/update/{id}',
  deleteOperatorStationLog: '/api/operatorstationlog/delete/{id}',
  generateNewOperatorStationLogCode: '/api/operatorstationlog/generate-new-code',
} as const;

/**
 * Get Operator Station Log by ID
 *
 * Retrieves a specific Operator Station Log entity by its unique identifier.
 * @returns Promise<OperatorStationLogEntity>
 */
export async function getOperatorStationLogById(id: string): Promise<OperatorStationLogEntity> {
  const response = await axiosInstance.get<OperatorStationLogEntity>(`/api/operatorstationlog/${id}`);
  return response.data;
}

/**
 * Get paginated list of Operator Station Log
 *
 * Retrieves a paginated list of Operator Station Log entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<OperatorStationLogEntityBasePaginationResponse>
 */
export async function getOperatorStationLogPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<OperatorStationLogEntityBasePaginationResponse> {
  const response = await axiosInstance.post<OperatorStationLogEntityBasePaginationResponse>(OPERATORSTATIONLOG_ENDPOINTS.getOperatorStationLogPage, data, { params });
  return response.data;
}

/**
 * Create a new Operator Station Log
 *
 * Creates a new Operator Station Log entity in the system.
 * @param data - Request body
 * @returns Promise<OperatorStationLogEntityResult>
 */
export async function createOperatorStationLog(data: OperatorStationLogEntity): Promise<OperatorStationLogEntityResult> {
  const response = await axiosInstance.post<OperatorStationLogEntityResult>(OPERATORSTATIONLOG_ENDPOINTS.createOperatorStationLog, data);
  return response.data;
}

/**
 * Update an existing Operator Station Log
 *
 * Updates specific fields of an existing Operator Station Log entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateOperatorStationLog(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/operatorstationlog/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Operator Station Log
 *
 * Deletes a Operator Station Log entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteOperatorStationLog(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/operatorstationlog/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Operator Station Log
 *
 * Generates a new unique code for a Operator Station Log entity.
 * @returns Promise<string>
 */
export async function generateNewOperatorStationLogCode(): Promise<string> {
  const response = await axiosInstance.get<string>(OPERATORSTATIONLOG_ENDPOINTS.generateNewOperatorStationLogCode);
  return response.data;
}
