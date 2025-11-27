import { CONFIG } from 'src/config-global';

import { ReportPortalView } from 'src/sections/report-portal/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Report Portal - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Report portal dashboard showcasing project cards with team progress and status tracking"
      />
      <meta name="keywords" content="react,material,dashboard,reporting,projects,demo" />

      <ReportPortalView />
    </>
  );
}
