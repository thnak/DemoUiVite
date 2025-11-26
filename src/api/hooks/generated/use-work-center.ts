import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiWorkCentersearchbycode,
} from '../../services/generated/work-center';

// ----------------------------------------------------------------------
// WorkCenter Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for WorkCenter
 */
export const workCenterKeys = {
  all: ['workCenter'] as const,
  getapiWorkCentersearchbycode: ['workCenter', 'getapiWorkCentersearchbycode'] as const,
};

/**
 * Tìm kiếm group Code theo mã hoặc tên
 */
export function useGetapiWorkCentersearchbycode(
  params?: { keyword?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workCenterKeys.getapiWorkCentersearchbycode,
    queryFn: () => getapiWorkCentersearchbycode(params),
    ...options,
  });
}
