import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createCalendar,
  deleteCalendar,
  updateCalendar,
  getCalendarById,
  getCalendarPage,
  generateNewCalendarCode,
} from '../../services/generated/calendar';

import type {
  SortType,
  BooleanResult,
  CalendarEntity,
  CalendarEntityResult,
  StringObjectKeyValuePair,
  CalendarEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Calendar Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Calendar
 */
export const calendarKeys = {
  all: ['calendar'] as const,
  getCalendarById: (id: string) => ['calendar', 'getCalendarById', id] as const,
  generateNewCalendarCode: ['calendar', 'generateNewCalendarCode'] as const,
};

/**
 * Get Calendar by ID
 */
export function useGetCalendarById(
  id: string,
  options?: Omit<UseQueryOptions<CalendarEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: calendarKeys.getCalendarById(id),
    queryFn: () => getCalendarById(id),
    ...options,
  });
}

/**
 * Generate a new code for Calendar
 */
export function useGenerateNewCalendarCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: calendarKeys.generateNewCalendarCode,
    queryFn: () => generateNewCalendarCode(),
    ...options,
  });
}

/**
 * Get paginated list of Calendar
 */
export function useGetCalendarPage(
  options?: Omit<UseMutationOptions<CalendarEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getCalendarPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Calendar
 */
export function useCreateCalendar(
  options?: Omit<UseMutationOptions<CalendarEntityResult, Error, { data: CalendarEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: CalendarEntity }) => createCalendar(variables.data),
    ...options,
  });
}

/**
 * Update an existing Calendar
 */
export function useUpdateCalendar(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateCalendar(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Calendar
 */
export function useDeleteCalendar(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteCalendar(variables.id),
    ...options,
  });
}
