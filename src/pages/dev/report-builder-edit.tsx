import { CONFIG } from 'src/config-global';

import { ReportBuilderCreateEditView } from 'src/sections/report-builder/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Report - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Edit custom report configuration"
      />

      <ReportBuilderCreateEditView />
    </>
  );
}
