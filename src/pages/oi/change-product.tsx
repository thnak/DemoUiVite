import { CONFIG } from 'src/config-global';

import { ChangeProductView } from 'src/sections/oi/change-product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Change Product - ${CONFIG.appName}`}</title>

      <ChangeProductView />
    </>
  );
}
