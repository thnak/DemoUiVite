import { CONFIG } from 'src/config-global';

import { DeviceTrackingView } from 'src/sections/iot-device/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`IoT Device Tracking - ${CONFIG.appName}`}</title>

      <DeviceTrackingView />
    </>
  );
}
