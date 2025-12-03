import { CONFIG } from 'src/config-global';

import { DefectReasonGroupCreateEditView } from 'src/sections/defect-reason-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Defect Reason Group - ${CONFIG.appName}`}</title>

      <DefectReasonGroupCreateEditView />
    </>
  );
}
