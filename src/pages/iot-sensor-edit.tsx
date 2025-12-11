import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { IoTSensorCreateEditView } from 'src/sections/iot-sensor/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <title>{`Edit IoT Sensor - ${CONFIG.appName}`}</title>

      <IoTSensorCreateEditView isEdit currentSensorId={id} />
    </>
  );
}
