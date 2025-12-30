import { CONFIG } from 'src/config-global';

import { StopMachineReasonGroupCreateEditView } from 'src/sections/stop-machine-reason-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Stop Machine Reason Group - ${CONFIG.appName}`}</title>

      <StopMachineReasonGroupCreateEditView isEdit={false} />
    </>
  );
}
