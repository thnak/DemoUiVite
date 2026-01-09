import { CONFIG } from 'src/config-global';

import { MachineSelectionView } from 'src/sections/oi/machine-selection/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Selection - ${CONFIG.appName}`}</title>
      <meta name="description" content="Select a machine to operate" />

      <MachineSelectionView />
    </>
  );
}
