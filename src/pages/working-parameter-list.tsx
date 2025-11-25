import { CONFIG } from 'src/config-global';

import { WorkingParameterListView } from 'src/sections/working-parameter/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Working Parameter List - ${CONFIG.appName}`}</title>

      <WorkingParameterListView />
    </>
  );
}
