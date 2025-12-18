import { CONFIG } from 'src/config-global';

import { DefectInputView } from 'src/sections/oi/defect-input/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Defect Input - ${CONFIG.appName}`}</title>

      <DefectInputView />
    </>
  );
}
