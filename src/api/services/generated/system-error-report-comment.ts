import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  SystemErrorReportCommentEntity,
  SystemErrorReportCommentEntityResult,
  SystemErrorReportCommentEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemErrorReportComment Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * SystemErrorReportComment API endpoints
 */
export const SYSTEMERRORREPORTCOMMENT_ENDPOINTS = {
  getSystemErrorReportCommentById: '/api/systemerrorreportcomment/{id}',
  getSystemErrorReportCommentPage: '/api/systemerrorreportcomment/get-page',
  createSystemErrorReportComment: '/api/systemerrorreportcomment/create',
  updateSystemErrorReportComment: '/api/systemerrorreportcomment/update/{id}',
  deleteSystemErrorReportComment: '/api/systemerrorreportcomment/delete/{id}',
  generateNewSystemErrorReportCommentCode: '/api/systemerrorreportcomment/generate-new-code',
} as const;

/**
 * Get System Error Report Comment by ID
 *
 * Retrieves a specific System Error Report Comment entity by its unique identifier.
 * @returns Promise<SystemErrorReportCommentEntity>
 */
export async function getSystemErrorReportCommentById(
  id: string
): Promise<SystemErrorReportCommentEntity> {
  const response = await axiosInstance.get<SystemErrorReportCommentEntity>(
    `/api/systemerrorreportcomment/${id}`
  );
  return response.data;
}

/**
 * Get paginated list of System Error Report Comment
 *
 * Retrieves a paginated list of System Error Report Comment entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SystemErrorReportCommentEntityBasePaginationResponse>
 */
export async function getSystemErrorReportCommentPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<SystemErrorReportCommentEntityBasePaginationResponse> {
  const response = await axiosInstance.post<SystemErrorReportCommentEntityBasePaginationResponse>(
    SYSTEMERRORREPORTCOMMENT_ENDPOINTS.getSystemErrorReportCommentPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new System Error Report Comment
 *
 * Creates a new System Error Report Comment entity in the system.
 * @param data - Request body
 * @returns Promise<SystemErrorReportCommentEntityResult>
 */
export async function createSystemErrorReportComment(
  data: SystemErrorReportCommentEntity
): Promise<SystemErrorReportCommentEntityResult> {
  const response = await axiosInstance.post<SystemErrorReportCommentEntityResult>(
    SYSTEMERRORREPORTCOMMENT_ENDPOINTS.createSystemErrorReportComment,
    data
  );
  return response.data;
}

/**
 * Update an existing System Error Report Comment
 *
 * Updates specific fields of an existing System Error Report Comment entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateSystemErrorReportComment(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/systemerrorreportcomment/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a System Error Report Comment
 *
 * Deletes a System Error Report Comment entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteSystemErrorReportComment(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(
    `/api/systemerrorreportcomment/delete/${id}`
  );
  return response.data;
}

/**
 * Generate a new code for System Error Report Comment
 *
 * Generates a new unique code for a System Error Report Comment entity.
 * @returns Promise<string>
 */
export async function generateNewSystemErrorReportCommentCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    SYSTEMERRORREPORTCOMMENT_ENDPOINTS.generateNewSystemErrorReportCommentCode
  );
  return response.data;
}
