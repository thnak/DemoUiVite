import { CONFIG } from 'src/config-global';

import { UnitGroupCreateEditView } from 'src/sections/unit-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Unit Group - ${CONFIG.appName}`}</title>

      <UnitGroupCreateEditView isEdit />
    </>
  );
}
