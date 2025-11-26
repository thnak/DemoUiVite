import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// Modules Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Modules API endpoints
 */
export const MODULES_ENDPOINTS = {
  postapiModulesupload: '/api/Modules/upload',
  getapiModulesgetmodules: '/api/Modules/get-modules',
  getapiModulesgetmoduleicons: '/api/Modules/get-module-icons',
} as const;

/**
 * @returns Promise<void>
 */
export async function postapiModulesupload(): Promise<void> {
  await axiosInstance.post(MODULES_ENDPOINTS.postapiModulesupload);
}

/**
 * @returns Promise<void>
 */
export async function getapiModulesgetmodules(): Promise<void> {
  await axiosInstance.get(MODULES_ENDPOINTS.getapiModulesgetmodules);
}

/**
 * @returns Promise<void>
 */
export async function getapiModulesgetmoduleicons(): Promise<void> {
  await axiosInstance.get(MODULES_ENDPOINTS.getapiModulesgetmoduleicons);
}
