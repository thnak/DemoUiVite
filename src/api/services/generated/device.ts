import axiosInstance from '../../axios-instance';

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
// Device Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Device API endpoints
 */
export const DEVICE_ENDPOINTS = {
  postapiDeviceaddnewdevice: '/api/Device/add-new-device',
  postapiDeviceaddnewdeviceform: '/api/Device/add-new-device-form',
  postapiDeviceaddnewsensor: '/api/Device/add-new-sensor',
  postapiDevicecreatemillionsamples: '/api/Device/create-million-samples',
  postapiDevicedeletedevice: '/api/Device/delete-device',
  postapiDevicedeletesensor: '/api/Device/delete-sensor',
  postapiDevicegetdevice: '/api/Device/get-device',
  getapiDevicecheckavailableip: '/api/Device/check-available-ip',
  getapiDevicecheckavailablemac: '/api/Device/check-available-mac',
  getapiDevicegetdevicebyiddeviceId: '/api/Device/get-device-by-id/{deviceId}',
  getapiDevicesearchdevice: '/api/Device/search-device',
  getapiDevicefindmqtttemplate: '/api/Device/find-mqtt-template',
  getapiDevicefindentitytemplate: '/api/Device/find-entity-template',
  postapiDevicegetsensor: '/api/Device/get-sensor',
  getapiDevicegeteditablesensor: '/api/Device/get-editable-sensor',
  postapiDevicegetrawsensor: '/api/Device/get-raw-sensor',
  getapiDevicegetsensorbysensorIdsensorId: '/api/Device/get-sensor-by-sensorId/{sensorId}',
  getapiDevicegetsensorbydeviceid: '/api/Device/get-sensor-by-device-id',
  getapiDevicesearchsensor: '/api/Device/search-sensor',
  postapiDevicegetdevicelog: '/api/Device/get-device-log',
  getapiDevicedownloadexceldeviceandsensor: '/api/Device/download-excel-device-and-sensor',
  postapiDeviceupdatedevice: '/api/Device/update-device',
  postapiDeviceupdatedeviceby: '/api/Device/update-device-by',
  postapiDeviceupdatesensor: '/api/Device/update-sensor',
  postapiDeviceuploadexcel: '/api/Device/upload-excel',
} as const;

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceaddnewdevice(data: RequestToCreateDto): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceaddnewdevice, data);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceaddnewdeviceform(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceaddnewdeviceform);
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceaddnewsensor(data: IoTSensorEntity): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceaddnewsensor, data);
  return response.data;
}

/**
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDevicecreatemillionsamples(data: IoTDeviceEntity[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDevicecreatemillionsamples, data);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiDevicedeletedevice(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDevicedeletedevice);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiDevicedeletesensor(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDevicedeletesensor);
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<IoTDeviceEntityPaginationQuery>
 */
