import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  CalendarEntity,
  CalendarEntityResult,
  StringObjectKeyValuePair,
  CalendarEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Calendar Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Calendar API endpoints
 */
export const CALENDAR_ENDPOINTS = {
  getCalendarById: '/api/calendar/{id}',
  getCalendarPage: '/api/calendar/get-page',
  createCalendar: '/api/calendar/create',
  updateCalendar: '/api/calendar/update/{id}',
  deleteCalendar: '/api/calendar/delete/{id}',
  generateNewCalendarCode: '/api/calendar/generate-new-code',
} as const;

/**
 * Get Calendar by ID
 *
 * Retrieves a specific Calendar entity by its unique identifier.
 * @returns Promise<CalendarEntity>
 */
export async function getCalendarById(id: string): Promise<CalendarEntity> {
  const response = await axiosInstance.get<CalendarEntity>(`/api/calendar/${id}`);
  return response.data;
}

/**
 * Get paginated list of Calendar
 *
 * Retrieves a paginated list of Calendar entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<CalendarEntityBasePaginationResponse>
 */
export async function getCalendarPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<CalendarEntityBasePaginationResponse> {
  const response = await axiosInstance.post<CalendarEntityBasePaginationResponse>(
    CALENDAR_ENDPOINTS.getCalendarPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Calendar
 *
 * Creates a new Calendar entity in the system.
 * @param data - Request body
 * @returns Promise<CalendarEntityResult>
 */
export async function createCalendar(data: CalendarEntity): Promise<CalendarEntityResult> {
  const response = await axiosInstance.post<CalendarEntityResult>(
    CALENDAR_ENDPOINTS.createCalendar,
    data
  );
  return response.data;
}

/**
 * Update an existing Calendar
 *
 * Updates specific fields of an existing Calendar entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateCalendar(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/calendar/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Calendar
 *
 * Deletes a Calendar entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteCalendar(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/calendar/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Calendar
 *
 * Generates a new unique code for a Calendar entity.
 * @returns Promise<string>
 */
export async function generateNewCalendarCode(): Promise<string> {
  const response = await axiosInstance.get<string>(CALENDAR_ENDPOINTS.generateNewCalendarCode);
  return response.data;
}
