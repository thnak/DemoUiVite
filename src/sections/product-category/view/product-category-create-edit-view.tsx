import { useState, useCallback, useEffect, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateProductCategory,
  useUpdateProductCategory,
  useGetProductCategoryById,
  useGenerateNewProductCategoryCode,
} from 'src/api/hooks/generated/use-product-category';

import type { ProductCategoryEntity } from 'src/api/types/generated';

// ----------------------------------------------------------------------

interface ProductCategoryFormData {
  code: string;
  name: string;
  description: string;
}

interface ProductCategoryCreateEditViewProps {
  isEdit?: boolean;
  productCategoryId?: string;
}

export function ProductCategoryCreateEditView({
  isEdit = false,
  productCategoryId,
}: ProductCategoryCreateEditViewProps) {
  const router = useRouter();

  // Use ValidationResult hook for form validation
  const {
    setValidationResult,
    clearValidationResult,
    getFieldErrorMessage,
    hasError,
    clearFieldError,
    overallMessage,
  } = useValidationResult();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductCategoryFormData>({
    code: '',
    name: '',
    description: '',
  });

  // Fetch existing product category data when editing
  const { data: currentProductCategory, isLoading: isLoadingData } = useGetProductCategoryById(
    productCategoryId || '',
    {
      enabled: isEdit && !!productCategoryId,
    }
  );

  // Generate new code when creating
  const { data: generatedCode } = useGenerateNewProductCategoryCode({
    enabled: !isEdit,
  });

  useEffect(() => {
    if (isEdit && currentProductCategory) {
      setFormData({
        code: currentProductCategory.code || '',
        name: currentProductCategory.name || '',
        description: currentProductCategory.description || '',
      });
    } else if (!isEdit && generatedCode) {
      setFormData((prev) => ({
        ...prev,
        code: generatedCode,
      }));
    }
  }, [isEdit, currentProductCategory, generatedCode]);

  const { mutate: createProductCategoryMutate, isPending: isCreating } = useCreateProductCategory({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/product-categories');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create product category');
    },
  });

  const { mutate: updateProductCategoryMutate, isPending: isUpdating } = useUpdateProductCategory({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/product-categories');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update product category');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof ProductCategoryFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleSubmit = useCallback(() => {
    clearValidationResult();

    if (isEdit && productCategoryId) {
      const updates = [
        { key: 'code', value: formData.code },
        { key: 'name', value: formData.name },
        { key: 'description', value: formData.description },
      ];
      updateProductCategoryMutate({ id: productCategoryId, data: updates });
    } else {
      const productCategoryData: ProductCategoryEntity = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
      };
      createProductCategoryMutate({ data: productCategoryData });
    }
  }, [
    isEdit,
    productCategoryId,
    formData,
    clearValidationResult,
    createProductCategoryMutate,
    updateProductCategoryMutate,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/product-categories');
  }, [router]);

  if (isLoadingData) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* Page Header with Breadcrumbs */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit product category' : 'Create a new product category'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Product Category
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      {/* Overall error message */}
      {overallMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {overallMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Right Section - Form */}
        <Grid size={{ xs: 12 }}>
          <Stack spacing={3}>
            {/* Main form card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Product Category Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Code"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                    error={hasError('code')}
                    helperText={getFieldErrorMessage('code')}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={hasError('name')}
                    helperText={getFieldErrorMessage('name')}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    error={hasError('description')}
                    helperText={getFieldErrorMessage('description')}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Action buttons at the bottom */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isEdit ? 'Save Changes' : 'Create'}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
