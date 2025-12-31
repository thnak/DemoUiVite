import type { MachineOeeUpdate } from 'src/services/machineHub';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LinearProgress, CircularProgress } from '@mui/material';

import { apiConfig } from 'src/api/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { MachineHubService } from 'src/services/machineHub';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from 'src/sections/oi/context';
import { MachineSelectorCard } from 'src/sections/oi/components';

// ----------------------------------------------------------------------

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({ title, value, unit, icon, color, trend }: MetricCardProps) {
  return (
    <Card 
      sx={{ 
        p: 4, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          <Iconify icon={icon as any} sx={{ fontSize: 40, color: `${color}.main` }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem', mb: 0.5 }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            {unit && (
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {unit}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify 
            icon={(trend.isPositive ? 'mdi:arrow-up-bold' : 'mdi:arrow-down-bold') as any}
            sx={{ 
              color: trend.isPositive ? 'success.main' : 'error.main',
              fontSize: 20,
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: trend.isPositive ? 'success.main' : 'error.main',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {Math.abs(trend.value)}%
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            vs last shift
          </Typography>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
}

function ProgressCard({ title, current, target, unit }: ProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOnTrack = percentage >= 80;
  
  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {current.toLocaleString()} / {target.toLocaleString()}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: isOnTrack ? 'success.main' : 'warning.main' }}>
            {percentage.toFixed(0)}%
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem', mb: 2 }}>
          {unit}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage}
        sx={{
          height: 16,
          borderRadius: 8,
          bgcolor: 'background.neutral',
          '& .MuiLinearProgress-bar': {
            bgcolor: isOnTrack ? 'success.main' : 'warning.main',
            borderRadius: 8,
          }
        }}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

export function OperatorDashboardView() {
  const { t } = useTranslation();
  const { selectedMachine } = useMachineSelector();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [machineData, setMachineData] = useState<MachineOeeUpdate | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Get singleton hub service instance
  const hubService = MachineHubService.getInstance(apiConfig.baseUrl);

  // Handle real-time machine updates
  const handleMachineUpdate = useCallback((update: MachineOeeUpdate) => {
    // Convert from 0-1 to 0-100 for display
    setMachineData({
      ...update,
      oee: update.oee * 100,
      availability: update.availability * 100,
      performance: update.performance * 100,
      quality: update.quality * 100,
    });
  }, []);

  // Subscribe to machine updates when machine is selected
  useEffect(() => {
    if (!selectedMachine?.id) {
      setMachineData(null);
      return undefined;
    }

    let mounted = true;

    const connectToMachine = async () => {
      try {
        setIsConnecting(true);

        // Subscribe to real-time updates
        await hubService.subscribeToMachine(
          selectedMachine.id || '',
          handleMachineUpdate
        );

        if (!mounted) return;

        // Get initial aggregation
        const aggregation = await hubService.getMachineAggregation(
          selectedMachine.id || ''
        );
        if (aggregation && mounted) {
          setMachineData({
            machineId: selectedMachine.id || '',
            machineName: selectedMachine.name || selectedMachine.code || '',
            availability: aggregation.availability * 100,
            availabilityVsLastPeriod: 0,
            performance: aggregation.performance * 100,
            performanceVsLastPeriod: 0,
            quality: aggregation.quality * 100,
            qualityVsLastPeriod: 0,
            oee: aggregation.oee * 100,
            oeeVsLastPeriod: 0,
            goodCount: aggregation.goodCount,
            goodCountVsLastPeriod: 0,
            totalCount: aggregation.totalCount,
            totalCountVsLastPeriod: 0,
            plannedProductionTime: '',
            runTime: aggregation.totalRunTime,
            downtime: aggregation.totalDowntime,
            speedLossTime: aggregation.totalSpeedLossTime,
            currentProductName: '',
          });
        }
      } catch (error) {
        console.error('Failed to connect to machine hub:', error);
      } finally {
        if (mounted) {
          setIsConnecting(false);
        }
      }
    };

    connectToMachine();

    return () => {
      mounted = false;
      if (selectedMachine?.id) {
        hubService.unsubscribeFromMachine(selectedMachine.id).catch((err) => {
          console.error('Error unsubscribing:', err);
        });
      }
    };
  }, [selectedMachine, hubService, handleMachineUpdate]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {t('oi.operatorDashboard')}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {currentTime.toLocaleTimeString()}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
              {currentTime.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          {t('oi.operatorDashboardDescription')}
        </Typography>
      </Box>

      <MachineSelectorCard />

      {!selectedMachine ? (
        <Alert severity="info" sx={{ fontSize: '1.1rem', py: 3 }}>
          {t('oi.pleaseSelectMachine')}
        </Alert>
      ) : isConnecting && !machineData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={64} />
        </Box>
      ) : machineData ? (
        <Stack spacing={3}>
          {/* Current Product & Shift Info */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, bgcolor: 'primary.lighter' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem', mb: 1 }}>
                  {t('oi.currentProduct')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                  {machineData.currentProductName || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {selectedMachine.name || ''}
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, bgcolor: 'info.lighter' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem', mb: 1 }}>
                  {t('oi.machine')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', mb: 0.5 }}>
                  {selectedMachine.code || selectedMachine.name}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {t('oi.realtimeData')}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Production Progress */}
          <ProgressCard
            title={t('oi.productionProgress')}
            current={machineData.goodCount}
            target={machineData.totalCount || machineData.goodCount}
            unit={t('oi.pieces')}
          />

          {/* Key Metrics */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.oee')}
                value={machineData.oee.toFixed(1)}
                unit="%"
                icon="eva:trending-up-fill"
                color="success"
                trend={
                  machineData.oeeVsLastPeriod !== 0
                    ? {
                        value: Math.abs(machineData.oeeVsLastPeriod),
                        isPositive: machineData.oeeVsLastPeriod > 0,
                      }
                    : undefined
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.availability')}
                value={machineData.availability.toFixed(1)}
                unit="%"
                icon="eva:clock-fill"
                color="info"
                trend={
                  machineData.availabilityVsLastPeriod !== 0
                    ? {
                        value: Math.abs(machineData.availabilityVsLastPeriod),
                        isPositive: machineData.availabilityVsLastPeriod > 0,
                      }
                    : undefined
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.performance')}
                value={machineData.performance.toFixed(1)}
                unit="%"
                icon="eva:activity-fill"
                color="primary"
                trend={
                  machineData.performanceVsLastPeriod !== 0
                    ? {
                        value: Math.abs(machineData.performanceVsLastPeriod),
                        isPositive: machineData.performanceVsLastPeriod > 0,
                      }
                    : undefined
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.quality')}
                value={machineData.quality.toFixed(1)}
                unit="%"
                icon="eva:shield-fill"
                color="success"
                trend={
                  machineData.qualityVsLastPeriod !== 0
                    ? {
                        value: Math.abs(machineData.qualityVsLastPeriod),
                        isPositive: machineData.qualityVsLastPeriod > 0,
                      }
                    : undefined
                }
              />
            </Grid>
          </Grid>

          {/* Production & Defects */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricCard
                title={t('oi.goodCount')}
                value={machineData.goodCount.toLocaleString()}
                unit={t('oi.pieces')}
                icon="eva:cube-fill"
                color="primary"
                trend={
                  machineData.goodCountVsLastPeriod !== 0
                    ? {
                        value: Math.abs(machineData.goodCountVsLastPeriod),
                        isPositive: machineData.goodCountVsLastPeriod > 0,
                      }
                    : undefined
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricCard
                title={t('oi.totalCount')}
                value={machineData.totalCount.toLocaleString()}
                unit={t('oi.pieces')}
                icon="eva:layers-fill"
                color="info"
                trend={
                  machineData.totalCountVsLastPeriod !== 0
                    ? {
                        value: Math.abs(machineData.totalCountVsLastPeriod),
                        isPositive: machineData.totalCountVsLastPeriod > 0,
                      }
                    : undefined
                }
              />
            </Grid>
          </Grid>

          {/* Status Indicators */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              {t('oi.machineStatus')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Iconify icon={"eva:activity-fill" as any} sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('oi.connected')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('oi.realtimeTracking')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor:
                        machineData.availability >= 80 ? 'success.lighter' : 'warning.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: machineData.availability >= 80 ? 'success.main' : 'warning.main',
                      }}
                    >
                      {machineData.availability.toFixed(0)}%
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('oi.availability')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: machineData.oee >= 85 ? 'success.lighter' : 'warning.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: machineData.oee >= 85 ? 'success.main' : 'warning.main',
                      }}
                    >
                      {machineData.oee.toFixed(0)}%
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('oi.oee')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      ) : (
        <Alert severity="warning" sx={{ fontSize: '1.1rem', py: 3 }}>
          {t('oi.noDataAvailable')}
        </Alert>
      )}
    </DashboardContent>
  );
}
