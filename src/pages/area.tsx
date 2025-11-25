import { CONFIG } from 'src/config-global';

import { AreaView } from 'src/sections/area/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Areas - ${CONFIG.appName}`}</title>

      <AreaView />
    </>
  );
}
