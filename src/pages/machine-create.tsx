import { CONFIG } from 'src/config-global';

import { MachineCreateEditView } from 'src/sections/machine/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Machine - ${CONFIG.appName}`}</title>

      <MachineCreateEditView />
    </>
  );
}