export async function postapiDevicegetdevice(data: SortType[], params?: { search?: string; typeList?: IoTDeviceType[]; statusList?: IoTDeviceStatus[]; fromTime?: string; toTime?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<IoTDeviceEntityPaginationQuery> {
  const response = await axiosInstance.post<IoTDeviceEntityPaginationQuery>(DEVICE_ENDPOINTS.postapiDevicegetdevice, data, { params });
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function getapiDevicecheckavailableip(params?: { ip?: string }): Promise<BooleanResult> {
  const response = await axiosInstance.get<BooleanResult>(DEVICE_ENDPOINTS.getapiDevicecheckavailableip, { params });
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function getapiDevicecheckavailablemac(params?: { mac?: string }): Promise<BooleanResult> {
  const response = await axiosInstance.get<BooleanResult>(DEVICE_ENDPOINTS.getapiDevicecheckavailablemac, { params });
  return response.data;
}

/**
 * @returns Promise<IoTDeviceEntity>
 */
export async function getapiDevicegetdevicebyiddeviceId(deviceId: string): Promise<IoTDeviceEntity> {
  const response = await axiosInstance.get<IoTDeviceEntity>(`/api/Device/get-device-by-id/${deviceId}`);
  return response.data;
}

/**
 * @returns Promise<IoTDeviceEntity[]>
 */
export async function getapiDevicesearchdevice(params?: { search?: string; pageSize?: number }): Promise<IoTDeviceEntity[]> {
  const response = await axiosInstance.get<IoTDeviceEntity[]>(DEVICE_ENDPOINTS.getapiDevicesearchdevice, { params });
  return response.data;
}

/**
 * @returns Promise<DataSource[]>
 */
export async function getapiDevicefindmqtttemplate(params?: { device?: string; template?: string; limit?: number }): Promise<DataSource[]> {
  const response = await axiosInstance.get<DataSource[]>(DEVICE_ENDPOINTS.getapiDevicefindmqtttemplate, { params });
  return response.data;
}

/**
 * @returns Promise<IoTDeviceEntityEntityLogEntity[]>
 */
export async function getapiDevicefindentitytemplate(params?: { logId?: string }): Promise<IoTDeviceEntityEntityLogEntity[]> {
  const response = await axiosInstance.get<IoTDeviceEntityEntityLogEntity[]>(DEVICE_ENDPOINTS.getapiDevicefindentitytemplate, { params });
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SensorDeviceDtoPaginationQuery>
 */
export async function postapiDevicegetsensor(data: SortType[], params?: { search?: string; id?: string; fromTime?: string; toTime?: string; typeList?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<SensorDeviceDtoPaginationQuery> {
  const response = await axiosInstance.post<SensorDeviceDtoPaginationQuery>(DEVICE_ENDPOINTS.postapiDevicegetsensor, data, { params });
  return response.data;
}

/**
 * @returns Promise<StringObjectKeyValuePair[]>
 */
export async function getapiDevicegeteditablesensor(params?: { id?: string }): Promise<StringObjectKeyValuePair[]> {
  const response = await axiosInstance.get<StringObjectKeyValuePair[]>(DEVICE_ENDPOINTS.getapiDevicegeteditablesensor, { params });
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<IoTSensorEntityPaginationQuery>
 */
export async function postapiDevicegetrawsensor(data: SortType[], params?: { CreateTimeFrom?: string; CreateTimeTo?: string; Types?: IoTSensorType[]; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<IoTSensorEntityPaginationQuery> {
  const response = await axiosInstance.post<IoTSensorEntityPaginationQuery>(DEVICE_ENDPOINTS.postapiDevicegetrawsensor, data, { params });
  return response.data;
}

/**
 * @returns Promise<GetSensorEntityByIdDto>
 */
export async function getapiDevicegetsensorbysensorIdsensorId(sensorId: string): Promise<GetSensorEntityByIdDto> {
  const response = await axiosInstance.get<GetSensorEntityByIdDto>(`/api/Device/get-sensor-by-sensorId/${sensorId}`);
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SensorDtoPaginationQuery>
 */
export async function getapiDevicegetsensorbydeviceid(data: SortType[], params?: { DeviceId: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<SensorDtoPaginationQuery> {
  const response = await axiosInstance.get<SensorDtoPaginationQuery>(DEVICE_ENDPOINTS.getapiDevicegetsensorbydeviceid, { data, params });
  return response.data;
}

/**
 * @returns Promise<SensorDto[]>
 */
export async function getapiDevicesearchsensor(params?: { search?: string; pageSize?: number }): Promise<SensorDto[]> {
  const response = await axiosInstance.get<SensorDto[]>(DEVICE_ENDPOINTS.getapiDevicesearchsensor, { params });
  return response.data;
}

/**
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<GetDeviceLogsResponsePaginationQuery>
 */
export async function postapiDevicegetdevicelog(data: SortType[], params?: { DeviceId: string; CreateTimeFrom?: string; CreateTimeTo?: string; pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<GetDeviceLogsResponsePaginationQuery> {
  const response = await axiosInstance.post<GetDeviceLogsResponsePaginationQuery>(DEVICE_ENDPOINTS.postapiDevicegetdevicelog, data, { params });
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function getapiDevicedownloadexceldeviceandsensor(): Promise<void> {
  await axiosInstance.get(DEVICE_ENDPOINTS.getapiDevicedownloadexceldeviceandsensor);
}

/**
 *
 * Update a device
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceupdatedevice(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceupdatedevice);
  return response.data;
}

/**
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceupdatedeviceby(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceupdatedeviceby);
  return response.data;
}

/**
 *
 * Update a sensor
 * @param SensorId - The ID of the sensor to be updated
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceupdatesensor(data: StringObjectKeyValuePair[], params?: { SensorId?: string }): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceupdatesensor, data, { params });
  return response.data;
}

/**
 *
 * Upload an excel file to import devices and sensors
 * @returns Promise<BooleanResult>
 */
export async function postapiDeviceuploadexcel(): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(DEVICE_ENDPOINTS.postapiDeviceuploadexcel);
  return response.data;
}
