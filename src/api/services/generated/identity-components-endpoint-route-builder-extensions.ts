import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// IdentityComponentsEndpointRouteBuilderExtensions Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * IdentityComponentsEndpointRouteBuilderExtensions API endpoints
 */
export const IDENTITYCOMPONENTSENDPOINTROUTEBUILDEREXTENSIONS_ENDPOINTS = {
  getAccountssologin: '/Account/ssologin',
} as const;

/**
 * @returns Promise<void>
 */
export async function getAccountssologin(params?: { token: string; redirectUri: string; requestUri: string }): Promise<void> {
  await axiosInstance.get(IDENTITYCOMPONENTSENDPOINTROUTEBUILDEREXTENSIONS_ENDPOINTS.getAccountssologin, { params });
}
