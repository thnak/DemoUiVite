import { CONFIG } from 'src/config-global';

import { ProductCategoryCreateEditView } from 'src/sections/product-category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Product Category - ${CONFIG.appName}`}</title>

      <ProductCategoryCreateEditView />
    </>
  );
}
