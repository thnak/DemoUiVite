import { CONFIG } from 'src/config-global';

import { ReportBuilderListView } from 'src/sections/report-builder/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Report Builder - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Build and manage custom reports with advanced query capabilities"
      />

      <ReportBuilderListView />
    </>
  );
}
