import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  WorkCellEntity,
  WorkCellEntityResult,
  StringObjectKeyValuePair,
  WorkCellEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkCell Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * WorkCell API endpoints
 */
export const WORKCELL_ENDPOINTS = {
  getWorkCellById: '/api/workcell/{id}',
  getWorkCellPage: '/api/workcell/get-page',
  createWorkCell: '/api/workcell/create',
  updateWorkCell: '/api/workcell/update/{id}',
  deleteWorkCell: '/api/workcell/delete/{id}',
  generateNewWorkCellCode: '/api/workcell/generate-new-code',
} as const;

/**
 * Get Work Cell by ID
 *
 * Retrieves a specific Work Cell entity by its unique identifier.
 * @returns Promise<WorkCellEntity>
 */
export async function getWorkCellById(id: string): Promise<WorkCellEntity> {
  const response = await axiosInstance.get<WorkCellEntity>(`/api/workcell/${id}`);
  return response.data;
}

/**
 * Get paginated list of Work Cell
 *
 * Retrieves a paginated list of Work Cell entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WorkCellEntityBasePaginationResponse>
 */
export async function getWorkCellPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<WorkCellEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WorkCellEntityBasePaginationResponse>(
    WORKCELL_ENDPOINTS.getWorkCellPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Work Cell
 *
 * Creates a new Work Cell entity in the system.
 * @param data - Request body
 * @returns Promise<WorkCellEntityResult>
 */
export async function createWorkCell(data: WorkCellEntity): Promise<WorkCellEntityResult> {
  const response = await axiosInstance.post<WorkCellEntityResult>(
    WORKCELL_ENDPOINTS.createWorkCell,
    data
  );
  return response.data;
}

/**
 * Update an existing Work Cell
 *
 * Updates specific fields of an existing Work Cell entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWorkCell(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/workcell/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Work Cell
 *
 * Deletes a Work Cell entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWorkCell(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/workcell/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Work Cell
 *
 * Generates a new unique code for a Work Cell entity.
 * @returns Promise<string>
 */
export async function generateNewWorkCellCode(): Promise<string> {
  const response = await axiosInstance.get<string>(WORKCELL_ENDPOINTS.generateNewWorkCellCode);
  return response.data;
}
