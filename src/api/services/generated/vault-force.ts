import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// VaultForce Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * VaultForce API endpoints
 */
export const VAULTFORCE_ENDPOINTS = {
  postshutdown: '/shutdown',
  postAccountPerformExternalLogin: '/Account/PerformExternalLogin',
  postAccountLogout: '/Account/Logout',
  postAccountPasskeyCreationOptions: '/Account/PasskeyCreationOptions',
  postAccountPasskeyRequestOptions: '/Account/PasskeyRequestOptions',
  postAccountManageLinkExternalLogin: '/Account/Manage/LinkExternalLogin',
  postAccountManageDownloadPersonalData: '/Account/Manage/DownloadPersonalData',
} as const;

/**
 * @returns Promise<void>
 */
export async function postshutdown(): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postshutdown);
}

/**
 * @returns Promise<void>
 */
export async function postAccountPerformExternalLogin(): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postAccountPerformExternalLogin);
}

/**
 * @returns Promise<void>
 */
export async function postAccountLogout(): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postAccountLogout);
}

/**
 * @returns Promise<void>
 */
export async function postAccountPasskeyCreationOptions(): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postAccountPasskeyCreationOptions);
}

/**
 * @returns Promise<void>
 */
export async function postAccountPasskeyRequestOptions(params?: { username?: string }): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postAccountPasskeyRequestOptions, null, { params });
}

/**
 * @returns Promise<void>
 */
export async function postAccountManageLinkExternalLogin(): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postAccountManageLinkExternalLogin);
}

/**
 * @returns Promise<void>
 */
export async function postAccountManageDownloadPersonalData(): Promise<void> {
  await axiosInstance.post(VAULTFORCE_ENDPOINTS.postAccountManageDownloadPersonalData);
}
