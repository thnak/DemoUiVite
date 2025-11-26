import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiSystemErrorGetUnresolvedReports,
  postapiSystemErrorCreateNewErrorReport,
} from '../../services/generated/system-error';

import type {
  BooleanResult,
  SystemErrorReportDtoListResult,
  SystemErrorReportStatus,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemError Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for SystemError
 */
export const systemErrorKeys = {
  all: ['systemError'] as const,
  getapiSystemErrorGetUnresolvedReports: ['systemError', 'getapiSystemErrorGetUnresolvedReports'] as const,
};

/**
 */
export function useGetapiSystemErrorGetUnresolvedReports(
  params?: { status?: SystemErrorReportStatus },
  options?: Omit<UseQueryOptions<SystemErrorReportDtoListResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemErrorKeys.getapiSystemErrorGetUnresolvedReports,
    queryFn: () => getapiSystemErrorGetUnresolvedReports(params),
    ...options,
  });
}

/**
 */
export function usePostapiSystemErrorCreateNewErrorReport(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiSystemErrorCreateNewErrorReport,
    ...options,
  });
}
