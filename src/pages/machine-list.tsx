import { CONFIG } from 'src/config-global';

import { MachineView } from 'src/sections/machine/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machines - ${CONFIG.appName}`}</title>

      <MachineView />
    </>
  );
}
