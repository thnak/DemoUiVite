import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function IndexDesign2({ modules, viewMode }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  // Define bento layout patterns
  const getGridSize = (index: number) => {
    const patterns = [
      { xs: 12, sm: 6, md: 8 }, // Large
      { xs: 12, sm: 6, md: 4 }, // Small
      { xs: 12, sm: 6, md: 4 }, // Small
      { xs: 12, sm: 6, md: 4 }, // Small
      { xs: 12, sm: 6, md: 4 }, // Small
      { xs: 12, sm: 12, md: 6 }, // Medium
      { xs: 12, sm: 6, md: 3 }, // Small
      { xs: 12, sm: 6, md: 3 }, // Small
    ];
    return patterns[index % patterns.length];
  };

  if (viewMode === 'list') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Stack spacing={1.5}>
          {modules.map((module, index) => (
            <motion.div key={module.id} variants={cardVariants}>
              <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              transition: 'all 0.2s ease-in-out',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: alpha(
                  module.color === 'primary'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                  0.04
                ),
                borderColor:
                  module.color === 'primary'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleClick(module.path)}
              sx={{
                py: 2,
                px: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1.5,
                  bgcolor: alpha(
                    module.color === 'primary'
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                    0.08
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

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {module.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {module.subtitle}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.disabled" sx={{ mr: 1 }}>
                {String(index + 1).padStart(2, '0')}
              </Typography>
            </CardActionArea>
          </Card>
        </motion.div>
        ))}
      </Stack>
    </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={2}>
        {modules.map((module, index) => {
          const gridSize = getGridSize(index);
          const isLarge = gridSize.md === 8 || gridSize.md === 6;

          return (
            <Grid key={module.id} size={gridSize}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    height: isLarge ? { xs: 200, md: 240 } : { xs: 180, md: 200 },
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                    background:
                      module.color === 'primary'
                        ? `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`
                        : `linear-gradient(145deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.customShadows.z20,
                      '& .module-icon': {
                        transform: 'scale(1.15) rotate(5deg)',
                      },
                },
              }}
            >
              <CardActionArea
                onClick={() => handleClick(module.path)}
                sx={{
                  height: '100%',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Iconify
                  className="module-icon"
                  icon={module.icon}
                  width={isLarge ? 56 : 44}
                  sx={{
                    color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />

                <Box>
                  <Typography
                    variant={isLarge ? 'h5' : 'h6'}
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {module.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      opacity: 0.8,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {module.subtitle}
                  </Typography>
                </Box>

                {/* Decorative element */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: alpha(
                      module.color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                      0.06
                    ),
                                  }}
                />
              </CardActionArea>
            </Card>
          </motion.div>
          </Grid>
        );
      })}
    </Grid>
  </motion.div>
  );
}
