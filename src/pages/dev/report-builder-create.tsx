import { CONFIG } from 'src/config-global';

import { ReportBuilderCreateEditView } from 'src/sections/report-builder/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Report - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Create a new custom report with advanced query builder"
      />

      <ReportBuilderCreateEditView />
    </>
  );
}
