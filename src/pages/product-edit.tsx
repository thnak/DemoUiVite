import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetProductById } from 'src/api/hooks/generated/use-product';

import { ProductCreateEditView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductById(id || '', {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !productData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Product not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Product - ${CONFIG.appName}`}</title>

      <ProductCreateEditView
        isEdit
        currentProduct={{
          id: productData.id?.toString() || '',
          name: productData.name || '',
          code: productData.code || '',
          categoryId: productData.productCategoryId?.toString() ?? undefined,
          price: productData.price || 0,
          stock: productData.stockQuantity || 0,
          coverUrl: productData.imageUrl || '',
          publish: productData.isDraft ? 'draft' : 'published',
          weight: productData.weight,
          dimensions: {
            length: productData.dimensions?.length,
            width: productData.dimensions?.width,
            height: productData.dimensions?.height,
          },
          unitOfMeasureId: productData.unitOfMeasureId?.toString() ?? undefined,
          secondaryUnitOfMeasureId: productData.secondaryUnitOfMeasureId?.toString() ?? undefined,
        }}
      />
    </>
  );
}
