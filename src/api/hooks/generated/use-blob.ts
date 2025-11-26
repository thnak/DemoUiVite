import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiBlobDownloadFile,
  postapiBlobUploadFile,
} from '../../services/generated/blob';

// ----------------------------------------------------------------------
// Blob Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Blob
 */
export const blobKeys = {
  all: ['blob'] as const,
  getapiBlobDownloadFile: ['blob', 'getapiBlobDownloadFile'] as const,
};

/**
 */
export function useGetapiBlobDownloadFile(
  params?: { fileName?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: blobKeys.getapiBlobDownloadFile,
    queryFn: () => getapiBlobDownloadFile(params),
    ...options,
  });
}

/**
 */
export function usePostapiBlobUploadFile(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiBlobUploadFile,
    ...options,
  });
}
