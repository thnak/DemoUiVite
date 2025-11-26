import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiVideostreamandsavefileName,
} from '../../services/generated/video';

// ----------------------------------------------------------------------
// Video Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Video
 */
export const videoKeys = {
  all: ['video'] as const,
  getapiVideostreamandsavefileName: (fileName: string) => ['video', 'getapiVideostreamandsavefileName', fileName] as const,
};

/**
 */
export function useGetapiVideostreamandsavefileName(
  fileName: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: videoKeys.getapiVideostreamandsavefileName(fileName),
    queryFn: () => getapiVideostreamandsavefileName(fileName),
    ...options,
  });
}
