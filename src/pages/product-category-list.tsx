import { CONFIG } from 'src/config-global';

import { ProductCategoryListView } from 'src/sections/product-category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Product Category List - ${CONFIG.appName}`}</title>

      <ProductCategoryListView />
    </>
  );
}
