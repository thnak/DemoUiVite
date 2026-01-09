import type { MachineOeeUpdate } from 'src/services/machineHub';
import type { ProductWorkingStateByMachine } from 'src/api/types/generated';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { apiConfig } from 'src/api/config';
import { MachineHubService } from 'src/services/machineHub';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../../context';

// ----------------------------------------------------------------------

// Mock ProductWorkingStateByMachine data for development
const getMockProductData = (): ProductWorkingStateByMachine => ({
  productId: 'mock-product-1',
  productionOrderNumber: 'PO-LSX-20260109-001',
  userId: 'mock-user-1',
  quantityPerCycle: 1,
  idealCycleTime: 'PT12.5S', // 12.5 seconds
  downtimeThreshold: 'PT30S', // 30 seconds
  speedLossThreshold: 'PT15S', // 15 seconds
  productName: 'THACAL83737146TRDU',
  plannedQuantity: 1500,
  currentQuantity: 1359,
  goodQuantity: 1340,
  scrapQuantity: 19,
  actualCycleTime: 'PT10.2S', // 10.2 seconds
});

interface MachineStatus {
  status: 'running' | 'planstop' | 'unplanstop' | 'testing';
  label: string;
  color: 'success' | 'info' | 'error' | 'warning';
}

const getMachineStatus = (machineData: MachineOeeUpdate | null): MachineStatus => {
  if (!machineData) {
    return { status: 'unplanstop', label: 'Dừng không kế hoạch', color: 'error' };
  }
  return { status: 'running', label: 'Đang chạy', color: 'success' };
};

