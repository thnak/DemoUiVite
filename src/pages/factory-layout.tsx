import { CONFIG } from 'src/config-global';

import { FactoryLayoutView } from 'src/sections/factory-layout/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Factory Layout 2D - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Interactive 2D factory layout visualization with areas and machines"
      />

      <FactoryLayoutView />
    </>
  );
}
