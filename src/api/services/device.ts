import axiosInstance from '../axios-instance';
import { DEVICE_ENDPOINTS } from './generated';

import type { BooleanResult } from '../types/generated';

// ----------------------------------------------------------------------
// Device Service - Custom implementations
// Custom implementations for device-related endpoints that need special handling
// ----------------------------------------------------------------------

/**
 * Add a sensor to a device
 *
 * @param deviceId - Device ObjectId (24-character hexadecimal string)
 * @param sensorId - Sensor ObjectId (24-character hexadecimal string)
 * @returns Promise with operation result
 */
export async function addSensorToDevice(
  deviceId: string,
  sensorId: string
): Promise<BooleanResult> {
  const formData = new FormData();
  formData.append('deviceId', deviceId);
  formData.append('sensorId', sensorId);

  const response = await axiosInstance.post<BooleanResult>(
    DEVICE_ENDPOINTS.postapiDeviceaddsensortodevice,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

/**
 * Remove a sensor from a device
 *
 * @param sensorId - Sensor ObjectId (24-character hexadecimal string)
 * @returns Promise with operation result
 */
export async function removeSensorFromDevice(sensorId: string): Promise<BooleanResult> {
  const formData = new FormData();
  formData.append('sensorId', sensorId);

  const response = await axiosInstance.post<BooleanResult>(
    DEVICE_ENDPOINTS.postapiDeviceremovesensorfromdevice,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
