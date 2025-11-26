import { CONFIG } from 'src/config-global';

import { DowntimeReportView } from 'src/sections/downtime-report/view';

// ----------------------------------------------------------------------

export default function DowntimeReportPage() {
  return (
    <>
      <title>{`Downtime Report - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Industrial downtime analysis report with metrics, Pareto charts, and timeline views"
      />

      <DowntimeReportView />
    </>
  );
}
