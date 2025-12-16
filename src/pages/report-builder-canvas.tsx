import { CONFIG } from 'src/config-global';

import { ReportBuilderCanvasView } from 'src/sections/report-builder/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Report Builder - ${CONFIG.appName}`}</title>

      <ReportBuilderCanvasView />
    </>
  );
}
