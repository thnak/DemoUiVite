import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SystemErrorReportStatus,
  SystemErrorReportDtoListResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemError Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * SystemError API endpoints
 */
export const SYSTEMERROR_ENDPOINTS = {
  postapiSystemErrorCreateNewErrorReport: '/api/SystemError/CreateNewErrorReport',
  getapiSystemErrorGetUnresolvedReports: '/api/SystemError/GetUnresolvedReports',
} as const;

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiSystemErrorCreateNewErrorReport(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    SYSTEMERROR_ENDPOINTS.postapiSystemErrorCreateNewErrorReport
  );
  return response.data;
}

/**
 * @param status - Represents the progress status of a system error report.
 * @returns Promise<SystemErrorReportDtoListResult>
 */
export async function getapiSystemErrorGetUnresolvedReports(params?: {
  status?: SystemErrorReportStatus;
}): Promise<SystemErrorReportDtoListResult> {
  const response = await axiosInstance.get<SystemErrorReportDtoListResult>(
    SYSTEMERROR_ENDPOINTS.getapiSystemErrorGetUnresolvedReports,
    { params }
  );
  return response.data;
}
