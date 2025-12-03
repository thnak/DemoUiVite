import { CONFIG } from 'src/config-global';

import { DefectReasonGroupView } from 'src/sections/defect-reason-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Defect Reason Groups - ${CONFIG.appName}`}</title>

      <DefectReasonGroupView />
    </>
  );
}
