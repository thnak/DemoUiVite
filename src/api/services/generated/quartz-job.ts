import axiosInstance from '../../axios-instance';

import type {
  QuartzJobDto,
  QuartzCollectionDto,
  QuartzJobSummaryDto,
  QuartzCollectionCleanupResultDto,
} from '../../types/generated';

// ----------------------------------------------------------------------
// QuartzJob Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * QuartzJob API endpoints
 */
export const QUARTZJOB_ENDPOINTS = {
  getapiQuartzJobsummary: '/api/QuartzJob/summary',
  getapiQuartzJoball: '/api/QuartzJob/all',
  getapiQuartzJobgroupgroupName: '/api/QuartzJob/group/{groupName}',
  getapiQuartzJobexecuting: '/api/QuartzJob/executing',
  getapiQuartzJobcollections: '/api/QuartzJob/collections',
  deleteapiQuartzJobcollections: '/api/QuartzJob/collections',
  deleteapiQuartzJobcollectionscollectionName: '/api/QuartzJob/collections/{collectionName}',
} as const;

/**
 * Get summary of all Quartz jobs
 * @returns Promise<QuartzJobSummaryDto>
 */
export async function getapiQuartzJobsummary(): Promise<QuartzJobSummaryDto> {
  const response = await axiosInstance.get<QuartzJobSummaryDto>(QUARTZJOB_ENDPOINTS.getapiQuartzJobsummary);
  return response.data;
}

/**
 * Get all jobs with their details
 * @returns Promise<QuartzJobDto[]>
 */
export async function getapiQuartzJoball(): Promise<QuartzJobDto[]> {
  const response = await axiosInstance.get<QuartzJobDto[]>(QUARTZJOB_ENDPOINTS.getapiQuartzJoball);
  return response.data;
}

/**
 * Get jobs by group
 * @param groupName - Job group name
 * @returns Promise<QuartzJobDto[]>
 */
export async function getapiQuartzJobgroupgroupName(groupName: string): Promise<QuartzJobDto[]> {
  const response = await axiosInstance.get<QuartzJobDto[]>(`/api/QuartzJob/group/${groupName}`);
  return response.data;
}

/**
 * Get currently executing jobs
 * @returns Promise<QuartzJobDto[]>
 */
export async function getapiQuartzJobexecuting(): Promise<QuartzJobDto[]> {
  const response = await axiosInstance.get<QuartzJobDto[]>(QUARTZJOB_ENDPOINTS.getapiQuartzJobexecuting);
  return response.data;
}

/**
 * Get all Quartz_* collections from MongoDB
 * @returns Promise<QuartzCollectionDto[]>
 */
export async function getapiQuartzJobcollections(): Promise<QuartzCollectionDto[]> {
  const response = await axiosInstance.get<QuartzCollectionDto[]>(QUARTZJOB_ENDPOINTS.getapiQuartzJobcollections);
  return response.data;
}

/**
 * Delete all Quartz_* collections from MongoDB
 * @returns Promise<QuartzCollectionCleanupResultDto[]>
 */
export async function deleteapiQuartzJobcollections(): Promise<QuartzCollectionCleanupResultDto[]> {
  const response = await axiosInstance.delete<QuartzCollectionCleanupResultDto[]>(QUARTZJOB_ENDPOINTS.deleteapiQuartzJobcollections);
  return response.data;
}

/**
 * Delete a specific Quartz_* collection from MongoDB
 * @param collectionName - Name of the collection to delete
 * @returns Promise<QuartzCollectionCleanupResultDto>
 */
export async function deleteapiQuartzJobcollectionscollectionName(collectionName: string): Promise<QuartzCollectionCleanupResultDto> {
  const response = await axiosInstance.delete<QuartzCollectionCleanupResultDto>(`/api/QuartzJob/collections/${collectionName}`);
  return response.data;
}
