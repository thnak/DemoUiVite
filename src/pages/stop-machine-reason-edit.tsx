import { CONFIG } from 'src/config-global';

import { StopMachineReasonCreateEditView } from 'src/sections/stop-machine-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Stop Machine Reason - ${CONFIG.appName}`}</title>

      <StopMachineReasonCreateEditView isEdit />
    </>
  );
}
