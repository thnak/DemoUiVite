import { CONFIG } from 'src/config-global';

import { SalesReportView } from 'src/sections/sales-report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sales Report - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Sales report dashboard showcasing total sales, orders, visitors, and customer analytics"
      />
      <meta name="keywords" content="react,material,dashboard,sales,report,analytics" />

      <SalesReportView />
    </>
  );
}
