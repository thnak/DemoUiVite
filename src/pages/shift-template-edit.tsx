import { CONFIG } from 'src/config-global';

import { ShiftTemplateCreateEditView } from 'src/sections/shift-template/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Shift Template - ${CONFIG.appName}`}</title>

      <ShiftTemplateCreateEditView isEdit />
    </>
  );
}
