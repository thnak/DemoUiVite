import type { MachineOeeUpdate, MachineRuntimeBlock } from 'src/services/machineHub';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { apiConfig } from 'src/api/config';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface MachineCardProps {
  machineId: string;
  machineName: string;
  oeeData: MachineOeeUpdate | null;
  runtimeBlock: MachineRuntimeBlock | null;
  isLoading?: boolean;
  areaColor?: string;
}

export function MachineCard({ machineId, machineName, oeeData, runtimeBlock, isLoading, areaColor }: MachineCardProps) {
  const getStatusConfig = () => {
    // If we have a runtime block, use its data for status
    if (runtimeBlock) {
      return {
        label: runtimeBlock.name || 'Unknown',
        color: 'default' as const,
        icon: 'eva:clock-outline' as const,
        bgColor: runtimeBlock.StopReasonHexColor || '#9ca3af',
      };
    }

    if (!oeeData) {
      return {
        label: 'Unknown',
        color: 'default' as const,
        icon: 'eva:question-mark-circle-outline' as const,
        bgColor: '#9ca3af',
      };
    }

    // Determine status based on OEE metrics
    if (oeeData.oee >= 0.85) {
      return {
        label: 'Running',
        color: 'success' as const,
        icon: 'solar:play-circle-bold' as const,
        bgColor: '#22c55e',
      };
    }
    if (oeeData.oee >= 0.6) {
      return {
        label: 'Speed Loss',
        color: 'warning' as const,
        icon: 'mdi:speedometer' as const,
        bgColor: '#f59e0b',
      };
    }
    return {
      label: 'Downtime',
      color: 'error' as const,
      icon: 'solar:danger-triangle-bold-duotone' as const,
      bgColor: '#ef4444',
    };
  };

  const status = getStatusConfig();
  const oeePercentage = oeeData ? Math.round(oeeData.oee * 100) : 0;
  const progressPercentage = oeeData
    ? Math.round(((oeeData.goodCount || 0) / Math.max((oeeData.totalCount || 1), 1)) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderTop: 4,
        borderColor: areaColor || 'primary.main',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 280,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Machine Image */}
          <Box
            sx={{
              height: 140,
              bgcolor: areaColor ? `${areaColor}15` : 'background.neutral',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={`${apiConfig.baseUrl}/api/Machine/${machineId}/image`}
              alt={machineName}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-icon')) {
                  const icon = document.createElement('div');
                  icon.className = 'fallback-icon';
                  icon.style.fontSize = '48px';
                  icon.innerHTML = '🏭';
                  parent.appendChild(icon);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Status Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: status.bgColor,
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: 2,
              }}
            >
              <Iconify icon={status.icon} width={14} />
              {status.label}
            </Box>
          </Box>

          {/* Machine Info */}
          <Box sx={{ p: 2.5 }}>
            {/* Machine Name */}
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {machineName}
            </Typography>

            {/* OEE Metrics */}
            <Stack spacing={2}>
              {/* OEE Circle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={oeePercentage}
                    size={80}
                    thickness={6}
                    sx={{
                      color:
                        oeePercentage >= 85
                          ? 'success.main'
                          : oeePercentage >= 60
                            ? 'warning.main'
                            : 'error.main',
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {oeePercentage}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      OEE
                    </Typography>
                  </Box>
                </Box>

                {/* APQ Metrics */}
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      A
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {oeeData ? Math.round(oeeData.availability * 100) : 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      P
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {oeeData ? Math.round(oeeData.performance * 100) : 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Q
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {oeeData ? Math.round(oeeData.quality * 100) : 0}%
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Production Progress */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Production
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {oeeData?.goodCount || 0} / {oeeData?.totalCount || 0}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                      bgcolor: 'success.main',
                    },
                  }}
                />
              </Box>

              {/* Status Chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={status.label}
                  size="small"
                  color={status.color}
                  icon={<Iconify icon={status.icon} width={16} />}
                />
              </Stack>
            </Stack>
          </Box>
        </>
      )}
    </Card>
  );
}
