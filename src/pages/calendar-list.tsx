import { CONFIG } from 'src/config-global';

import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Calendars - ${CONFIG.appName}`}</title>

      <CalendarView />
    </>
  );
}
