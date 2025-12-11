import { CONFIG } from 'src/config-global';

import { MachineTypeView } from 'src/sections/machine-type/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Types - ${CONFIG.appName}`}</title>

      <MachineTypeView />
    </>
  );
}
