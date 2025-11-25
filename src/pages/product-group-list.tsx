import { CONFIG } from 'src/config-global';

import { ProductGroupListView } from 'src/sections/product-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Product Group List - ${CONFIG.appName}`}</title>

      <ProductGroupListView />
    </>
  );
}
