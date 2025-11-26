import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  postapihlsfileNametranscode,
  getapihlsfileNameplaylistm3u8,
  getapihlsfileNamesegmentssegmentName,
} from '../../services/generated/hls';

// ----------------------------------------------------------------------
// Hls Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Hls
 */
export const hlsKeys = {
  all: ['hls'] as const,
  getapihlsfileNameplaylistm3u8: (fileName: string) => ['hls', 'getapihlsfileNameplaylistm3u8', fileName] as const,
  getapihlsfileNamesegmentssegmentName: (fileName: string, segmentName: string) => ['hls', 'getapihlsfileNamesegmentssegmentName', fileName, segmentName] as const,
};

/**
 */
export function useGetapihlsfileNameplaylistm3u8(
  fileName: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: hlsKeys.getapihlsfileNameplaylistm3u8(fileName),
    queryFn: () => getapihlsfileNameplaylistm3u8(fileName),
    ...options,
  });
}

/**
 */
export function useGetapihlsfileNamesegmentssegmentName(
  fileName: string,
  segmentName: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: hlsKeys.getapihlsfileNamesegmentssegmentName(fileName, segmentName),
    queryFn: () => getapihlsfileNamesegmentssegmentName(fileName, segmentName),
    ...options,
  });
}

/**
 */
export function usePostapihlsfileNametranscode(
  options?: Omit<UseMutationOptions<void, Error, { fileName: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { fileName: string }) => postapihlsfileNametranscode(variables.fileName),
    ...options,
  });
}
