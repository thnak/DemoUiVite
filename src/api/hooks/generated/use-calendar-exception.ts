import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createCalendarException,
  deleteCalendarException,
  generateNewCalendarExceptionCode,
  getCalendarExceptionById,
  getCalendarExceptionPage,
  updateCalendarException,
} from '../../services/generated/calendar-exception';

import type {
  BooleanResult,
  CalendarExceptionEntity,
  CalendarExceptionEntityBasePaginationResponse,
  CalendarExceptionEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// CalendarException Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for CalendarException
 */
export const calendarExceptionKeys = {
  all: ['calendarException'] as const,
  getCalendarExceptionById: (id: string) => ['calendarException', 'getCalendarExceptionById', id] as const,
  generateNewCalendarExceptionCode: ['calendarException', 'generateNewCalendarExceptionCode'] as const,
};

/**
 * Get Calendar Exception by ID
 */
export function useGetCalendarExceptionById(
  id: string,
  options?: Omit<UseQueryOptions<CalendarExceptionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: calendarExceptionKeys.getCalendarExceptionById(id),
    queryFn: () => getCalendarExceptionById(id),
    ...options,
  });
}

/**
 * Generate a new code for Calendar Exception
 */
export function useGenerateNewCalendarExceptionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: calendarExceptionKeys.generateNewCalendarExceptionCode,
    queryFn: () => generateNewCalendarExceptionCode(),
    ...options,
  });
}

/**
 * Get paginated list of Calendar Exception
 */
export function useGetCalendarExceptionPage(
  options?: Omit<UseMutationOptions<CalendarExceptionEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getCalendarExceptionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Calendar Exception
 */
export function useCreateCalendarException(
  options?: Omit<UseMutationOptions<CalendarExceptionEntityResult, Error, { data: CalendarExceptionEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: CalendarExceptionEntity }) => createCalendarException(variables.data),
    ...options,
  });
}

/**
 * Update an existing Calendar Exception
 */
export function useUpdateCalendarException(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateCalendarException(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Calendar Exception
 */
export function useDeleteCalendarException(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteCalendarException(variables.id),
    ...options,
  });
}
