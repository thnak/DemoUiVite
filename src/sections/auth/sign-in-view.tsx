import type { ChangeEvent } from 'react';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useGenerateToken } from 'src/api/hooks/use-auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: generateToken, isPending } = useGenerateToken({
    onSuccess: (result) => {
      if (result.isSuccess && result.value) {
        // Store tokens in localStorage
        if (result.value.accessToken) {
          localStorage.setItem('accessToken', result.value.accessToken);
        }
        if (result.value.refreshToken) {
          localStorage.setItem('refreshToken', result.value.refreshToken);
        }
        // Redirect to home page
        router.push('/');
      } else {
        // Handle unsuccessful response
        setErrorMessage(result.message || 'Login failed. Please try again.');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'An error occurred during login. Please try again.');
    },
  });

  const handleChange = (field: keyof typeof formData) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSignIn = () => {
    // Validate form
    if (!formData.username.trim()) {
      setErrorMessage('Username is required');
      return;
    }
    if (!formData.password.trim()) {
      setErrorMessage('Password is required');
      return;
    }

    // Call API to generate token
    generateToken({
      username: formData.username,
      password: formData.password,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSignIn();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        Sign in to your account
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Don&apos;t have an account?{' '}
        <Link variant="subtitle2" sx={{ ml: 0.5 }}>
          Get started
        </Link>
      </Typography>

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        name="username"
        label="Username"
        value={formData.username}
        onChange={handleChange('username')}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        autoComplete="username"
      />
      <TextField
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange('password')}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Link variant="body2" color="inherit" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        loading={isPending}
      >
        Sign in
      </LoadingButton>
    </Box>
  );
}
