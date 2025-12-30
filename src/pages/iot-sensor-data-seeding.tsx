import { useParams, useSearchParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { IoTSensorDataSeedingView } from 'src/sections/iot-sensor/view/iot-sensor-data-seeding-view';

// ----------------------------------------------------------------------

export default function IoTSensorDataSeedingPage() {
  const { deviceId, sensorId } = useParams();
  const [searchParams] = useSearchParams();

  const deviceCode = searchParams.get('deviceCode') || undefined;
  const sensorCode = searchParams.get('sensorCode') || undefined;

  return (
    <>
      <title>{`Sensor Data Seeding - ${CONFIG.appName}`}</title>

      <IoTSensorDataSeedingView
        deviceId={deviceId!}
        sensorId={sensorId!}
        deviceCode={deviceCode}
        sensorCode={sensorCode}
      />
    </>
  );
}
