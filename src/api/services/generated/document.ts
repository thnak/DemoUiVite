import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  DocumentEntity,
  DocumentEntityBasePaginationResponse,
  DocumentEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Document Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Document API endpoints
 */
export const DOCUMENT_ENDPOINTS = {
  getDocumentById: '/api/document/{id}',
  getDocumentPage: '/api/document/get-page',
  createDocument: '/api/document/create',
  updateDocument: '/api/document/update/{id}',
  deleteDocument: '/api/document/delete/{id}',
  generateNewDocumentCode: '/api/document/generate-new-code',
} as const;

/**
 * Get Document by ID
 *
 * Retrieves a specific Document entity by its unique identifier.
 * @returns Promise<DocumentEntity>
 */
export async function getDocumentById(id: string): Promise<DocumentEntity> {
  const response = await axiosInstance.get<DocumentEntity>(`/api/document/${id}`);
  return response.data;
}

/**
 * Get paginated list of Document
 *
 * Retrieves a paginated list of Document entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DocumentEntityBasePaginationResponse>
 */
export async function getDocumentPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<DocumentEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DocumentEntityBasePaginationResponse>(DOCUMENT_ENDPOINTS.getDocumentPage, data, { params });
  return response.data;
}

/**
 * Create a new Document
 *
 * Creates a new Document entity in the system.
 * @param data - Request body
 * @returns Promise<DocumentEntityResult>
 */
export async function createDocument(data: DocumentEntity): Promise<DocumentEntityResult> {
  const response = await axiosInstance.post<DocumentEntityResult>(DOCUMENT_ENDPOINTS.createDocument, data);
  return response.data;
}

/**
 * Update an existing Document
 *
 * Updates specific fields of an existing Document entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDocument(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/document/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Document
 *
 * Deletes a Document entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDocument(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/document/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Document
 *
 * Generates a new unique code for a Document entity.
 * @returns Promise<string>
 */
export async function generateNewDocumentCode(): Promise<string> {
  const response = await axiosInstance.get<string>(DOCUMENT_ENDPOINTS.generateNewDocumentCode);
  return response.data;
}
