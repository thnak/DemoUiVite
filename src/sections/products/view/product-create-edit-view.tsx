import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
}

const CATEGORIES = [
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

interface ProductCreateEditViewProps {
  isEdit?: boolean;
  currentProduct?: {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    coverUrl: string;
    publish: 'published' | 'draft';
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
    description: currentProduct?.description || '',
    category: currentProduct?.category?.toLowerCase() || '',
    price: currentProduct?.price?.toString() || '',
    stock: currentProduct?.stock?.toString() || '',
  });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Please select a valid image file (*.jpeg, *.jpg, *.png, *.gif, *.webp)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size must not exceed 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
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

  const handleSelectChange = useCallback(
    (field: keyof ProductFormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!formData.name) {
      setErrorMessage('Product name is required');
      return;
    }
    if (!formData.category) {
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

    console.log(`${isEdit ? 'Updating' : 'Creating'} product with data:`, {
      ...formData,
      published,
      imageUrl,
    });

    // Navigate back to list after save
    router.push('/products');
  }, [formData, published, imageUrl, isEdit, router]);

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
            <Stack alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 200,
                  height: 200,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    opacity: 0.72,
                  },
                }}
                component="label"
              >
                {imageUrl ? (
                  <Avatar
                    src={imageUrl}
                    alt="Product"
                    variant="rounded"
                    sx={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={0.5}>
                    <Iconify icon="mingcute:add-line" width={24} sx={{ color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Upload image
                    </Typography>
                  </Stack>
                )}
                <input
                  type="file"
                  hidden
                  accept=".jpeg,.jpg,.png,.gif,.webp"
                  onChange={handleImageChange}
                />
              </Box>
            </Stack>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                mb: 3,
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif, *.webp
              <br />
              max size of 3 Mb
            </Typography>

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
          </Card>
        </Grid>

        {/* Right Section - Product Info Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Product name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={handleSelectChange('category')}
                  >
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
          </Card>
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
