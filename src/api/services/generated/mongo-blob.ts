import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  MongoBlob,
  MongoBlobBasePaginationResponse,
  MongoBlobResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MongoBlob Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * MongoBlob API endpoints
 */
export const MONGOBLOB_ENDPOINTS = {
  getMongoBlobById: '/api/mongoblob/{id}',
  getMongoBlobPage: '/api/mongoblob/get-page',
  createMongoBlob: '/api/mongoblob/create',
  updateMongoBlob: '/api/mongoblob/update/{id}',
  deleteMongoBlob: '/api/mongoblob/delete/{id}',
  generateNewMongoBlobCode: '/api/mongoblob/generate-new-code',
} as const;

/**
 * Get Mongo Blob by ID
 *
 * Retrieves a specific Mongo Blob entity by its unique identifier.
 * @returns Promise<MongoBlob>
 */
export async function getMongoBlobById(id: string): Promise<MongoBlob> {
  const response = await axiosInstance.get<MongoBlob>(`/api/mongoblob/${id}`);
  return response.data;
}

/**
 * Get paginated list of Mongo Blob
 *
 * Retrieves a paginated list of Mongo Blob entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MongoBlobBasePaginationResponse>
 */
export async function getMongoBlobPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<MongoBlobBasePaginationResponse> {
  const response = await axiosInstance.post<MongoBlobBasePaginationResponse>(MONGOBLOB_ENDPOINTS.getMongoBlobPage, data, { params });
  return response.data;
}

/**
 * Create a new Mongo Blob
 *
 * Creates a new Mongo Blob entity in the system.
 * @param data - Request body
 * @returns Promise<MongoBlobResult>
 */
export async function createMongoBlob(data: MongoBlob): Promise<MongoBlobResult> {
  const response = await axiosInstance.post<MongoBlobResult>(MONGOBLOB_ENDPOINTS.createMongoBlob, data);
  return response.data;
}

/**
 * Update an existing Mongo Blob
 *
 * Updates specific fields of an existing Mongo Blob entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMongoBlob(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/mongoblob/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Mongo Blob
 *
 * Deletes a Mongo Blob entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMongoBlob(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/mongoblob/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Mongo Blob
 *
 * Generates a new unique code for a Mongo Blob entity.
 * @returns Promise<string>
 */
export async function generateNewMongoBlobCode(): Promise<string> {
  const response = await axiosInstance.get<string>(MONGOBLOB_ENDPOINTS.generateNewMongoBlobCode);
  return response.data;
}
