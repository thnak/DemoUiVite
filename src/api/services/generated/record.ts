import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  GetRecordResponsePaginationQuery,
  IoTSensorType,
  IotRecordModel,
  ObjectId,
  SortType,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Record Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Record API endpoints
 */
export const RECORD_ENDPOINTS = {
  postapiRecordcreateanonymous: '/api/Record/create-anonymous',
  getapiRecordsumvalue: '/api/Record/sum-value',
  postapiRecordgetrecords: '/api/Record/get-records',
} as const;

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiRecordcreateanonymous(data: IotRecordModel): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(RECORD_ENDPOINTS.postapiRecordcreateanonymous, data);
  return response.data;
}

/**
 * @returns Promise<number>
 */
export async function getapiRecordsumvalue(params?: { sensor?: string; startDate?: string; endDate?: string }): Promise<number> {
  const response = await axiosInstance.get<number>(RECORD_ENDPOINTS.getapiRecordsumvalue, { params });
  return response.data;
}

/**
 * @param SensorId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @param DeviceId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<GetRecordResponsePaginationQuery>
 */
export async function postapiRecordgetrecords(data: SortType[], params?: { fromTime?: string; toTime?: string; SensorId?: ObjectId; DeviceId?: ObjectId; typeList?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<GetRecordResponsePaginationQuery> {
  const response = await axiosInstance.post<GetRecordResponsePaginationQuery>(RECORD_ENDPOINTS.postapiRecordgetrecords, data, { params });
  return response.data;
}
