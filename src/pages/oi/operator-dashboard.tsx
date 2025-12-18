import { CONFIG } from 'src/config-global';

import { OperatorDashboardView } from 'src/sections/oi/dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Operator Dashboard - ${CONFIG.appName}`}</title>

      <OperatorDashboardView />
    </>
  );
}
