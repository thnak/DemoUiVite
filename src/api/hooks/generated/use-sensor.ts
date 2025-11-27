import type { UseMutationOptions } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import {
  postapiSensorgetdevicesensors,
} from '../../services/generated/sensor';

import type {
  SortType,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Sensor Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Sensor
 */
export const sensorKeys = {
  all: ['sensor'] as const,
};

/**
 */
export function usePostapiSensorgetdevicesensors(
  options?: Omit<UseMutationOptions<void, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiSensorgetdevicesensors(variables.data, variables.params),
    ...options,
  });
}
