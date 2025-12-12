import { CONFIG } from 'src/config-global';

import { UnitConversionListView } from 'src/sections/unit-conversion/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Unit Conversion List - ${CONFIG.appName}`}</title>

      <UnitConversionListView />
    </>
  );
}
