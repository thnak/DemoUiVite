import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  phoneCountry: string;
  country: string;
  stateRegion: string;
  city: string;
  address: string;
  zipCode: string;
  company: string;
  role: string;
}

interface Country {
  code: string;
  label: string;
  phone: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', label: 'United States', phone: '+1', flag: '🇺🇸' },
  { code: 'GB', label: 'United Kingdom', phone: '+44', flag: '🇬🇧' },
  { code: 'DE', label: 'Germany', phone: '+49', flag: '🇩🇪' },
  { code: 'FR', label: 'France', phone: '+33', flag: '🇫🇷' },
  { code: 'JP', label: 'Japan', phone: '+81', flag: '🇯🇵' },
  { code: 'CN', label: 'China', phone: '+86', flag: '🇨🇳' },
  { code: 'IN', label: 'India', phone: '+91', flag: '🇮🇳' },
  { code: 'BR', label: 'Brazil', phone: '+55', flag: '🇧🇷' },
  { code: 'CA', label: 'Canada', phone: '+1', flag: '🇨🇦' },
  { code: 'AU', label: 'Australia', phone: '+61', flag: '🇦🇺' },
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

export function CreateUserView() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    phoneCountry: 'US',
    country: '',
    stateRegion: '',
    city: '',
    address: '',
    zipCode: '',
    company: '',
    role: '',
  });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Please select a valid image file (*.jpeg, *.jpg, *.png, *.gif)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size must not exceed 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (field: keyof FormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    console.log('Creating user with data:', {
      ...formData,
      emailVerified,
      avatarUrl,
    });
  }, [formData, emailVerified, avatarUrl]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Create a new user
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            User
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Create
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Section - Avatar Upload & Email Verified */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Stack alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 144,
                  height: 144,
                  borderRadius: '50%',
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
                {avatarUrl ? (
                  <Avatar
                    src={avatarUrl}
                    alt="Avatar"
                    sx={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={0.5}>
                    <Iconify
                      icon="mingcute:add-line"
                      width={24}
                      sx={{ color: 'text.secondary' }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Upload photo
                    </Typography>
                  </Stack>
                )}
                <input
                  type="file"
                  hidden
                  accept=".jpeg,.jpg,.png,.gif"
                  onChange={handleAvatarChange}
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
              Allowed *.jpeg, *.jpg, *.png, *.gif
              <br />
              max size of 3 Mb
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Email verified
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', pr: 2 }}>
                  Disabling this will automatically send the user a verification email
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailVerified}
                      onChange={(e) => setEmailVerified(e.target.checked)}
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

        {/* Right Section - User Info Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email address"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone number"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FormControl variant="standard" sx={{ minWidth: 70 }}>
                          <Select
                            value={formData.phoneCountry}
                            onChange={handleSelectChange('phoneCountry')}
                            disableUnderline
                            sx={{
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                py: 0,
                                pr: 1,
                              },
                            }}
                          >
                            {COUNTRIES.map((country) => (
                              <MenuItem key={country.code} value={country.code}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <span style={{ fontSize: '1.25rem' }}>{country.flag}</span>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={formData.country}
                    label="Country"
                    onChange={handleSelectChange('country')}
                  >
                    {COUNTRIES.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="State/region"
                  value={formData.stateRegion}
                  onChange={handleInputChange('stateRegion')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Zip/code"
                  value={formData.zipCode}
                  onChange={handleInputChange('zipCode')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={handleInputChange('company')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Role"
                  value={formData.role}
                  onChange={handleInputChange('role')}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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
                Create user
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
