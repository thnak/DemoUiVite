import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  CalendarExceptionEntity,
  StringObjectKeyValuePair,
  CalendarExceptionEntityResult,
  CalendarExceptionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// CalendarException Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * CalendarException API endpoints
 */
export const CALENDAREXCEPTION_ENDPOINTS = {
  getCalendarExceptionById: '/api/calendarexception/{id}',
  getCalendarExceptionPage: '/api/calendarexception/get-page',
  createCalendarException: '/api/calendarexception/create',
  updateCalendarException: '/api/calendarexception/update/{id}',
  deleteCalendarException: '/api/calendarexception/delete/{id}',
  generateNewCalendarExceptionCode: '/api/calendarexception/generate-new-code',
} as const;

/**
 * Get Calendar Exception by ID
 *
 * Retrieves a specific Calendar Exception entity by its unique identifier.
 * @returns Promise<CalendarExceptionEntity>
 */
export async function getCalendarExceptionById(id: string): Promise<CalendarExceptionEntity> {
  const response = await axiosInstance.get<CalendarExceptionEntity>(`/api/calendarexception/${id}`);
  return response.data;
}

/**
 * Get paginated list of Calendar Exception
 *
 * Retrieves a paginated list of Calendar Exception entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<CalendarExceptionEntityBasePaginationResponse>
 */
export async function getCalendarExceptionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<CalendarExceptionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<CalendarExceptionEntityBasePaginationResponse>(CALENDAREXCEPTION_ENDPOINTS.getCalendarExceptionPage, data, { params });
  return response.data;
}

/**
 * Create a new Calendar Exception
 *
 * Creates a new Calendar Exception entity in the system.
 * @param data - Request body
 * @returns Promise<CalendarExceptionEntityResult>
 */
export async function createCalendarException(data: CalendarExceptionEntity): Promise<CalendarExceptionEntityResult> {
  const response = await axiosInstance.post<CalendarExceptionEntityResult>(CALENDAREXCEPTION_ENDPOINTS.createCalendarException, data);
  return response.data;
}

/**
 * Update an existing Calendar Exception
 *
 * Updates specific fields of an existing Calendar Exception entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateCalendarException(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/calendarexception/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Calendar Exception
 *
 * Deletes a Calendar Exception entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteCalendarException(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/calendarexception/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Calendar Exception
 *
 * Generates a new unique code for a Calendar Exception entity.
 * @returns Promise<string>
 */
export async function generateNewCalendarExceptionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(CALENDAREXCEPTION_ENDPOINTS.generateNewCalendarExceptionCode);
  return response.data;
}
