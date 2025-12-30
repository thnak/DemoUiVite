import { CONFIG } from 'src/config-global';

import { StopMachineReasonGroupListView } from 'src/sections/stop-machine-reason-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Stop Machine Reason Group - ${CONFIG.appName}`}</title>

      <StopMachineReasonGroupListView />
    </>
  );
}
