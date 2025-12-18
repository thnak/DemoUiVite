import { CONFIG } from 'src/config-global';

import { MachineTrackingView } from 'src/sections/machine/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Tracking - ${CONFIG.appName}`}</title>

      <MachineTrackingView />
    </>
  );
}
