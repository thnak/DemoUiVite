import { CONFIG } from 'src/config-global';

import { MachineOperationView } from 'src/sections/oi/machine-operation/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Operation - ${CONFIG.appName}`}</title>
      <meta name="description" content="Machine operation dashboard" />

      <MachineOperationView />
    </>
  );
}
