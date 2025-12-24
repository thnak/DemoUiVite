import { CONFIG } from 'src/config-global';

import { useParams } from 'src/routes/hooks';

import { ProductCategoryCreateEditView } from 'src/sections/product-category/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <title>{`Edit Product Category - ${CONFIG.appName}`}</title>

      <ProductCategoryCreateEditView isEdit productCategoryId={id} />
    </>
  );
}
