import { CONFIG } from 'src/config-global';

import { ReportView } from 'src/sections/report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Factory Report - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Factory-wide OEE metrics, performance indicators, and 2D facility layout visualization"
      />

      <ReportView />
    </>
  );
}