// Circular Progress Component for OEE Metrics
function CircularMetric({ value, label, color }: { value: number; label: string; color: string }) {
  const size = 100;
  const thickness = 6;
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{ color: 'action.disabled', opacity: 0.2 }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            color,
            position: 'absolute',
            left: 0,
            [`& .MuiCircularProgress-circle`]: {
              strokeLinecap: 'round',
            },
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
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function MachineOperationView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedMachine } = useMachineSelector();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [machineData, setMachineData] = useState<MachineOeeUpdate | null>(null);
  const [productData, setProductData] = useState<ProductWorkingStateByMachine | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [timelineView, setTimelineView] = useState<'current' | 'shift' | 'day'>('current');

  const hubService = MachineHubService.getInstance(apiConfig.baseUrl);

  const handleMachineUpdate = useCallback((update: MachineOeeUpdate) => {
    setMachineData({
      ...update,
      oee: update.oee * 100,
      availability: update.availability * 100,
      performance: update.performance * 100,
      quality: update.quality * 100,
    });
  }, []);

  useEffect(() => {
    if (!selectedMachine?.id) {
      router.push('/oi/select-machine');
      return undefined;
    }

    let mounted = true;

    const connectToMachine = async () => {
      try {
        setIsConnecting(true);
        
        // Load mock product data in dev mode
        if (import.meta.env.DEV) {
          setProductData(getMockProductData());
        }
        
        await hubService.subscribeToMachine(selectedMachine.id || '', handleMachineUpdate);

        if (!mounted) return;

        const aggregation = await hubService.getMachineAggregation(selectedMachine.id || '');
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
            <Chip label={machineStatus.label} color={machineStatus.color} size="small" sx={{ mt: 0.5 }} />
          </Box>
        </Box>
      </Box>

      {isConnecting && !machineData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={64} />
        </Box>
      ) : (
        <Stack spacing={3}>
          {/* Timeline Container */}
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

          {/* Bottom Section */}
          <Grid container spacing={3}>
            {/* Left: OEE Metrics with Circular Progress */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Chỉ số OEE
                </Typography>
                
                {/* Circular Progress Indicators */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
                  <CircularMetric 
                    value={machineData?.oee || 85} 
                    label="OEE" 
                    color="#22c55e" 
                  />
                  <CircularMetric 
                    value={machineData?.availability || 92} 
                    label="Availability" 
                    color="#3b82f6" 
                  />
                  <CircularMetric 
                    value={machineData?.performance || 95} 
                    label="Performance" 
                    color="#f59e0b" 
                  />
                  <CircularMetric 
                    value={machineData?.quality || 97} 
                    label="Quality" 
                    color="#8b5cf6" 
                  />
                </Box>

                {/* OEE Formula */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    OEE = Availability × Performance × Quality
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {machineData?.availability.toFixed(1) || '92.0'}% × {machineData?.performance.toFixed(1) || '95.0'}% × {machineData?.quality.toFixed(1) || '97.0'}% = {machineData?.oee.toFixed(1) || '85.0'}%
                  </Typography>
                </Box>

                {/* Downtime & Test Stats */}
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Iconify icon="solar:danger-triangle-bold" width={20} sx={{ color: 'error.main' }} />
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                          Downtime
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="error.main">{machineData?.downtime || '0.5'}h</Typography>
                      <Typography variant="caption" color="text.secondary">3 lần</Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Iconify icon="solar:test-tube-bold" width={20} sx={{ color: 'warning.main' }} />
                        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                          Test Mode
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="warning.main">0.12h</Typography>
                      <Typography variant="caption" color="text.secondary">2 lần</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Right: Production Info with Progress Bar */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Sản xuất
                </Typography>
                <Stack spacing={3}>
                  {/* Product Info with Image */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'background.neutral',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`${apiConfig.baseUrl}/api/Product/${productData?.productId}/image`}
                        alt={productData?.productName || ''}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-icon')) {
                            const icon = document.createElement('div');
                            icon.className = 'fallback-icon';
                            icon.style.fontSize = '40px';
                            icon.innerHTML = '📦';
                            parent.appendChild(icon);
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Mã hàng
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {productData?.productName || machineData?.currentProductName || 'THACAL83737146TRDU'}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={productData?.productionOrderNumber || 'PO-LSX-1213'} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Stack>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tiến trình sản xuất
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {productData?.currentQuantity || 1359} / {productData?.plannedQuantity || 1500}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={((productData?.currentQuantity || 1359) / (productData?.plannedQuantity || 1500)) * 100} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                          bgcolor: 'success.main',
                        },
                      }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        0%
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {(((productData?.currentQuantity || 1359) / (productData?.plannedQuantity || 1500)) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        100%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Completion Time */}
                  <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Iconify icon="solar:clock-circle-bold" width={20} sx={{ color: 'info.main' }} />
                      <Typography variant="body2" color="info.main" sx={{ fontWeight: 'bold' }}>
                        Thời gian hoàn thành dự kiến
                      </Typography>
                    </Stack>
                    <Typography variant="h6" color="info.main">17:45</Typography>
                  </Box>

                  {/* Quality Stats */}
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Tổng cộng
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {productData?.currentQuantity || machineData?.totalCount || 1359}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'success.lighter', borderRadius: 1 }}>
                        <Typography variant="body2" color="success.main" sx={{ mb: 0.5 }}>
                          Đạt
                        </Typography>
                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {productData?.goodQuantity || machineData?.goodCount || 1340}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'error.lighter', borderRadius: 1 }}>
                        <Typography variant="body2" color="error.main" sx={{ mb: 0.5 }}>
                          Lỗi
                        </Typography>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {productData?.scrapQuantity || 19}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Cycle Time */}
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Nhịp lý tưởng
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          12.5s
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Nhịp thực tế
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          10.2s
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Operator Info with Avatar */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                    <Avatar 
                      src={`${apiConfig.baseUrl}/api/User/${productData?.userId}/avatar-image`}
                      sx={{ width: 48, height: 48 }}
                    >
                      <Iconify icon="solar:user-circle-bold" width={48} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Người vận hành
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        WIBU - 01234
                      </Typography>
                    </Box>
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
