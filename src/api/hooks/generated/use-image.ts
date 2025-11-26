import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import { postapiImagefavicon, getapiImagegeneratesize } from '../../services/generated/image';

// ----------------------------------------------------------------------
// Image Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Image
 */
export const imageKeys = {
  all: ['image'] as const,
  getapiImagegeneratesize: (size: string) => ['image', 'getapiImagegeneratesize', size] as const,
};

/**
 */
export function useGetapiImagegeneratesize(
  size: string,
  params?: { text?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: imageKeys.getapiImagegeneratesize(size),
    queryFn: () => getapiImagegeneratesize(size, params),
    ...options,
  });
}

/**
 */
export function usePostapiImagefavicon(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiImagefavicon,
    ...options,
  });
}
