import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Alert, LinearProgress } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../context/machine-selector-context';
import { MachineSelectorCard } from '../components/machine-selector-card';

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
          <Iconify icon={icon} sx={{ fontSize: 40, color: `${color}.main` }} />
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
            icon={trend.isPositive ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'}
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

  // Mock data - should be fetched from API based on selected machine
  const mockData = {
    output: 1250,
    targetOutput: 1500,
    defects: 23,
    oee: 78.5,
    availability: 85.2,
    performance: 92.1,
    quality: 98.5,
    currentProduct: {
      code: 'PROD-001',
      name: 'Widget A',
    },
    shiftInfo: {
      shift: 'Morning Shift',
      startTime: '06:00',
      endTime: '14:00',
    },
  };

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
      ) : (
        <Stack spacing={3}>
          {/* Current Product & Shift Info */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, bgcolor: 'primary.lighter' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem', mb: 1 }}>
                  {t('oi.currentProduct')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                  {mockData.currentProduct.code}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {mockData.currentProduct.name}
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, bgcolor: 'info.lighter' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem', mb: 1 }}>
                  {t('oi.currentShift')}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', mb: 0.5 }}>
                  {mockData.shiftInfo.shift}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {mockData.shiftInfo.startTime} - {mockData.shiftInfo.endTime}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Production Progress */}
          <ProgressCard
            title={t('oi.productionProgress')}
            current={mockData.output}
            target={mockData.targetOutput}
            unit={t('oi.pieces')}
          />

          {/* Key Metrics */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.oee')}
                value={mockData.oee}
                unit="%"
                icon="solar:chart-2-bold"
                color="success"
                trend={{ value: 2.5, isPositive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.availability')}
                value={mockData.availability}
                unit="%"
                icon="solar:clock-circle-bold"
                color="info"
                trend={{ value: 1.8, isPositive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.performance')}
                value={mockData.performance}
                unit="%"
                icon="solar:graph-up-bold"
                color="primary"
                trend={{ value: 3.2, isPositive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title={t('oi.quality')}
                value={mockData.quality}
                unit="%"
                icon="solar:shield-check-bold"
                color="success"
                trend={{ value: 0.5, isPositive: false }}
              />
            </Grid>
          </Grid>

          {/* Production & Defects */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricCard
                title={t('oi.totalOutput')}
                value={mockData.output.toLocaleString()}
                unit={t('oi.pieces')}
                icon="solar:box-bold"
                color="primary"
                trend={{ value: 5.2, isPositive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricCard
                title={t('oi.totalDefects')}
                value={mockData.defects}
                unit={t('oi.pieces')}
                icon="solar:danger-circle-bold"
                color="error"
                trend={{ value: 1.2, isPositive: false }}
              />
            </Grid>
          </Grid>

          {/* Status Indicators */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              {t('oi.machineStatus')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    <Iconify icon="solar:check-circle-bold" sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('oi.running')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'background.neutral',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      0
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('oi.warnings')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'background.neutral',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      0
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('oi.errors')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'success.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      98%
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('oi.uptime')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      )}
    </DashboardContent>
  );
}
