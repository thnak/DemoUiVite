import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OperatorDashboardView } from 'src/sections/oi/dashboard/view';

// ----------------------------------------------------------------------

const metadata = { title: `Operator Dashboard | OI - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OperatorDashboardView />
    </>
  );
}
