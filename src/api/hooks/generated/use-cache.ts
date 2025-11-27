import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  getapiCacheclear,
} from '../../services/generated/cache';

// ----------------------------------------------------------------------
// Cache Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Cache
 */
export const cacheKeys = {
  all: ['cache'] as const,
  getapiCacheclear: ['cache', 'getapiCacheclear'] as const,
};

/**
 */
export function useGetapiCacheclear(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: cacheKeys.getapiCacheclear,
    queryFn: () => getapiCacheclear(),
    ...options,
  });
}
