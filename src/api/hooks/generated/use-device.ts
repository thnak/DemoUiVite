import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiDevicecheckavailableip,
  getapiDevicecheckavailablemac,
  getapiDevicedownloadexceldeviceandsensor,
  getapiDevicefindentitytemplate,
  getapiDevicefindmqtttemplate,
  getapiDevicegetdevicebyiddeviceId,
  getapiDevicegeteditablesensor,
  getapiDevicegetsensorbydeviceid,
  getapiDevicegetsensorbysensorIdsensorId,
  getapiDevicesearchdevice,
  getapiDevicesearchsensor,
  postapiDeviceaddnewdevice,
  postapiDeviceaddnewdeviceform,
  postapiDeviceaddnewsensor,
  postapiDevicecreatemillionsamples,
  postapiDevicedeletedevice,
  postapiDevicedeletesensor,
  postapiDevicegetdevice,
  postapiDevicegetdevicelog,
  postapiDevicegetrawsensor,
  postapiDevicegetsensor,
  postapiDeviceupdatedevice,
  postapiDeviceupdatedeviceby,
  postapiDeviceupdatesensor,
  postapiDeviceuploadexcel,
} from '../../services/generated/device';

import type {
  BooleanResult,
  DataSource,
  GetDeviceLogsResponsePaginationQuery,
  GetSensorEntityByIdDto,
  IoTDeviceEntity,
  IoTDeviceEntityEntityLogEntity,
  IoTDeviceEntityPaginationQuery,
  IoTDeviceStatus,
  IoTDeviceType,
  IoTSensorEntity,
  IoTSensorEntityPaginationQuery,
  IoTSensorType,
  RequestToCreateDto,
  SensorDeviceDtoPaginationQuery,
  SensorDto,
  SensorDtoPaginationQuery,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Device Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Device
 */
export const deviceKeys = {
  all: ['device'] as const,
  getapiDevicecheckavailableip: ['device', 'getapiDevicecheckavailableip'] as const,
  getapiDevicecheckavailablemac: ['device', 'getapiDevicecheckavailablemac'] as const,
  getapiDevicegetdevicebyiddeviceId: (deviceId: string) => ['device', 'getapiDevicegetdevicebyiddeviceId', deviceId] as const,
  getapiDevicesearchdevice: ['device', 'getapiDevicesearchdevice'] as const,
  getapiDevicefindmqtttemplate: ['device', 'getapiDevicefindmqtttemplate'] as const,
  getapiDevicefindentitytemplate: ['device', 'getapiDevicefindentitytemplate'] as const,
  getapiDevicegeteditablesensor: ['device', 'getapiDevicegeteditablesensor'] as const,
  getapiDevicegetsensorbysensorIdsensorId: (sensorId: string) => ['device', 'getapiDevicegetsensorbysensorIdsensorId', sensorId] as const,
  getapiDevicesearchsensor: ['device', 'getapiDevicesearchsensor'] as const,
  getapiDevicedownloadexceldeviceandsensor: ['device', 'getapiDevicedownloadexceldeviceandsensor'] as const,
};

/**
 */
export function useGetapiDevicecheckavailableip(
  params?: { ip?: string },
  options?: Omit<UseQueryOptions<BooleanResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicecheckavailableip,
    queryFn: () => getapiDevicecheckavailableip(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicecheckavailablemac(
  params?: { mac?: string },
  options?: Omit<UseQueryOptions<BooleanResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicecheckavailablemac,
    queryFn: () => getapiDevicecheckavailablemac(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicegetdevicebyiddeviceId(
  deviceId: string,
  options?: Omit<UseQueryOptions<IoTDeviceEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicegetdevicebyiddeviceId(deviceId),
    queryFn: () => getapiDevicegetdevicebyiddeviceId(deviceId),
    ...options,
  });
}

/**
 */
export function useGetapiDevicesearchdevice(
  params?: { search?: string; pageSize?: number },
  options?: Omit<UseQueryOptions<IoTDeviceEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicesearchdevice,
    queryFn: () => getapiDevicesearchdevice(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicefindmqtttemplate(
  params?: { device?: string; template?: string; limit?: number },
  options?: Omit<UseQueryOptions<DataSource[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicefindmqtttemplate,
    queryFn: () => getapiDevicefindmqtttemplate(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicefindentitytemplate(
  params?: { logId?: string },
  options?: Omit<UseQueryOptions<IoTDeviceEntityEntityLogEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicefindentitytemplate,
    queryFn: () => getapiDevicefindentitytemplate(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicegeteditablesensor(
  params?: { id?: string },
  options?: Omit<UseQueryOptions<StringObjectKeyValuePair[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicegeteditablesensor,
    queryFn: () => getapiDevicegeteditablesensor(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicegetsensorbysensorIdsensorId(
  sensorId: string,
  options?: Omit<UseQueryOptions<GetSensorEntityByIdDto, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicegetsensorbysensorIdsensorId(sensorId),
    queryFn: () => getapiDevicegetsensorbysensorIdsensorId(sensorId),
    ...options,
  });
}

/**
 */
export function useGetapiDevicesearchsensor(
  params?: { search?: string; pageSize?: number },
  options?: Omit<UseQueryOptions<SensorDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicesearchsensor,
    queryFn: () => getapiDevicesearchsensor(params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicedownloadexceldeviceandsensor(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.getapiDevicedownloadexceldeviceandsensor,
    queryFn: () => getapiDevicedownloadexceldeviceandsensor(),
    ...options,
  });
}

/**
 */
export function usePostapiDeviceaddnewdevice(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: RequestToCreateDto }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: RequestToCreateDto }) => postapiDeviceaddnewdevice(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDeviceaddnewdeviceform(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiDeviceaddnewdeviceform,
    ...options,
  });
}

/**
 */
export function usePostapiDeviceaddnewsensor(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: IoTSensorEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: IoTSensorEntity }) => postapiDeviceaddnewsensor(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDevicecreatemillionsamples(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: IoTDeviceEntity[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: IoTDeviceEntity[] }) => postapiDevicecreatemillionsamples(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiDevicedeletedevice(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiDevicedeletedevice,
    ...options,
  });
}

/**
 */
export function usePostapiDevicedeletesensor(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiDevicedeletesensor,
    ...options,
  });
}

/**
 */
export function usePostapiDevicegetdevice(
  options?: Omit<UseMutationOptions<IoTDeviceEntityPaginationQuery, Error, { data: SortType[]; params?: { search?: string; typeList?: IoTDeviceType[]; statusList?: IoTDeviceStatus[]; fromTime?: string; toTime?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { search?: string; typeList?: IoTDeviceType[]; statusList?: IoTDeviceStatus[]; fromTime?: string; toTime?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiDevicegetdevice(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDevicegetsensor(
  options?: Omit<UseMutationOptions<SensorDeviceDtoPaginationQuery, Error, { data: SortType[]; params?: { search?: string; id?: string; fromTime?: string; toTime?: string; typeList?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { search?: string; id?: string; fromTime?: string; toTime?: string; typeList?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiDevicegetsensor(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDevicegetrawsensor(
  options?: Omit<UseMutationOptions<IoTSensorEntityPaginationQuery, Error, { data: SortType[]; params?: { CreateTimeFrom?: string; CreateTimeTo?: string; Types?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { CreateTimeFrom?: string; CreateTimeTo?: string; Types?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiDevicegetrawsensor(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function useGetapiDevicegetsensorbydeviceid(
  options?: Omit<UseMutationOptions<SensorDtoPaginationQuery, Error, { data: SortType[]; params?: { DeviceId: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { DeviceId: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getapiDevicegetsensorbydeviceid(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDevicegetdevicelog(
  options?: Omit<UseMutationOptions<GetDeviceLogsResponsePaginationQuery, Error, { data: SortType[]; params?: { DeviceId: string; CreateTimeFrom?: string; CreateTimeTo?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { DeviceId: string; CreateTimeFrom?: string; CreateTimeTo?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiDevicegetdevicelog(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDeviceupdatedevice(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiDeviceupdatedevice,
    ...options,
  });
}

/**
 */
export function usePostapiDeviceupdatedeviceby(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiDeviceupdatedeviceby,
    ...options,
  });
}

/**
 */
export function usePostapiDeviceupdatesensor(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: StringObjectKeyValuePair[]; params?: { SensorId?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: StringObjectKeyValuePair[]; params?: { SensorId?: string } }) => postapiDeviceupdatesensor(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiDeviceuploadexcel(
  options?: Omit<UseMutationOptions<BooleanResult, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiDeviceuploadexcel,
    ...options,
  });
}
