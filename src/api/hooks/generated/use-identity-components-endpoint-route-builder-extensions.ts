import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getAccountssologin,
} from '../../services/generated/identity-components-endpoint-route-builder-extensions';

// ----------------------------------------------------------------------
// IdentityComponentsEndpointRouteBuilderExtensions Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for IdentityComponentsEndpointRouteBuilderExtensions
 */
export const identityComponentsEndpointRouteBuilderExtensionsKeys = {
  all: ['identityComponentsEndpointRouteBuilderExtensions'] as const,
  getAccountssologin: ['identityComponentsEndpointRouteBuilderExtensions', 'getAccountssologin'] as const,
};

/**
 */
export function useGetAccountssologin(
  params?: { token: string; redirectUri: string; requestUri: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: identityComponentsEndpointRouteBuilderExtensionsKeys.getAccountssologin,
    queryFn: () => getAccountssologin(params),
    ...options,
  });
}
