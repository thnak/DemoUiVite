import { CONFIG } from 'src/config-global';

import { FileDashboardView } from 'src/sections/file-dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`File Dashboard Demo - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="File dashboard demo showcasing storage providers, data activity charts, folders, and recent files"
      />
      <meta name="keywords" content="react,material,dashboard,file,storage,demo" />

      <FileDashboardView />
    </>
  );
}
