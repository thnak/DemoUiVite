import { CONFIG } from 'src/config-global';

import { MachineOEEView } from 'src/sections/machine-oee/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine OEE Dashboard - ${CONFIG.appName}`}</title>

      <MachineOEEView />
    </>
  );
}
