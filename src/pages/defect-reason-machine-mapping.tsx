import { CONFIG } from 'src/config-global';

import { DefectReasonMachineMappingView } from 'src/sections/defect-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Mapping - ${CONFIG.appName}`}</title>

      <DefectReasonMachineMappingView />
    </>
  );
}
