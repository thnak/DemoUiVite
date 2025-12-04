import { CONFIG } from 'src/config-global';

import { IoTDeviceCreateEditView } from 'src/sections/iot-device/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create IoT Device - ${CONFIG.appName}`}</title>

      <IoTDeviceCreateEditView />
    </>
  );
}
