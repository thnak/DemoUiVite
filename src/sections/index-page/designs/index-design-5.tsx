import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import type { ViewMode, ModuleItem } from '../types';

// ----------------------------------------------------------------------

type Props = {
  modules: ModuleItem[];
  viewMode: ViewMode;
};

const CATEGORIES = [
  { key: 'operations', label: 'Operations', items: ['operation-interface', 'machine'] },
  {
    key: 'management',
    label: 'Management',
    items: ['master-data', 'device-management', 'user-management'],
  },
  { key: 'analytics', label: 'Analytics', items: ['report', 'dashboard'] },
  { key: 'monitoring', label: 'Monitoring', items: ['alert-management'] },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function IndexDesign5({ modules, viewMode }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  const getCategoryModules = (category: (typeof CATEGORIES)[0]) =>
    modules.filter((m) => category.items.includes(m.id));

  if (viewMode === 'list') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Stack spacing={4}>
          {CATEGORIES.map((category) => {
            const categoryModules = getCategoryModules(category);
            if (categoryModules.length === 0) return null;

          return (
            <motion.div key={category.key} variants={categoryVariants}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    mb: 2,
                    px: 1,
                    color: 'text.secondary',
                    letterSpacing: 1.5,
                }}
              >
                {category.label}
              </Typography>

              <Stack spacing={1}>
                {categoryModules.map((module) => (
                  <Card
                    key={module.id}
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: theme.customShadows.z4,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleClick(module.path)}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Iconify
                        icon={module.icon}
                        width={24}
                        sx={{
                          color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {module.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={category.label}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: 11,
                          bgcolor: alpha(theme.palette.text.primary, 0.06),
                        }}
                      />
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </Box>
          </motion.div>
          );
        })}
      </Stack>
    </motion.div>
    );
  }

  return (
    <Grid container spacing={4}>
      {/* Sidebar-like category navigation */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Box
          sx={{
            position: { md: 'sticky' },
            top: { md: 100 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontFamily: '"DM Sans Variable", sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            Quick Access
          </Typography>

          <Stack spacing={0.5}>
            {CATEGORIES.map((category) => (
              <Box
                key={category.key}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor:
                        category.key === 'operations'
                          ? 'success.main'
                          : category.key === 'management'
                            ? 'primary.main'
                            : category.key === 'analytics'
                              ? 'info.main'
                              : 'warning.main',
                    }}
                  />
                  {category.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Stats card */}
          <Card
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <Typography variant="subtitle2" color="primary.main" fontWeight={600} sx={{ mb: 1 }}>
              System Status
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                All systems operational
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Grid>

      {/* Main content grid */}
      <Grid size={{ xs: 12, md: 9 }}>
        <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          {modules.map((module, index) => (
            <Grid key={module.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    boxShadow: 'none',
                    position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor:
                      module.color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    boxShadow: theme.customShadows.z12,
                    '& .module-number': {
                      opacity: 0.15,
                    },
                  },
                }}
              >
                {/* Background number */}
                <Typography
                  className="module-number"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: 10,
                    fontSize: 100,
                    fontWeight: 900,
                    opacity: 0.04,
                    lineHeight: 1,
                    transition: 'opacity 0.3s ease',
                    fontFamily: '"DM Sans Variable", sans-serif',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>

                <CardActionArea
                  onClick={() => handleClick(module.path)}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      bgcolor: alpha(
                        module.color === 'primary'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                        0.1
                      ),
                    }}
                  >
                    <Iconify
                      icon={module.icon}
                      width={28}
                      sx={{
                        color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.subtitle}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                        fontWeight: 600,
                      }}
                    >
                      Open module
                      <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </motion.div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
