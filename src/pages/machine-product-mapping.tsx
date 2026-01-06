import { CONFIG } from 'src/config-global';

import { MachineProductMappingView } from 'src/sections/machine/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Product Mapping - ${CONFIG.appName}`}</title>

      <MachineProductMappingView />
    </>
  );
}
