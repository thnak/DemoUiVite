import { CONFIG } from 'src/config-global';

import { IoTDeviceView } from 'src/sections/iot-device/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`IoT Devices - ${CONFIG.appName}`}</title>

      <IoTDeviceView />
    </>
  );
}
