import { CONFIG } from 'src/config-global';

import { UnitConversionCreateEditView } from 'src/sections/unit-conversion/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Unit Conversion - ${CONFIG.appName}`}</title>

      <UnitConversionCreateEditView isEdit />
    </>
  );
}
