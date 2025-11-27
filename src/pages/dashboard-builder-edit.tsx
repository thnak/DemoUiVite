import { CONFIG } from 'src/config-global';

import { DashboardBuilderView } from 'src/sections/dashboard-builder/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard Editor - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Create and edit dashboards with drag-and-drop widgets"
      />
      <meta name="keywords" content="react,material,dashboard,builder,editor,widgets" />

      <DashboardBuilderView />
    </>
  );
}
