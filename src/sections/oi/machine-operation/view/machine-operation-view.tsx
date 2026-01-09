import type { MachineOeeUpdate } from 'src/services/machineHub';
import type { ProductWorkingStateByMachine, CurrentMachineRunStateRecords } from 'src/api/types/generated';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { apiConfig } from 'src/api/config';
import { MachineHubService } from 'src/services/machineHub';
import { getapiMachineDowntimemachineIdcurrentrunstaterecords } from 'src/api/services/generated/machine-downtime';

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

// Mock timeline data for development
const getMockTimelineData = (): CurrentMachineRunStateRecords[] => [
  {
    stateId: '000000000000000000000000',
    stateName: 'Normal Operation',
    isUnplannedDowntime: false,
    state: 'running',
    startTime: '2026-01-09T06:00:00Z',
    endTime: '2026-01-09T07:15:00Z',
  },
  {
    stateId: '000000000000000000000000',
    stateName: null,
    isUnplannedDowntime: true,
    state: 'downtime',
    startTime: '2026-01-09T07:15:00Z',
    endTime: '2026-01-09T07:25:00Z',
  },
  {
    stateId: '507f1f77bcf86cd799439011',
    stateName: 'Maintenance',
    isUnplannedDowntime: false,
    state: 'downtime',
    startTime: '2026-01-09T07:25:00Z',
    endTime: '2026-01-09T07:45:00Z',
  },
  {
    stateId: '000000000000000000000000',
    stateName: 'Normal Operation',
    isUnplannedDowntime: false,
    state: 'running',
    startTime: '2026-01-09T07:45:00Z',
    endTime: null,
  },
];

// Mock mapped products for product change dialog
interface MappedProduct {
  id: string;
  productId: string;
  productName: string;
  productionOrderNumber: string;
  targetQuantity: number;
  currentQuantity: number;
  isActive: boolean;
  startTime: string;
}

const getMockMappedProducts = (): MappedProduct[] => [
  {
    id: '1',
    productId: 'prod-1',
    productName: 'THACAL83737146TRDU',
    productionOrderNumber: 'PO-LSX-20260109-001',
    targetQuantity: 1500,
    currentQuantity: 1359,
    isActive: true,
    startTime: '2026-01-09T06:00:00Z',
  },
  {
    id: '2',
    productId: 'prod-2',
    productName: 'CABLE-PRO-X2000',
    productionOrderNumber: 'PO-LSX-20260109-002',
    targetQuantity: 2000,
    currentQuantity: 0,
    isActive: false,
    startTime: '2026-01-09T08:00:00Z',
  },
  {
    id: '3',
    productId: 'prod-3',
    productName: 'CONNECTOR-MINI-500',
    productionOrderNumber: 'PO-LSX-20260109-003',
    targetQuantity: 800,
    currentQuantity: 0,
    isActive: false,
    startTime: '2026-01-09T10:00:00Z',
  },
];

// Quantity add history interface
interface QuantityAddHistory {
  id: string;
  timestamp: string;
  addedQuantity: number;
  addedBy: string;
  note?: string;
}

const getMockQuantityHistory = (): QuantityAddHistory[] => [
  {
    id: '1',
    timestamp: '2026-01-09T06:30:00Z',
    addedQuantity: 100,
    addedBy: 'WIBU - 01234',
    note: 'Initial batch',
  },
  {
    id: '2',
    timestamp: '2026-01-09T07:00:00Z',
    addedQuantity: 50,
    addedBy: 'WIBU - 01234',
  },
];

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

// Single OEE Semi-Circle Donut Chart Component
function OEESemiCircleMetric({ value, label, color }: { value: number; label: string; color: string }) {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e0e0e0',
          strokeWidth: '100%',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -10,
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#333',
            formatter: (val: number) => `${Math.round(val)}%`,
          },
        },
        hollow: {
          size: '60%',
        },
      },
    },
    fill: {
      colors: [color],
    },
    stroke: {
      lineCap: 'round',
    },
  };

  const series = [value];

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
      <Chart options={chartOptions} series={series} type="radialBar" height={180} />
      <Typography variant="caption" sx={{ mt: -2, color: 'text.secondary', fontWeight: 'medium', display: 'block' }}>
        {label}
      </Typography>
    </Box>
  );
}

