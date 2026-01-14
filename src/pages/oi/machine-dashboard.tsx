import { CONFIG } from 'src/config-global';

import { MachineDashboardView } from 'src/sections/oi/machine-dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Machine Dashboard - ${CONFIG.appName}`}</title>
      <meta name="description" content="Real-time machine monitoring dashboard" />

      <MachineDashboardView />
    </>
  );
}
