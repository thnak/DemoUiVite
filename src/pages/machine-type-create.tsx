import { CONFIG } from 'src/config-global';

import { MachineTypeCreateEditView } from 'src/sections/machine-type/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Machine Type - ${CONFIG.appName}`}</title>

      <MachineTypeCreateEditView />
    </>
  );
}
