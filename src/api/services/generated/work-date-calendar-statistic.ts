import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  WorkDateCalendarStatisticEntity,
  WorkDateCalendarStatisticEntityResult,
  WorkDateCalendarStatisticEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkDateCalendarStatistic Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * WorkDateCalendarStatistic API endpoints
 */
export const WORKDATECALENDARSTATISTIC_ENDPOINTS = {
  getWorkDateCalendarStatisticById: '/api/workdatecalendarstatistic/{id}',
  getWorkDateCalendarStatisticPage: '/api/workdatecalendarstatistic/get-page',
  createWorkDateCalendarStatistic: '/api/workdatecalendarstatistic/create',
  updateWorkDateCalendarStatistic: '/api/workdatecalendarstatistic/update/{id}',
  deleteWorkDateCalendarStatistic: '/api/workdatecalendarstatistic/delete/{id}',
  generateNewWorkDateCalendarStatisticCode: '/api/workdatecalendarstatistic/generate-new-code',
} as const;

/**
 * Get Work Date Calendar Statistic by ID
 *
 * Retrieves a specific Work Date Calendar Statistic entity by its unique identifier.
 * @returns Promise<WorkDateCalendarStatisticEntity>
 */
export async function getWorkDateCalendarStatisticById(
  id: string
): Promise<WorkDateCalendarStatisticEntity> {
  const response = await axiosInstance.get<WorkDateCalendarStatisticEntity>(
    `/api/workdatecalendarstatistic/${id}`
  );
  return response.data;
}

/**
 * Get paginated list of Work Date Calendar Statistic
 *
 * Retrieves a paginated list of Work Date Calendar Statistic entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WorkDateCalendarStatisticEntityBasePaginationResponse>
 */
export async function getWorkDateCalendarStatisticPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<WorkDateCalendarStatisticEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WorkDateCalendarStatisticEntityBasePaginationResponse>(
    WORKDATECALENDARSTATISTIC_ENDPOINTS.getWorkDateCalendarStatisticPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Work Date Calendar Statistic
 *
 * Creates a new Work Date Calendar Statistic entity in the system.
 * @param data - Request body
 * @returns Promise<WorkDateCalendarStatisticEntityResult>
 */
export async function createWorkDateCalendarStatistic(
  data: WorkDateCalendarStatisticEntity
): Promise<WorkDateCalendarStatisticEntityResult> {
  const response = await axiosInstance.post<WorkDateCalendarStatisticEntityResult>(
    WORKDATECALENDARSTATISTIC_ENDPOINTS.createWorkDateCalendarStatistic,
    data
  );
  return response.data;
}

/**
 * Update an existing Work Date Calendar Statistic
 *
 * Updates specific fields of an existing Work Date Calendar Statistic entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWorkDateCalendarStatistic(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/workdatecalendarstatistic/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Work Date Calendar Statistic
 *
 * Deletes a Work Date Calendar Statistic entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWorkDateCalendarStatistic(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(
    `/api/workdatecalendarstatistic/delete/${id}`
  );
  return response.data;
}

/**
 * Generate a new code for Work Date Calendar Statistic
 *
 * Generates a new unique code for a Work Date Calendar Statistic entity.
 * @returns Promise<string>
 */
export async function generateNewWorkDateCalendarStatisticCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    WORKDATECALENDARSTATISTIC_ENDPOINTS.generateNewWorkDateCalendarStatisticCode
  );
  return response.data;
}
