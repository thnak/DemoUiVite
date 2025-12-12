import { CONFIG } from 'src/config-global';

import { OEESummaryReportView } from 'src/sections/oee-summary-report/view';

// ----------------------------------------------------------------------

export default function OEESummaryReportPage() {
  return (
    <>
      <title>{`OEE Summary Report - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Overall Equipment Effectiveness summary report with metrics, trends, and detailed analysis"
      />

      <OEESummaryReportView />
    </>
  );
}
