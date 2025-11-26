import axiosInstance from '../../axios-instance';

import type {
  ObjectResult,
  ScriptExecutionRequest,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptTest Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ScriptTest API endpoints
 */
export const SCRIPTTEST_ENDPOINTS = {
  postapiScriptTestexecute: '/api/ScriptTest/execute',
} as const;

/**
 * Compiles and executes a C# script.
 * @param data - Request body
 * @returns Promise<ObjectResult>
 */
export async function postapiScriptTestexecute(data: ScriptExecutionRequest): Promise<ObjectResult> {
  const response = await axiosInstance.post<ObjectResult>(SCRIPTTEST_ENDPOINTS.postapiScriptTestexecute, data);
  return response.data;
}
