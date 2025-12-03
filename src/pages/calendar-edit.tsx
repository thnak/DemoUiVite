import { CONFIG } from 'src/config-global';

import { CalendarCreateEditView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Calendar - ${CONFIG.appName}`}</title>

      <CalendarCreateEditView isEdit />
    </>
  );
}
