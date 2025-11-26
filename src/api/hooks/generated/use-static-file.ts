import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  deleteapiStaticFiledelete,
  postapiStaticFilerequestadultcontent,
  postapiStaticFileupload,
} from '../../services/generated/static-file';

// ----------------------------------------------------------------------
// StaticFile Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for StaticFile
 */
export const staticFileKeys = {
  all: ['staticFile'] as const,
};

/**
 */
export function usePostapiStaticFileupload(
  options?: Omit<UseMutationOptions<void, Error, { params?: { subPath?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { subPath?: string } }) => postapiStaticFileupload(variables.params),
    ...options,
  });
}

/**
 */
export function useDeleteapiStaticFiledelete(
  options?: Omit<UseMutationOptions<void, Error, { params?: { relativePath?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { relativePath?: string } }) => deleteapiStaticFiledelete(variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiStaticFilerequestadultcontent(
  options?: Omit<UseMutationOptions<void, Error, { params?: { relativePath?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { relativePath?: string } }) => postapiStaticFilerequestadultcontent(variables.params),
    ...options,
  });
}
