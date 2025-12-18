import type { UseMutationOptions } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import { addSensorToDevice, removeSensorFromDevice } from '../services/device';

import type { BooleanResult } from '../types/generated';

// ----------------------------------------------------------------------
// Device Hooks - Custom implementations
// Custom hooks for device-related operations that need special handling
// ----------------------------------------------------------------------

/**
 * Add a sensor to a device
 */
export function useAddSensorToDevice(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { deviceId: string; sensorId: string }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { deviceId: string; sensorId: string }) =>
      addSensorToDevice(variables.deviceId, variables.sensorId),
    ...options,
  });
}

/**
 * Remove a sensor from a device
 */
export function useRemoveSensorFromDevice(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { sensorId: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { sensorId: string }) => removeSensorFromDevice(variables.sensorId),
    ...options,
  });
}
