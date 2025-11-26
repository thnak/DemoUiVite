import axiosInstance from '../../axios-instance';

// ----------------------------------------------------------------------
// ExternalResource Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ExternalResource API endpoints
 */
export const EXTERNALRESOURCE_ENDPOINTS = {
  postapiExternalResourceuploaduiresource: '/api/ExternalResource/upload-ui-resource',
  postapiExternalResourceuploadresourcefolder: '/api/ExternalResource/upload-resource/{folder}',
  getapiExternalResourcedownloadresourcefolder: '/api/ExternalResource/download-resource/{folder}',
  getapiExternalResourcelistresourcefolders: '/api/ExternalResource/list-resource-folders',
  getapiExternalResourcerandomimage: '/api/ExternalResource/random-image',
  getapiExternalResourcerandomvideo: '/api/ExternalResource/random-video',
  getapiExternalResourcerandommedia: '/api/ExternalResource/random-media',
} as const;

/**
 * @returns Promise<unknown>
 */
export async function postapiExternalResourceuploaduiresource(): Promise<unknown> {
  const response = await axiosInstance.post<unknown>(
    EXTERNALRESOURCE_ENDPOINTS.postapiExternalResourceuploaduiresource
  );
  return response.data;
}

/**
 * @returns Promise<unknown>
 */
export async function postapiExternalResourceuploadresourcefolder(
  folder: string
): Promise<unknown> {
  const response = await axiosInstance.post<unknown>(
    `/api/ExternalResource/upload-resource/${folder}`
  );
  return response.data;
}

/**
 * @returns Promise<File>
 */
export async function getapiExternalResourcedownloadresourcefolder(folder: string): Promise<File> {
  const response = await axiosInstance.get<File>(
    `/api/ExternalResource/download-resource/${folder}`
  );
  return response.data;
}

/**
 * @returns Promise<string[]>
 */
export async function getapiExternalResourcelistresourcefolders(): Promise<string[]> {
  const response = await axiosInstance.get<string[]>(
    EXTERNALRESOURCE_ENDPOINTS.getapiExternalResourcelistresourcefolders
  );
  return response.data;
}

/**
 * @returns Promise<File>
 */
export async function getapiExternalResourcerandomimage(params?: {
  folder?: string;
}): Promise<File> {
  const response = await axiosInstance.get<File>(
    EXTERNALRESOURCE_ENDPOINTS.getapiExternalResourcerandomimage,
    { params }
  );
  return response.data;
}

/**
 * @returns Promise<File>
 */
export async function getapiExternalResourcerandomvideo(params?: {
  folder?: string;
}): Promise<File> {
  const response = await axiosInstance.get<File>(
    EXTERNALRESOURCE_ENDPOINTS.getapiExternalResourcerandomvideo,
    { params }
  );
  return response.data;
}

/**
 * @returns Promise<File>
 */
export async function getapiExternalResourcerandommedia(params?: {
  folder?: string;
}): Promise<File> {
  const response = await axiosInstance.get<File>(
    EXTERNALRESOURCE_ENDPOINTS.getapiExternalResourcerandommedia,
    { params }
  );
  return response.data;
}
