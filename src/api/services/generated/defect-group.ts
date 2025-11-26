import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  DefectGroupEntity,
  DefectGroupEntityResult,
  StringObjectKeyValuePair,
  DefectGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DefectGroup Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * DefectGroup API endpoints
 */
export const DEFECTGROUP_ENDPOINTS = {
  getDefectGroupById: '/api/defectgroup/{id}',
  getDefectGroupPage: '/api/defectgroup/get-page',
  createDefectGroup: '/api/defectgroup/create',
  updateDefectGroup: '/api/defectgroup/update/{id}',
  deleteDefectGroup: '/api/defectgroup/delete/{id}',
  generateNewDefectGroupCode: '/api/defectgroup/generate-new-code',
  searchDefectGroup: '/api/defectgroup/search',
} as const;

/**
 * Get Defect Group by ID
 *
 * Retrieves a specific Defect Group entity by its unique identifier.
 * @returns Promise<DefectGroupEntity>
 */
export async function getDefectGroupById(id: string): Promise<DefectGroupEntity> {
  const response = await axiosInstance.get<DefectGroupEntity>(`/api/defectgroup/${id}`);
  return response.data;
}

/**
 * Get paginated list of Defect Group
 *
 * Retrieves a paginated list of Defect Group entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DefectGroupEntityBasePaginationResponse>
 */
export async function getDefectGroupPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<DefectGroupEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DefectGroupEntityBasePaginationResponse>(
    DEFECTGROUP_ENDPOINTS.getDefectGroupPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Defect Group
 *
 * Creates a new Defect Group entity in the system.
 * @param data - Request body
 * @returns Promise<DefectGroupEntityResult>
 */
export async function createDefectGroup(data: DefectGroupEntity): Promise<DefectGroupEntityResult> {
  const response = await axiosInstance.post<DefectGroupEntityResult>(
    DEFECTGROUP_ENDPOINTS.createDefectGroup,
    data
  );
  return response.data;
}

/**
 * Update an existing Defect Group
 *
 * Updates specific fields of an existing Defect Group entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDefectGroup(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/defectgroup/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Defect Group
 *
 * Deletes a Defect Group entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDefectGroup(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/defectgroup/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Defect Group
 *
 * Generates a new unique code for a Defect Group entity.
 * @returns Promise<string>
 */
export async function generateNewDefectGroupCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    DEFECTGROUP_ENDPOINTS.generateNewDefectGroupCode
  );
  return response.data;
}

/**
 * Search Defect Group entities
 *
 * Searches Defect Group entities by text across searchable fields.
 * @returns Promise<DefectGroupEntity[]>
 */
export async function searchDefectGroup(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<DefectGroupEntity[]> {
  const response = await axiosInstance.get<DefectGroupEntity[]>(
    DEFECTGROUP_ENDPOINTS.searchDefectGroup,
    { params }
  );
  return response.data;
}
