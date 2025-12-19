import axiosInstance from '../axios-instance';

import type {
  ObjectId,
  BooleanResult,
  ProductEntity,
  WorkingParameterEntity,
  ProductWorkingStateByMachine,
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
 * Get current product running on a machine
 * 
 * Retrieves the current product being processed by the machine.
 * @param machineId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @returns Promise<ProductWorkingStateByMachine | null>
 */
export async function getCurrentProduct(machineId: ObjectId): Promise<ProductWorkingStateByMachine | null> {
  try {
    const response = await axiosInstance.get<ProductWorkingStateByMachine>(
      `/api/Machine/${machineId}/current-product`
    );
    return response.data;
  } catch (error: any) {
    // Return null if 404 (no product running)
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get machine image URL
 * 
 * Returns the image URL for a specific machine (redirects to actual image).
 * @param machineId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @returns string - Image URL
 */
export function getMachineImageUrl(machineId: ObjectId): string {
  return `${axiosInstance.defaults.baseURL}/api/Machine/${machineId}/image`;
}

/**
 * Get product image URL
 * 
 * Returns the image URL for a specific product (redirects to actual image).
 * @param productId - MongoDB ObjectId represented as a 24-character hexadecimal string
 * @returns string - Image URL
 */
export function getProductImageUrl(productId: ObjectId): string {
  return `${axiosInstance.defaults.baseURL}/api/Product/${productId}/image`;
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
