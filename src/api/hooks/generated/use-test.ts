import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { getapiTeststream } from '../../services/generated/test';

// ----------------------------------------------------------------------
// Test Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Test
 */
export const testKeys = {
  all: ['test'] as const,
  getapiTeststream: ['test', 'getapiTeststream'] as const,
};

/**
 */
export function useGetapiTeststream(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: testKeys.getapiTeststream,
    queryFn: () => getapiTeststream(),
    ...options,
  });
}
