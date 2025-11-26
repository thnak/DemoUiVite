import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  JobEntity,
  JobEntityBasePaginationResponse,
  JobEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Job Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Job API endpoints
 */
export const JOB_ENDPOINTS = {
  getJobById: '/api/job/{id}',
  getJobPage: '/api/job/get-page',
  createJob: '/api/job/create',
  updateJob: '/api/job/update/{id}',
  deleteJob: '/api/job/delete/{id}',
  generateNewJobCode: '/api/job/generate-new-code',
} as const;

/**
 * Get Job by ID
 *
 * Retrieves a specific Job entity by its unique identifier.
 * @returns Promise<JobEntity>
 */
export async function getJobById(id: string): Promise<JobEntity> {
  const response = await axiosInstance.get<JobEntity>(`/api/job/${id}`);
  return response.data;
}

/**
 * Get paginated list of Job
 *
 * Retrieves a paginated list of Job entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<JobEntityBasePaginationResponse>
 */
export async function getJobPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<JobEntityBasePaginationResponse> {
  const response = await axiosInstance.post<JobEntityBasePaginationResponse>(JOB_ENDPOINTS.getJobPage, data, { params });
  return response.data;
}

/**
 * Create a new Job
 *
 * Creates a new Job entity in the system.
 * @param data - Request body
 * @returns Promise<JobEntityResult>
 */
export async function createJob(data: JobEntity): Promise<JobEntityResult> {
  const response = await axiosInstance.post<JobEntityResult>(JOB_ENDPOINTS.createJob, data);
  return response.data;
}

/**
 * Update an existing Job
 *
 * Updates specific fields of an existing Job entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateJob(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/job/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Job
 *
 * Deletes a Job entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteJob(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/job/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Job
 *
 * Generates a new unique code for a Job entity.
 * @returns Promise<string>
 */
export async function generateNewJobCode(): Promise<string> {
  const response = await axiosInstance.get<string>(JOB_ENDPOINTS.generateNewJobCode);
  return response.data;
}
