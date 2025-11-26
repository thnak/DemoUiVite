import axiosInstance from '../../axios-instance';

import type {
  SortType,
  UserEntity,
  UserInfoDto,
  BooleanResult,
  UserEntityResult,
  ChangePasswordDto,
  UpdateUserInfoDto,
  StringObjectKeyValuePair,
  ChangeLockScreenPasswordDto,
  UserEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// User Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * User API endpoints
 */
export const USER_ENDPOINTS = {
  getUserById: '/api/user/{id}',
  getUserPage: '/api/user/get-page',
  createUser: '/api/user/create',
  updateUser: '/api/user/update/{id}',
  deleteUser: '/api/user/delete/{id}',
  generateNewUserCode: '/api/user/generate-new-code',
  postapiUsersettheme: '/api/User/set-theme',
  postapiUsersetdarkmode: '/api/User/set-dark-mode',
  getapiUsersetculture: '/api/User/set-culture',
  getapiUsergetusersetting: '/api/User/get-user-setting',
  postapiUseruploadavatar: '/api/User/upload-avatar',
  postapiUseruploadbanner: '/api/User/upload-banner',
  getapiUsergetuseravatarfile: '/api/User/get-user-avatar/{file}',
  getapiUsergetuserbannerfile: '/api/User/get-user-banner/{file}',
  getapiUsergetuserimage: '/api/User/get-user-image',
  getapiUsergetuserinfo: '/api/User/get-user-info',
  postapiUserupdateuserinfo: '/api/User/update-user-info',
  postapiUserchangepassword: '/api/User/change-password',
  postapiUserchangelockscreenpassword: '/api/User/change-lock-screen-password',
  postapiUserupdateuserconfig: '/api/User/update-user-config',
} as const;

/**
 * Get User by ID
 *
 * Retrieves a specific User entity by its unique identifier.
 * @returns Promise<UserEntity>
 */
export async function getUserById(id: string): Promise<UserEntity> {
  const response = await axiosInstance.get<UserEntity>(`/api/user/${id}`);
  return response.data;
}

/**
 * Get paginated list of User
 *
 * Retrieves a paginated list of User entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserEntityBasePaginationResponse>
 */
export async function getUserPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<UserEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserEntityBasePaginationResponse>(
    USER_ENDPOINTS.getUserPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new User
 *
 * Creates a new User entity in the system.
 * @param data - Request body
 * @returns Promise<UserEntityResult>
 */
export async function createUser(data: UserEntity): Promise<UserEntityResult> {
  const response = await axiosInstance.post<UserEntityResult>(USER_ENDPOINTS.createUser, data);
  return response.data;
}

/**
 * Update an existing User
 *
 * Updates specific fields of an existing User entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUser(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/user/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User
 *
 * Deletes a User entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUser(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/user/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User
 *
 * Generates a new unique code for a User entity.
 * @returns Promise<string>
 */
export async function generateNewUserCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USER_ENDPOINTS.generateNewUserCode);
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function postapiUsersettheme(params?: { theme?: string }): Promise<void> {
  await axiosInstance.post(USER_ENDPOINTS.postapiUsersettheme, { params });
}

/**
 * @returns Promise<void>
 */
export async function postapiUsersetdarkmode(params?: { darkMode?: boolean }): Promise<void> {
  await axiosInstance.post(USER_ENDPOINTS.postapiUsersetdarkmode, { params });
}

/**
 * @returns Promise<void>
 */
export async function getapiUsersetculture(params?: {
  culture?: string;
  redirectUri?: string;
}): Promise<void> {
  await axiosInstance.get(USER_ENDPOINTS.getapiUsersetculture, { params });
}

/**
 * @returns Promise<void>
 */
export async function getapiUsergetusersetting(): Promise<void> {
  await axiosInstance.get(USER_ENDPOINTS.getapiUsergetusersetting);
}

/**
 * @returns Promise<void>
 */
export async function postapiUseruploadavatar(): Promise<void> {
  await axiosInstance.post(USER_ENDPOINTS.postapiUseruploadavatar);
}

/**
 * @returns Promise<void>
 */
export async function postapiUseruploadbanner(): Promise<void> {
  await axiosInstance.post(USER_ENDPOINTS.postapiUseruploadbanner);
}

/**
 * @returns Promise<void>
 */
export async function getapiUsergetuseravatarfile(file: string): Promise<void> {
  await axiosInstance.get(`/api/User/get-user-avatar/${file}`);
}

/**
 * @returns Promise<void>
 */
export async function getapiUsergetuserbannerfile(file: string): Promise<void> {
  await axiosInstance.get(`/api/User/get-user-banner/${file}`);
}

/**
 * @returns Promise<void>
 */
export async function getapiUsergetuserimage(): Promise<void> {
  await axiosInstance.get(USER_ENDPOINTS.getapiUsergetuserimage);
}

/**
 * Gets comprehensive user information including settings
 * @returns Promise<UserInfoDto>
 */
export async function getapiUsergetuserinfo(): Promise<UserInfoDto> {
  const response = await axiosInstance.get<UserInfoDto>(USER_ENDPOINTS.getapiUsergetuserinfo);
  return response.data;
}

/**
 * Updates user personal information
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiUserupdateuserinfo(data: UpdateUserInfoDto): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    USER_ENDPOINTS.postapiUserupdateuserinfo,
    data
  );
  return response.data;
}

/**
 * Changes the user's account password
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiUserchangepassword(data: ChangePasswordDto): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    USER_ENDPOINTS.postapiUserchangepassword,
    data
  );
  return response.data;
}

/**
 * Changes the user's lock screen password
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiUserchangelockscreenpassword(
  data: ChangeLockScreenPasswordDto
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    USER_ENDPOINTS.postapiUserchangelockscreenpassword,
    data
  );
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiUserupdateuserconfig(
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    USER_ENDPOINTS.postapiUserupdateuserconfig,
    data
  );
  return response.data;
}
