import { CONFIG } from 'src/config-global';

import { ProductCreateEditView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Product - ${CONFIG.appName}`}</title>

      <ProductCreateEditView />
    </>
  );
}
