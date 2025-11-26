import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getCultureset,
} from '../../services/generated/culture';

// ----------------------------------------------------------------------
// Culture Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Culture
 */
export const cultureKeys = {
  all: ['culture'] as const,
  getCultureset: ['culture', 'getCultureset'] as const,
};

/**
 */
export function useGetCultureset(
  params?: { culture?: string; redirectUri?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: cultureKeys.getCultureset,
    queryFn: () => getCultureset(params),
    ...options,
  });
}
