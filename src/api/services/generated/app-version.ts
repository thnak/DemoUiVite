import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// AppVersion Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * AppVersion API endpoints
 */
export const APPVERSION_ENDPOINTS = {
  postapiAppVersionnewversionavailable: '/api/AppVersion/new-version-available',
  postapiAppVersionforcereload: '/api/AppVersion/force-reload',
  postapiAppVersionappversionchange: '/api/AppVersion/app-version-change',
} as const;

/**
 * @returns Promise<void>
 */
export async function postapiAppVersionnewversionavailable(): Promise<void> {
  await axiosInstance.post(APPVERSION_ENDPOINTS.postapiAppVersionnewversionavailable);
}

/**
 * @returns Promise<void>
 */
export async function postapiAppVersionforcereload(): Promise<void> {
  await axiosInstance.post(APPVERSION_ENDPOINTS.postapiAppVersionforcereload);
}

/**
 * @returns Promise<void>
 */
export async function postapiAppVersionappversionchange(): Promise<void> {
  await axiosInstance.post(APPVERSION_ENDPOINTS.postapiAppVersionappversionchange);
}
