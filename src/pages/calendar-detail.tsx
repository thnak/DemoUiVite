import { CONFIG } from 'src/config-global';

import { CalendarDetailView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Calendar Details - ${CONFIG.appName}`}</title>

      <CalendarDetailView />
    </>
  );
}
