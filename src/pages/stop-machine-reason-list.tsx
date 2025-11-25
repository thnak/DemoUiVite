import { CONFIG } from 'src/config-global';

import { StopMachineReasonListView } from 'src/sections/stop-machine-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Stop Machine Reason - ${CONFIG.appName}`}</title>

      <StopMachineReasonListView />
    </>
  );
}
