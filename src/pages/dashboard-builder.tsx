import { CONFIG } from 'src/config-global';

import { DashboardListView } from 'src/sections/dashboard-builder/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard Builder - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="No-code dashboard builder with drag-and-drop widgets and grid management"
      />
      <meta name="keywords" content="react,material,dashboard,builder,no-code,widgets" />

      <DashboardListView />
    </>
  );
}
