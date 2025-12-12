import { CONFIG } from 'src/config-global';

import { UnitGroupListView } from 'src/sections/unit-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Unit Group List - ${CONFIG.appName}`}</title>

      <UnitGroupListView />
    </>
  );
}
