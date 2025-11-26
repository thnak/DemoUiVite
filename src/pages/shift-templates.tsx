import { CONFIG } from 'src/config-global';

import { ShiftTemplateView } from 'src/sections/shift-template/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Shift Templates - ${CONFIG.appName}`}</title>

      <ShiftTemplateView />
    </>
  );
}
