import { MuiColorInput } from 'mui-color-input';
import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { UnitSelector } from 'src/components/selectors/unit-selector';
import { ImageEntityResourceUploader } from 'src/components/image-entity-resource-uploader';
import { ProductCategorySelector } from 'src/components/selectors/product-category-selector';

import { createProduct, updateProduct } from '../../../api';

// ----------------------------------------------------------------------

interface ProductFormData {
  name: string;
  code: string;
  categoryId: string | null;
  price: string;
  stock: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  unitOfMeasureId: string | null;
  secondaryUnitOfMeasureId: string | null;
  colorHex: string;
}

interface ProductCreateEditViewProps {
  isEdit?: boolean;
  currentProduct?: {
    id: string;
    name: string;
    code: string;
    categoryId?: string;
    price: number;
    stock: number;
    coverUrl: string;
    publish: 'published' | 'draft';
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    unitOfMeasureId?: string;
    secondaryUnitOfMeasureId?: string;
    colorHex?: string;
  };
}

export function ProductCreateEditView({
  isEdit = false,
  currentProduct,
}: ProductCreateEditViewProps) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(currentProduct?.coverUrl || null);
  const [published, setPublished] = useState(currentProduct?.publish === 'published');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: currentProduct?.name || '',
    code: currentProduct?.code || '',
    categoryId: currentProduct?.categoryId || null,
    price: currentProduct?.price?.toString() ?? '',
    stock: currentProduct?.stock?.toString() ?? '',
    weight: currentProduct?.weight?.toString() ?? '',
    length: currentProduct?.dimensions?.length?.toString() ?? '',
    width: currentProduct?.dimensions?.width?.toString() ?? '',
    height: currentProduct?.dimensions?.height?.toString() ?? '',
    unitOfMeasureId: currentProduct?.unitOfMeasureId || null,
    secondaryUnitOfMeasureId: currentProduct?.secondaryUnitOfMeasureId || null,
    colorHex: currentProduct?.colorHex || '#1976d2',
  });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleImageUrlChange = useCallback((url: string) => {
    setImageUrl(url);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof ProductFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleCategoryChange = useCallback((value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  }, []);

  const handleUnitChange = useCallback(
    (field: 'unitOfMeasureId' | 'secondaryUnitOfMeasureId') => (value: string | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleColorChange = useCallback((newColor: string) => {
    setFormData((prev) => ({
      ...prev,
      colorHex: newColor,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name) {
      setErrorMessage('Product name is required');
      return;
    }
    if (!formData.categoryId) {
      setErrorMessage('Category is required');
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      setErrorMessage('Valid price is required');
      return;
    }
    if (!formData.stock || isNaN(parseInt(formData.stock, 10))) {
      setErrorMessage('Valid stock quantity is required');
      return;
    }
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const weight = formData.weight ? Number(formData.weight) : undefined;
    const length = formData.length ? Number(formData.length) : undefined;
    const width = formData.width ? Number(formData.width) : undefined;
    const height = formData.height ? Number(formData.height) : undefined;

    if (!Number.isFinite(price) || price < 0) {
      setErrorMessage('Valid price is required');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setErrorMessage('Valid stock quantity is required');
      return;
    }
    if (weight !== undefined && (!Number.isFinite(weight) || weight < 0)) {
      setErrorMessage('Valid weight is required');
      return;
    }
    try {
      if (isEdit && currentProduct?.id) {
        const updates = [
          { key: 'name', value: formData.name },
          { key: 'code', value: formData.code },
          { key: 'price', value: formData.price },
          { key: 'stock', value: formData.stock },
        ];
        if (formData.categoryId) {
          updates.push({ key: 'productCategoryId', value: formData.categoryId });
        }
        if (weight !== undefined) {
          updates.push({ key: 'weight', value: weight.toString() });
        }
        if (length !== undefined || width !== undefined || height !== undefined) {
          updates.push({
            key: 'dimensions',
            value: JSON.stringify({ length, width, height }),
          });
        }
        if (formData.unitOfMeasureId) {
          updates.push({ key: 'unitOfMeasureId', value: formData.unitOfMeasureId });
        }
        if (formData.secondaryUnitOfMeasureId) {
          updates.push({
            key: 'secondaryUnitOfMeasureId',
            value: formData.secondaryUnitOfMeasureId,
          });
        }
        if (imageUrl !== null) {
          updates.push({ key: 'imageUrl', value: imageUrl });
        }
        updates.push({ key: 'isDraft', value: (!published).toString() });
        updates.push({ key: 'colorHex', value: formData.colorHex });
        await updateProduct(currentProduct.id, updates);
      } else {
        const dimensions =
          length !== undefined || width !== undefined || height !== undefined
            ? { length, width, height }
            : undefined;
        await createProduct({
          name: formData.name,
          code: formData.code,
          price: Number(formData.price),
          stockQuantity: Number(formData.stock),
          weight,
          dimensions,
          productCategoryId: formData.categoryId || undefined,
          unitOfMeasureId: formData.unitOfMeasureId || undefined,
          secondaryUnitOfMeasureId: formData.secondaryUnitOfMeasureId || undefined,
          imageUrl: imageUrl || undefined,
          isDraft: !published,
          colorHex: formData.colorHex,
          // Add description as empty string to satisfy required field
          description: '',
          isActive: true,
        } as any); // Cast to any to bypass strict type checking for required fields
      }
      router.push('/products');
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'Something went wrong');
    }

    // Navigate back to list after save
  }, [formData, isEdit, currentProduct, router, imageUrl, published]);

  const handleCancel = useCallback(() => {
    router.push('/products');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit product' : 'Create a new product'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Product
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {/* Left Section - Image Upload & Publish */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Product Image
            </Typography>
            <ImageEntityResourceUploader
              imageUrl={imageUrl || ''}
              onImageUrlChange={handleImageUrlChange}
              aspectRatio={1}
              previewSize={300}
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Publish
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', pr: 2 }}>
                  {published ? 'Product is visible on store' : 'Product is saved as draft'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      color="success"
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Product Color
              </Typography>
              <MuiColorInput
                fullWidth
                format="hex"
                value={formData.colorHex}
                onChange={handleColorChange}
              />
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: formData.colorHex,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 60,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    fontWeight: 'medium',
                  }}
                >
                  Preview: {formData.name || 'Product Name'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Section - Product Info Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Product Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Product code"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Product name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProductCategorySelector
                    label="Category"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Stock"
                    value={formData.stock}
                    onChange={handleInputChange('stock')}
                    slotProps={{
                      input: {
                        inputProps: { min: 0 },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price"
                    value={formData.price}
                    onChange={handleInputChange('price')}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Weight (kg)"
                    value={formData.weight}
                    onChange={handleInputChange('weight')}
                    slotProps={{
                      input: {
                        inputProps: { min: 0, step: 0.01 },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Dimensions
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Length"
                    value={formData.length}
                    onChange={handleInputChange('length')}
                    slotProps={{
                      input: {
                        inputProps: { min: 0, step: 0.01 },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Width"
                    value={formData.width}
                    onChange={handleInputChange('width')}
                    slotProps={{
                      input: {
                        inputProps: { min: 0, step: 0.01 },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Height"
                    value={formData.height}
                    onChange={handleInputChange('height')}
                    slotProps={{
                      input: {
                        inputProps: { min: 0, step: 0.01 },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Units of Measure
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <UnitSelector
                    label="Unit of Measure"
                    value={formData.unitOfMeasureId}
                    onChange={handleUnitChange('unitOfMeasureId')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <UnitSelector
                    label="Secondary Unit of Measure"
                    value={formData.secondaryUnitOfMeasureId}
                    onChange={handleUnitChange('secondaryUnitOfMeasureId')}
                  />
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" color="inherit" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleSubmit}
                sx={{
                  bgcolor: 'grey.900',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'grey.800',
                  },
                }}
              >
                {isEdit ? 'Save changes' : 'Create product'}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
