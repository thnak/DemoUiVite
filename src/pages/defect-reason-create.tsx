import { CONFIG } from 'src/config-global';

import { DefectReasonCreateEditView } from 'src/sections/defect-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Defect Reason - ${CONFIG.appName}`}</title>

      <DefectReasonCreateEditView />
    </>
  );
}
