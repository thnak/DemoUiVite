import { CONFIG } from 'src/config-global';

import { StopMachineReasonMachineMappingView } from 'src/sections/stop-machine-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Mapping - ${CONFIG.appName}`}</title>

      <StopMachineReasonMachineMappingView />
    </>
  );
}
