import { CONFIG } from 'src/config-global';

import {
  WorkingParameterCreateEditView,
} from 'src/sections/working-parameter/view/working-parameter-edit-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Machine - ${CONFIG.appName}`}</title>

      <WorkingParameterCreateEditView />
    </>
  );
}