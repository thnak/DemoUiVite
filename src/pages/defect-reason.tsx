import { CONFIG } from 'src/config-global';

import { DefectReasonView } from 'src/sections/defect-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Defect Reasons - ${CONFIG.appName}`}</title>

      <DefectReasonView />
    </>
  );
}
