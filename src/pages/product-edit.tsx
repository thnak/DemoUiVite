import { useParams } from 'react-router-dom';

import { _products } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { ProductCreateEditView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const currentProduct = _products.find((product) => product.id === id);

  return (
    <>
      <title>{`Edit Product - ${CONFIG.appName}`}</title>

      <ProductCreateEditView
        isEdit
        currentProduct={
          currentProduct
            ? {
                id: currentProduct.id,
                name: currentProduct.name,
                code: currentProduct.code,
                category: currentProduct.category,
                price: currentProduct.price,
                stock: currentProduct.stock,
                coverUrl: currentProduct.coverUrl,
                publish: currentProduct.publish,
              }
            : undefined
        }
      />
    </>
  );
}
