import { CONFIG } from 'src/config-global';

import { DowntimeInputView } from 'src/sections/oi/downtime-input/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Downtime Input - ${CONFIG.appName}`}</title>

      <DowntimeInputView />
    </>
  );
}