// Combined APQ Chart with Categories (Availability, Performance, Quality)
function APQCategorizedChart({
  availability,
  performance,
  quality,
}: {
  availability: number;
  performance: number;
  quality: number;
}) {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 300,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 8,
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            color: '#666',
            offsetY: 80,
          },
          value: {
            offsetY: 40,
            fontSize: '18px',
            fontWeight: 'bold',
            formatter: (val: number) => `${Math.round(val)}%`,
          },
        },
        hollow: {
          size: '45%',
        },
      },
    },
    colors: ['#3b82f6', '#f59e0b', '#8b5cf6'],
    labels: ['Availability', 'Performance', 'Quality'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      markers: {
        size: 5,
      },
    },
  };

  const series = [availability, performance, quality];

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Chart options={chartOptions} series={series} type="radialBar" height={300} />
    </Box>
  );
}

// ApexCharts Timeline Visualization Component
function ApexTimelineVisualization({ records }: { records: CurrentMachineRunStateRecords[] }) {
  const getStateColor = (state?: string, isUnlabeled?: boolean) => {
    if (isUnlabeled) return '#ef4444'; // Red for unlabeled downtime
    if (state === 'running') return '#22c55e'; // Green
    if (state === 'speedLoss') return '#f59e0b'; // Orange
    if (state === 'downtime') return '#64748b'; // Gray for labeled downtime
    return '#94a3b8'; // Light gray default
  };

  // Convert records to ApexCharts timeline format
  const timelineData = records.map((record, index) => {
    const isUnlabeled = record.stateId === '000000000000000000000000' && record.state === 'downtime';
    const color = getStateColor(record.state, isUnlabeled);
    const stateName = record.stateName || (isUnlabeled ? 'Unlabeled Downtime' : 'Unknown');
    
    return {
      x: stateName,
      y: [
        new Date(record.startTime || '').getTime(),
        record.endTime ? new Date(record.endTime).getTime() : new Date().getTime(),
      ],
      fillColor: color,
    };
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: 'rangeBar',
      height: 150,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        rangeBarGroupRows: true,
      },
    },
    colors: ['#22c55e', '#f59e0b', '#ef4444', '#64748b'],
    fill: {
      type: 'solid',
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          hour: 'HH:mm',
        },
      },
    },
    yaxis: {
      show: true,
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const start = new Date(data.y[0]);
        const end = new Date(data.y[1]);
        const duration = Math.round((end.getTime() - start.getTime()) / 60000); // minutes
        
        return `<div style="padding: 10px;">
          <strong>${data.x}</strong><br/>
          Start: ${start.toLocaleTimeString()}<br/>
          End: ${end.toLocaleTimeString()}<br/>
          Duration: ${duration} minutes
        </div>`;
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      data: timelineData,
    },
  ];

  return (
    <Box>
      <Chart options={chartOptions} series={series} type="rangeBar" height={150} />
      
      {/* Legend */}
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', borderRadius: 0.5 }} />
          <Typography variant="caption">Running</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#f59e0b', borderRadius: 0.5 }} />
          <Typography variant="caption">Speed Loss</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#64748b', borderRadius: 0.5 }} />
          <Typography variant="caption">Labeled Downtime</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', borderRadius: 0.5 }} />
          <Typography variant="caption">Unlabeled Downtime</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

// Timeline Visualization Component (fallback - keeping for compatibility)
function TimelineVisualization({ records }: { records: CurrentMachineRunStateRecords[] }) {
  const getStateColor = (state?: string, isUnlabeled?: boolean) => {
    if (isUnlabeled) return '#ef4444'; // Red for unlabeled downtime
    if (state === 'running') return '#22c55e'; // Green
    if (state === 'speedLoss') return '#f59e0b'; // Orange
    if (state === 'downtime') return '#64748b'; // Gray for labeled downtime
    return '#94a3b8'; // Light gray default
  };

  const getStateDuration = (start: string, end: string | null | undefined) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <Box>
      {/* Timeline Bar */}
      <Box
        sx={{
          height: 60,
          bgcolor: 'background.neutral',
          borderRadius: 1,
          display: 'flex',
          overflow: 'hidden',
          mb: 2,
        }}
      >
        {records.map((record, index) => {
          const isUnlabeled = record.stateId === '000000000000000000000000' && record.state === 'downtime';
          const color = getStateColor(record.state, isUnlabeled);
          
          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                bgcolor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: index < records.length - 1 ? '2px solid white' : 'none',
                position: 'relative',
                '&:hover': {
                  opacity: 0.9,
                  cursor: 'pointer',
                },
              }}
              title={`${record.stateName || 'Unlabeled Downtime'} - ${getStateDuration(record.startTime || '', record.endTime)}`}
            >
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                {getStateDuration(record.startTime || '', record.endTime)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', borderRadius: 0.5 }} />
          <Typography variant="caption">Running</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#f59e0b', borderRadius: 0.5 }} />
          <Typography variant="caption">Speed Loss</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#64748b', borderRadius: 0.5 }} />
          <Typography variant="caption">Labeled Downtime</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', borderRadius: 0.5 }} />
          <Typography variant="caption">Unlabeled Downtime</Typography>
        </Stack>
      </Stack>
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
  const [timelineRecords, setTimelineRecords] = useState<CurrentMachineRunStateRecords[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [timelineView, setTimelineView] = useState<'current' | 'shift' | 'day'>('current');
  
  // Dialog states
  const [productChangeDialogOpen, setProductChangeDialogOpen] = useState(false);
  const [addQuantityDialogOpen, setAddQuantityDialogOpen] = useState(false);
  const [addQuantityTabValue, setAddQuantityTabValue] = useState(0);
  const [quantityToAdd, setQuantityToAdd] = useState<string>('');
  const [quantityNote, setQuantityNote] = useState<string>('');
  const [quantityHistory, setQuantityHistory] = useState<QuantityAddHistory[]>([]);
  const [mappedProducts, setMappedProducts] = useState<MappedProduct[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

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
          setTimelineRecords(getMockTimelineData());
          setMappedProducts(getMockMappedProducts());
          setQuantityHistory(getMockQuantityHistory());
        } else {
          // Load real timeline data in production
          try {
            const records = await getapiMachineDowntimemachineIdcurrentrunstaterecords(selectedMachine.id || '');
            if (mounted && records) {
              setTimelineRecords(Array.isArray(records) ? records : []);
            }
          } catch (error) {
            console.error('Failed to load timeline data:', error);
          }
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // F1 for product change dialog
      if (event.key === 'F1') {
        event.preventDefault();
        setProductChangeDialogOpen(true);
      }
      // F2 for add quantity dialog
      if (event.key === 'F2') {
        event.preventDefault();
        setAddQuantityDialogOpen(true);
      }
      // F3 for add defect/scrap (placeholder - can be implemented later)
      if (event.key === 'F3') {
        event.preventDefault();
        console.log('F3: Add defect/scrap - to be implemented');
      }
      // F4 for label downtime (placeholder - can be implemented later)
      if (event.key === 'F4') {
        event.preventDefault();
        console.log('F4: Label downtime - to be implemented');
      }
      // Escape to close dialogs
      if (event.key === 'Escape') {
        setProductChangeDialogOpen(false);
        setAddQuantityDialogOpen(false);
        setShowKeyboardHelp(false);
      }
      // F12 for keyboard help
      if (event.key === 'F12') {
        event.preventDefault();
        setShowKeyboardHelp(!showKeyboardHelp);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showKeyboardHelp, addQuantityDialogOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    router.push('/oi/select-machine');
  };

  const handleProductSelect = (product: MappedProduct) => {
    // TODO: Implement product selection logic
    console.log('Selected product:', product);
    setProductChangeDialogOpen(false);
  };

  const handleUpdateTarget = (productId: string, newTarget: number) => {
    // TODO: Implement target update logic
    console.log('Update target:', productId, newTarget);
  };

  const handleAddQuantity = () => {
    const qty = parseInt(quantityToAdd, 10);
    if (qty > 0 && productData) {
      // Add to history
      const newHistory: QuantityAddHistory = {
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
        addedQuantity: qty,
        addedBy: 'WIBU - 01234', // TODO: Get from user context
        note: quantityNote,
      };
      setQuantityHistory([newHistory, ...quantityHistory]);

      // Update product data
      setProductData({
        ...productData,
        currentQuantity: (productData.currentQuantity || 0) + qty,
        goodQuantity: (productData.goodQuantity || 0) + qty,
      });

      // Reset form
      setQuantityToAdd('');
      setQuantityNote('');
      setAddQuantityDialogOpen(false);
      setAddQuantityTabValue(0);
    }
  };

  const filteredProducts = mappedProducts.filter(product =>
    product.productName.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.productionOrderNumber.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const unlabeledDowntimeCount = timelineRecords.filter(
    record => record.stateId === '000000000000000000000000' && record.state === 'downtime'
  ).length;

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
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Badge
              badgeContent="F1"
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.625rem',
                  height: 16,
                  minWidth: 16,
                  padding: '0 4px',
                },
              }}
            >
              <Badge
                badgeContent="F1"
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: 18,
                    minWidth: 24,
                    borderRadius: 0.5,
                  },
                }}
              >
                <Button 
                  variant="contained" 
                  size="large"
                  color="primary" 
                  startIcon={<Iconify icon="eva:swap-fill" />}
                  onClick={() => setProductChangeDialogOpen(true)}
                  sx={{ fontSize: '1rem', px: 3, py: 1.5 }}
                >
                  Đổi mã hàng
                </Button>
              </Badge>
            </Badge>
            <Badge
              badgeContent="F2"
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 24,
                  borderRadius: 0.5,
                },
              }}
            >
              <Button 
                variant="outlined" 
                size="large"
                color="primary" 
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => setAddQuantityDialogOpen(true)}
                sx={{ fontSize: '1rem', px: 3, py: 1.5 }}
              >
                Thêm sản phẩm
              </Button>
            </Badge>
            <Badge
              badgeContent="F3"
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 24,
                  borderRadius: 0.5,
                },
              }}
            >
              <Button 
                variant="outlined" 
                size="large"
                color="error" 
                startIcon={<Iconify icon="eva:alert-triangle-fill" />}
                sx={{ fontSize: '1rem', px: 3, py: 1.5 }}
              >
                Nhập lỗi
              </Button>
            </Badge>
            <Badge
              badgeContent="F4"
              color="warning"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 24,
                  borderRadius: 0.5,
                },
              }}
            >
              <Button 
                variant="outlined" 
                size="large"
                color="warning" 
                startIcon={<Iconify icon="eva:stop-circle-fill" />}
                sx={{ fontSize: '1rem', px: 3, py: 1.5 }}
              >
                Lý do dừng máy
              </Button>
            </Badge>
            <IconButton 
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <Iconify icon="eva:question-mark-circle-outline" />
            </IconButton>
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
            
            {/* Timeline Visualization */}
            {timelineRecords.length > 0 ? (
              <ApexTimelineVisualization records={timelineRecords} />
            ) : (
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
                  No timeline data available
                </Typography>
              </Box>
            )}
            
            {unlabeledDowntimeCount > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {unlabeledDowntimeCount} DOWNTIME CHƯA PHÂN LOẠI
              </Alert>
            )}
          </Card>

          {/* Bottom Section */}
          <Grid container spacing={3}>
            {/* Left: OEE Metrics with Circular Progress */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Chỉ số OEE
                </Typography>
                
                {/* OEE Semi-Circle Chart and APQ Categorized Chart */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'center' }}>
                  {/* OEE Single Chart */}
                  <Box sx={{ flex: '0 0 auto' }}>
                    <OEESemiCircleMetric 
                      value={machineData?.oee || 85} 
                      label="OEE" 
                      color="#22c55e" 
                    />
                  </Box>
                  
                  {/* APQ Combined Chart */}
                  <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    <APQCategorizedChart
                      availability={machineData?.availability || 92}
                      performance={machineData?.performance || 95}
                      quality={machineData?.quality || 97}
                    />
                  </Box>
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
                        <Iconify icon="solar:danger-triangle-bold-duotone" width={20} sx={{ color: 'error.main' }} />
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

      {/* Product Change Dialog */}
      <Dialog 
        open={productChangeDialogOpen} 
        onClose={() => setProductChangeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Đổi mã hàng
            </Typography>
            <IconButton onClick={() => setProductChangeDialogOpen(false)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Search Box */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm hoặc PO..."
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }
            }}
          />

          {/* Product Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>PO</TableCell>
                  <TableCell align="center">Mục tiêu</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      {new Date(product.startTime).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: 'background.neutral',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={`${apiConfig.baseUrl}/api/Product/${product.productId}/image`}
                            alt={product.productName}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-icon')) {
                                const icon = document.createElement('div');
                                icon.className = 'fallback-icon';
                                icon.style.fontSize = '20px';
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
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {product.productName}
                          </Typography>
                          {product.isActive && (
                            <Chip 
                              label="Đang chạy" 
                              size="small" 
                              color="success" 
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.productionOrderNumber}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {product.currentQuantity} / {product.targetQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleProductSelect(product)}
                          disabled={product.isActive}
                        >
                          Chọn
                        </Button>
                        {product.isActive && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateTarget(product.productId, product.targetQuantity)}
                          >
                            Cập nhật
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductChangeDialogOpen(false)} variant="outlined">
            Đóng (ESC)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Quantity Dialog */}
      <Dialog 
        open={addQuantityDialogOpen} 
        onClose={() => setAddQuantityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Thêm sản phẩm
            </Typography>
            <IconButton onClick={() => setAddQuantityDialogOpen(false)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs 
            value={addQuantityTabValue} 
            onChange={(e, newValue) => setAddQuantityTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Thêm số lượng" />
            <Tab label="Lịch sử" />
          </Tabs>

          {/* Tab 1: Add Quantity */}
          {addQuantityTabValue === 0 && (
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:plus-fill" />
                      </InputAdornment>
                    ),
                  }
                }}
                helperText="Nhập số lượng sản phẩm muốn thêm vào tổng số"
              />
              <TextField
                fullWidth
                label="Ghi chú (tùy chọn)"
                multiline
                rows={3}
                value={quantityNote}
                onChange={(e) => setQuantityNote(e.target.value)}
                placeholder="Nhập ghi chú nếu cần..."
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setAddQuantityDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleAddQuantity}
                  disabled={!quantityToAdd || parseInt(quantityToAdd, 10) <= 0}
                >
                  Thêm
                </Button>
              </Box>
            </Stack>
          )}

          {/* Tab 2: History */}
          {addQuantityTabValue === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thời gian</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell>Người thêm</TableCell>
                    <TableCell>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quantityHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Chưa có lịch sử thêm số lượng
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    quantityHistory.map((history) => (
                      <TableRow key={history.id} hover>
                        <TableCell>
                          {new Date(history.timestamp).toLocaleString('vi-VN')}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`+${history.addedQuantity}`} 
                            size="small" 
                            color="success"
                          />
                        </TableCell>
                        <TableCell>{history.addedBy}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {history.note || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Keyboard Help Dialog */}
      <Dialog 
        open={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)}
        maxWidth="sm"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Phím tắt</Typography>
            <IconButton onClick={() => setShowKeyboardHelp(false)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Đổi mã hàng</Typography>
              <Chip label="F1" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Thêm sản phẩm</Typography>
              <Chip label="F2" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Nhập lỗi</Typography>
              <Chip label="F3" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Lý do dừng máy</Typography>
              <Chip label="F4" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Đóng dialog</Typography>
              <Chip label="ESC" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Hiển thị phím tắt</Typography>
              <Chip label="F12" size="small" />
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
