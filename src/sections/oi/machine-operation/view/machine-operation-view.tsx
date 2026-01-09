import type { MachineOeeUpdate } from 'src/services/machineHub';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { apiConfig } from 'src/api/config';
import { MachineHubService } from 'src/services/machineHub';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../../context';

// ----------------------------------------------------------------------

interface MachineStatus {
  status: 'running' | 'planstop' | 'unplanstop' | 'testing';
  label: string;
  color: 'success' | 'info' | 'error' | 'warning';
}

const getMachineStatus = (machineData: MachineOeeUpdate | null): MachineStatus => {
  // This is a simplified logic - should be based on actual machine state
  if (!machineData) {
    return { status: 'unplanstop', label: 'Dừng không kế hoạch', color: 'error' };
  }
  
  return { status: 'running', label: 'Đang chạy', color: 'success' };
};

// ----------------------------------------------------------------------

export function MachineOperationView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedMachine } = useMachineSelector();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [machineData, setMachineData] = useState<MachineOeeUpdate | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [timelineView, setTimelineView] = useState<'current' | 'shift' | 'day'>('current');

  // Get singleton hub service instance
  const hubService = MachineHubService.getInstance(apiConfig.baseUrl);

  // Handle real-time machine updates
  const handleMachineUpdate = useCallback((update: MachineOeeUpdate) => {
    setMachineData({
      ...update,
      oee: update.oee * 100,
      availability: update.availability * 100,
      performance: update.performance * 100,
      quality: update.quality * 100,
    });
  }, []);

  // Subscribe to machine updates
  useEffect(() => {
    if (!selectedMachine?.id) {
      router.push('/oi/select-machine');
      return undefined;
    }

    let mounted = true;

    const connectToMachine = async () => {
      try {
        setIsConnecting(true);

        await hubService.subscribeToMachine(
          selectedMachine.id || '',
          handleMachineUpdate
        );

        if (!mounted) return;

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
        hubService.unsubscribeFromMachine(selectedMachine.id).catch(console.error);
      }
    };
  }, [selectedMachine, hubService, handleMachineUpdate, router]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    router.push('/oi/select-machine');
  };

  const machineStatus = getMachineStatus(machineData);

  if (!selectedMachine) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Alert severity="warning">Please select a machine first</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Left: Back button, Machine name, Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <IconButton onClick={handleBack} size="large">
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {selectedMachine.code || selectedMachine.name}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:swap-fill" />}>
              Đổi mã hàng
            </Button>
            <Button variant="outlined" color="primary" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm sản phẩm
            </Button>
            <Button variant="outlined" color="error" startIcon={<Iconify icon="eva:alert-triangle-fill" />}>
              Nhập lỗi
            </Button>
            <Button variant="outlined" color="warning" startIcon={<Iconify icon="eva:stop-circle-fill" />}>
              Lý do dừng máy
            </Button>
          </Stack>
        </Box>

        {/* Right: Test/Run switch, Update time, Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">RUN</Typography>
            <Switch checked={testMode} onChange={(e) => setTestMode(e.target.checked)} />
            <Typography variant="body2">TEST</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {currentTime.toLocaleTimeString()}
            </Typography>
            <Chip
              label={machineStatus.label}
              color={machineStatus.color}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </Box>

      {isConnecting && !machineData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={64} />
        </Box>
      ) : (
        <Stack spacing={3}>
          {/* Timeline Container - Placeholder */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Timeline
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant={timelineView === 'current' ? 'contained' : 'outlined'}
                  onClick={() => setTimelineView('current')}
                >
                  Hiện tại
                </Button>
                <Button
                  size="small"
                  variant={timelineView === 'shift' ? 'contained' : 'outlined'}
                  onClick={() => setTimelineView('shift')}
                >
                  Ca
                </Button>
                <Button
                  size="small"
                  variant={timelineView === 'day' ? 'contained' : 'outlined'}
                  onClick={() => setTimelineView('day')}
                >
                  Ngày
                </Button>
              </Box>
            </Box>
            {/* Timeline visualization would go here */}
            <Box
              sx={{
                height: 120,
                bgcolor: 'background.neutral',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Timeline visualization (to be implemented)
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              2 DOWNTIME CHƯA PHÂN LOẠI
            </Alert>
          </Card>

          {/* Bottom Section: Metrics and Production Info */}
          <Grid container spacing={3}>
            {/* Left: OEE Metrics */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Chỉ số OEE
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      OEE
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {machineData?.oee.toFixed(1) || '0'}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      APQ (Availability × Performance × Quality)
                    </Typography>
                    <Typography variant="h5">
                      {machineData?.availability.toFixed(1) || '0'}% × {machineData?.performance.toFixed(1) || '0'}% × {machineData?.quality.toFixed(1) || '0'}%
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Downtime (giờ)
                      </Typography>
                      <Typography variant="h6">
                        {machineData?.downtime || '0'}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Downtime (lần)
                      </Typography>
                      <Typography variant="h6">3</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Test (giờ)
                      </Typography>
                      <Typography variant="h6">0.12</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Test (lần)
                      </Typography>
                      <Typography variant="h6">2</Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Grid>

            {/* Right: Production Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Sản xuất
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian hoàn thành dự kiến
                    </Typography>
                    <Typography variant="h6">17:45</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Production Order Number
                    </Typography>
                    <Typography variant="h6">PO-LSX-1213</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mã hàng
                    </Typography>
                    <Typography variant="h6">{machineData?.currentProductName || 'THACAL83737146TRDU'}</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Tổng cộng
                      </Typography>
                      <Typography variant="h6">{machineData?.totalCount || 1230}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Đạt
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {machineData?.goodCount || 1179}
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Lỗi
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        1
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tiến trình
                    </Typography>
                    <Typography variant="h6">90.6%</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nhịp lý tưởng
                      </Typography>
                      <Typography variant="h6">12.5s</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nhịp thực tế
                      </Typography>
                      <Typography variant="h6">10.0s</Typography>
                    </Grid>
                  </Grid>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Người vận hành
                    </Typography>
                    <Typography variant="h6">WIBU - 01234</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      )}
    </Container>
  );
}
