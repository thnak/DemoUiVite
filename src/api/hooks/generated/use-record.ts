import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiRecordsumvalue,
  postapiRecordgetrecords,
  postapiRecordcreateanonymous,
} from '../../services/generated/record';

import type {
  ObjectId,
  SortType,
  BooleanResult,
  IoTSensorType,
  IotRecordModel,
  GetRecordResponsePaginationQuery,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Record Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Record
 */
export const recordKeys = {
  all: ['record'] as const,
  getapiRecordsumvalue: ['record', 'getapiRecordsumvalue'] as const,
};

/**
 */
export function useGetapiRecordsumvalue(
  params?: { sensor?: string; startDate?: string; endDate?: string },
  options?: Omit<UseQueryOptions<number, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: recordKeys.getapiRecordsumvalue,
    queryFn: () => getapiRecordsumvalue(params),
    ...options,
  });
}

/**
 */
export function usePostapiRecordcreateanonymous(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: IotRecordModel }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: IotRecordModel }) =>
      postapiRecordcreateanonymous(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiRecordgetrecords(
  options?: Omit<
    UseMutationOptions<
      GetRecordResponsePaginationQuery,
      Error,
      {
        data: SortType[];
        params?: {
          fromTime?: string;
          toTime?: string;
          SensorId?: ObjectId;
          DeviceId?: ObjectId;
          typeList?: IoTSensorType[];
          pageNumber?: number;
          pageSize?: number;
          searchTerm?: string;
        };
      }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: {
      data: SortType[];
      params?: {
        fromTime?: string;
        toTime?: string;
        SensorId?: ObjectId;
        DeviceId?: ObjectId;
        typeList?: IoTSensorType[];
        pageNumber?: number;
        pageSize?: number;
        searchTerm?: string;
      };
    }) => postapiRecordgetrecords(variables.data, variables.params),
    ...options,
  });
}
