import { CONFIG } from 'src/config-global';

import { UnitCreateEditView } from 'src/sections/unit/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Unit - ${CONFIG.appName}`}</title>

      <UnitCreateEditView isEdit />
    </>
  );
}
