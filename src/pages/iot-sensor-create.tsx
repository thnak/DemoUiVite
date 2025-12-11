import { CONFIG } from 'src/config-global';

import { IoTSensorCreateEditView } from 'src/sections/iot-sensor/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create IoT Sensor - ${CONFIG.appName}`}</title>

      <IoTSensorCreateEditView />
    </>
  );
}
