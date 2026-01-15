import { CONFIG } from 'src/config-global';

import { WorkingParameterCreateView } from 'src/sections/working-parameter/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Working Parameter - ${CONFIG.appName}`}</title>

      <WorkingParameterCreateView />
    </>
  );
}
