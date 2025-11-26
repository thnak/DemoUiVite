import { CONFIG } from 'src/config-global';

import { DemoDashboardView } from 'src/sections/demo-dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`E-commerce Dashboard Demo - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="E-commerce dashboard demo showcasing metric cards, charts, sales overview, and product listings"
      />
      <meta name="keywords" content="react,material,dashboard,ecommerce,demo,charts" />

      <DemoDashboardView />
    </>
  );
}
