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

export function IndexDesign1({ modules, viewMode }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  if (viewMode === 'list') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Stack spacing={2}>
          {modules.map((module) => (
            <motion.div key={module.id} variants={cardVariants}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    boxShadow: theme.customShadows.z16,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleClick(module.path)}
                  sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      background:
                        module.color === 'primary'
                          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.24)} 100%)`
                          : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.24)} 100%)`,
                    }}
                  >
                    <Iconify
                      icon={module.icon}
                      width={32}
                      sx={{
                        color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.subtitle}
                    </Typography>
                  </Box>

                  <Iconify icon="eva:arrow-ios-forward-fill" width={24} color="text.secondary" />
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
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid key={module.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <motion.div variants={cardVariants}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.customShadows.z24,
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleClick(module.path)}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      transition: 'transform 0.3s ease-in-out',
                      background:
                        module.color === 'primary'
                          ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                          : `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                    }}
                  >
                    <Iconify
                      icon={module.icon}
                      width={40}
                      sx={{
                        color: 'common.white',
                      }}
                    />
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontFamily: theme.typography.fontFamily,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, lineHeight: 1.5 }}
                    >
                      {module.subtitle}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
