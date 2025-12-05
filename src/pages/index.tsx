import { CONFIG } from 'src/config-global';

import { IndexPageView } from 'src/sections/index-page';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Home - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="IoT, Production and OEE tracking dashboard - Quick access to master data, reports, dashboards, and more"
      />
      <meta name="keywords" content="iot,production,oee,tracking,dashboard,management" />

      <IndexPageView />
    </>
  );
}
