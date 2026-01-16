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

export function IndexDesign3({ modules, viewMode }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  if (viewMode === 'list') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Stack spacing={3}>
          {modules.map((module, index) => (
            <motion.div key={module.id} variants={cardVariants}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  p: 2.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    '& .arrow-icon': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
                onClick={() => handleClick(module.path)}
              >
                <Typography
                  variant="h4"
                  sx={{
                    minWidth: 40,
                    fontWeight: 300,
                    color: 'text.disabled',
                    fontFamily: '"DM Sans Variable", sans-serif',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>

                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
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
                    width={30}
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
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.subtitle}
                  </Typography>
                </Box>

                <Iconify
                  className="arrow-icon"
                  icon="mdi:arrow-right"
                  width={24}
                  sx={{
                    color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                    opacity: 0,
                    transform: 'translateX(-8px)',
                    transition: 'all 0.25s ease',
                  }}
                />
              </Box>
            </motion.div>
          ))}
        </Stack>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={4}>
        {modules.map((module) => (
          <Grid key={module.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <motion.div variants={cardVariants}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                  border: 'none',
                  boxShadow: `0 4px 24px 0 ${alpha(theme.palette.common.black, 0.06)}`,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: `0 20px 40px 0 ${alpha(
                      module.color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                      0.16
                    )}`,
                    '& .icon-bg': {
                      bgcolor: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                    },
                    '& .icon': {
                      color: 'common.white',
                    },
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleClick(module.path)}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2.5,
                  }}
                >
                  <Box
                    className="icon-bg"
                    sx={{
                      width: 88,
                      height: 88,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '24px',
                      bgcolor: alpha(
                        module.color === 'primary'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                        0.08
                      ),
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <Iconify
                      className="icon"
                      icon={module.icon}
                      width={44}
                      sx={{
                        color: module.color === 'primary' ? 'primary.main' : 'secondary.main',
                        transition: 'color 0.35s ease',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontFamily: '"DM Sans Variable", sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                      }}
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
