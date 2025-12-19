import axiosInstance from '../axios-instance';

import type {
  ObjectId,
  BooleanResult,
  ProductEntity,
  WorkingParameterEntity,
  ProductWorkingStateByMachineBasePaginationResponse,
} from '../types/generated';

// ----------------------------------------------------------------------
// Custom Machine Service Extensions
// These are custom endpoints not yet in the OpenAPI spec
// ----------------------------------------------------------------------

/**
 * Represents an available product for a machine with its working parameters
 * @deprecated Use ProductWorkingStateByMachine from generated types instead
 */
export type AvailableProductDto = {
  product?: ProductEntity;
  workingParameter?: WorkingParameterEntity;
};

/**
 * Request for changing a machine's product
 */
export type ChangeProductRequest = {
  productId?: ObjectId;
  workingParameter?: WorkingParameterEntity;
};

/**
 * Parameters for fetching available products
 */
export type GetAvailableProductsParams = {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Get available products for a machine with pagination and search
 * 
 * Retrieves all products that can be produced on this machine along with their working parameters.
 * @param machineId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @param params - Optional parameters for search and pagination
 * @returns Promise<ProductWorkingStateByMachineBasePaginationResponse>
 */
export async function getAvailableProducts(
  machineId: ObjectId,
  params?: GetAvailableProductsParams
): Promise<ProductWorkingStateByMachineBasePaginationResponse> {
  const response = await axiosInstance.get<ProductWorkingStateByMachineBasePaginationResponse>(
    `/api/Machine/${machineId}/available-products`,
    { params }
  );
  return response.data;
}

/**
 * Change product for a machine
 * 
 * Changes the current product running on the machine and optionally updates working parameters.
 * @param machineId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @param data - Request body containing product ID and working parameters
 * @returns Promise<BooleanResult>
 */
export async function changeProduct(machineId: ObjectId, data: ChangeProductRequest): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/Machine/${machineId}/change-product`, data);
  return response.data;
}
