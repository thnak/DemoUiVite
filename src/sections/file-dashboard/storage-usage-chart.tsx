import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import type { StorageCategory } from './file-dashboard-data';

// ----------------------------------------------------------------------

type StorageUsageChartProps = CardProps & {
  usedPercentage: number;
  usedStorage: number;
  totalStorage: number;
  categories: StorageCategory[];
};

export function StorageUsageChart({
  usedPercentage,
  usedStorage,
  totalStorage,
  categories,
  sx,
  ...other
}: StorageUsageChartProps) {
  const theme = useTheme();

  // Calculate stroke dash for the progress arc
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (usedPercentage / 100) * circumference;

  return (
    <Card sx={[{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {/* Circular Progress */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 200,
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={theme.vars.palette.grey[200]}
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#7B68EE"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {usedPercentage}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Used of {usedStorage} Gb / {totalStorage} Gb
          </Typography>
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  bgcolor: 'grey.100',
                }}
              >
                <Iconify icon={category.icon} width={24} height={24} sx={{ color: category.color }} />
              </Box>
              <Box>
                <Typography variant="subtitle2">{category.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {category.fileCount} files
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle2">{category.size} Gb</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
