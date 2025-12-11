import { CONFIG } from 'src/config-global';

import { UnitListView } from 'src/sections/unit/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Unit List - ${CONFIG.appName}`}</title>

      <UnitListView />
    </>
  );
}
