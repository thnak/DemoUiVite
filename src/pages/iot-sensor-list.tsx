import { CONFIG } from 'src/config-global';

import { IoTSensorView } from 'src/sections/iot-sensor/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`IoT Sensors - ${CONFIG.appName}`}</title>

      <IoTSensorView />
    </>
  );
}
