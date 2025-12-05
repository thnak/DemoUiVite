import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import type { ViewMode, ModuleItem } from '../types';

// ----------------------------------------------------------------------

type Props = {
  modules: ModuleItem[];
  viewMode: ViewMode;
};

export function IndexDesign4({ modules, viewMode }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  if (viewMode === 'list') {
    return (
      <Box>
        {/* Hero section */}
        <Box
          sx={{
            mb: 5,
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: 'common.white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontFamily: '"DM Sans Variable", sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            IoT & Production Hub
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 500 }}>
            Manage your production floor, monitor devices, and track performance metrics all in one
            place.
          </Typography>

          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.1),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              right: 100,
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.05),
            }}
          />
        </Box>

        {/* List view */}
        <Stack spacing={1}>
          {modules.map((module) => (
            <ButtonBase
              key={module.id}
              onClick={() => handleClick(module.path)}
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  bgcolor: module.color === 'primary' ? 'primary.lighter' : 'secondary.lighter',
                }}
              >
                <Iconify
                  icon={module.icon}
                  width={24}
                  sx={{
                    color: module.color === 'primary' ? 'primary.dark' : 'secondary.dark',
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {module.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {module.subtitle}
                </Typography>
              </Box>
            </ButtonBase>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          mb: 6,
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'common.white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              mb: 1.5,
              fontFamily: '"DM Sans Variable", sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            IoT & Production
            <br />
            Command Center
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.85,
              maxWidth: 550,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Centralized management for your production floor, IoT devices, and OEE tracking.
          </Typography>
        </Box>

        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.common.white, 0.08),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            right: 150,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.common.white, 0.04),
          }}
        />
        <Iconify
          icon="solar:factory-bold-duotone"
          width={120}
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 40,
            opacity: 0.15,
            display: { xs: 'none', md: 'block' },
          }}
        />
      </Box>

      {/* Grid view */}
      <Grid container spacing={2.5}>
        {modules.map((module) => (
          <Grid key={module.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <ButtonBase
              onClick={() => handleClick(module.path)}
              sx={{
                width: '100%',
                p: 3,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 1.5,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha(
                    module.color === 'primary'
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                    0.04
                  ),
                  borderColor: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customShadows.z8,
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  bgcolor: module.color === 'primary' ? 'primary.lighter' : 'secondary.lighter',
                }}
              >
                <Iconify
                  icon={module.icon}
                  width={32}
                  sx={{
                    color: module.color === 'primary' ? 'primary.dark' : 'secondary.dark',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.25,
                  }}
                >
                  {module.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    lineHeight: 1.4,
                  }}
                >
                  {module.subtitle}
                </Typography>
              </Box>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
