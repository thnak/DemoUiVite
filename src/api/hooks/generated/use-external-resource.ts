import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiExternalResourcedownloadresourcefolder,
  getapiExternalResourcelistresourcefolders,
  getapiExternalResourcerandomimage,
  getapiExternalResourcerandommedia,
  getapiExternalResourcerandomvideo,
  postapiExternalResourceuploadresourcefolder,
  postapiExternalResourceuploaduiresource,
} from '../../services/generated/external-resource';

// ----------------------------------------------------------------------
// ExternalResource Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ExternalResource
 */
export const externalResourceKeys = {
  all: ['externalResource'] as const,
  getapiExternalResourcedownloadresourcefolder: (folder: string) => ['externalResource', 'getapiExternalResourcedownloadresourcefolder', folder] as const,
  getapiExternalResourcelistresourcefolders: ['externalResource', 'getapiExternalResourcelistresourcefolders'] as const,
  getapiExternalResourcerandomimage: ['externalResource', 'getapiExternalResourcerandomimage'] as const,
  getapiExternalResourcerandomvideo: ['externalResource', 'getapiExternalResourcerandomvideo'] as const,
  getapiExternalResourcerandommedia: ['externalResource', 'getapiExternalResourcerandommedia'] as const,
};

/**
 */
export function useGetapiExternalResourcedownloadresourcefolder(
  folder: string,
  options?: Omit<UseQueryOptions<File, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: externalResourceKeys.getapiExternalResourcedownloadresourcefolder(folder),
    queryFn: () => getapiExternalResourcedownloadresourcefolder(folder),
    ...options,
  });
}

/**
 */
export function useGetapiExternalResourcelistresourcefolders(
  options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: externalResourceKeys.getapiExternalResourcelistresourcefolders,
    queryFn: () => getapiExternalResourcelistresourcefolders(),
    ...options,
  });
}

/**
 */
export function useGetapiExternalResourcerandomimage(
  params?: { folder?: string },
  options?: Omit<UseQueryOptions<File, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: externalResourceKeys.getapiExternalResourcerandomimage,
    queryFn: () => getapiExternalResourcerandomimage(params),
    ...options,
  });
}

/**
 */
export function useGetapiExternalResourcerandomvideo(
  params?: { folder?: string },
  options?: Omit<UseQueryOptions<File, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: externalResourceKeys.getapiExternalResourcerandomvideo,
    queryFn: () => getapiExternalResourcerandomvideo(params),
    ...options,
  });
}

/**
 */
export function useGetapiExternalResourcerandommedia(
  params?: { folder?: string },
  options?: Omit<UseQueryOptions<File, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: externalResourceKeys.getapiExternalResourcerandommedia,
    queryFn: () => getapiExternalResourcerandommedia(params),
    ...options,
  });
}

/**
 */
export function usePostapiExternalResourceuploaduiresource(
  options?: Omit<UseMutationOptions<unknown, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiExternalResourceuploaduiresource,
    ...options,
  });
}

/**
 */
export function usePostapiExternalResourceuploadresourcefolder(
  options?: Omit<UseMutationOptions<unknown, Error, { folder: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { folder: string }) => postapiExternalResourceuploadresourcefolder(variables.folder),
    ...options,
  });
}
