import { CONFIG } from 'src/config-global';

import { AreaCreateEditView } from 'src/sections/area/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Area - ${CONFIG.appName}`}</title>

      <AreaCreateEditView />
    </>
  );
}
