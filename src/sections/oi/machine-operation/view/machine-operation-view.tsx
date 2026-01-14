import type { ApexOptions } from 'apexcharts';
import type { MachineOeeUpdate } from 'src/services/machineHub';
import type { CurrentMachineRunStateRecords, GetCurrentProductByMachineResult } from 'src/api/types/generated';

/**
 * Unified interface for all machine operation data
 * Combines OEE metrics from SignalR with product working state from API
 */
interface MachineOperationData {
  // Machine identification
  machineId: string;
  machineName: string;

  // OEE Metrics (from SignalR MachineOeeUpdate)
  oee: number; // Percentage (0-100)
  availability: number; // Percentage (0-100)
  performance: number; // Percentage (0-100)
  quality: number; // Percentage (0-100)
  availabilityVsLastPeriod: number;
  performanceVsLastPeriod: number;
  qualityVsLastPeriod: number;
  oeeVsLastPeriod: number;

  // Production Counts (from SignalR)
  goodCount: number;
  totalCount: number;
  scrapQuantity: number; // Derived from totalCount - goodCount
  goodCountVsLastPeriod: number;
  totalCountVsLastPeriod: number;

  // Time metrics (from SignalR)
  plannedProductionTime: string; // ISO 8601 duration
  runTime: string; // ISO 8601 duration
  downtime: string; // ISO 8601 duration
  speedLossTime: string; // ISO 8601 duration
  estimatedFinishTime?: string; // ISO 8601 date-time

  // Product information (from API GetCurrentProductByMachineResult)
  productId?: string;
  productName: string; // Falls back to currentProductName from SignalR
  productionOrderNumber?: string;
  currentQuantity: number; // Falls back to totalCount
  plannedQuantity: number;
  idealCycleTime?: string;
  actualCycleTime?: string;
  userId?: string;
  startTime?: string;

  // Progress calculation
  progressPercentage: number; // Calculated from currentQuantity / plannedQuantity
}

/**
 * Create initial empty machine operation data
 */
const createEmptyMachineData = (
  machineId?: string,
  machineName?: string
): MachineOperationData => ({
  machineId: machineId || '',
  machineName: machineName || '',
  oee: 0,
  availability: 0,
  performance: 0,
  quality: 0,
  availabilityVsLastPeriod: 0,
  performanceVsLastPeriod: 0,
  qualityVsLastPeriod: 0,
  oeeVsLastPeriod: 0,
  goodCount: 0,
  totalCount: 0,
  scrapQuantity: 0,
  goodCountVsLastPeriod: 0,
  totalCountVsLastPeriod: 0,
  plannedProductionTime: 'PT0S',
  runTime: 'PT0S',
  downtime: 'PT0S',
  speedLossTime: 'PT0S',
  productName: '',
  currentQuantity: 0,
  plannedQuantity: 0,
  progressPercentage: 0,
});

/**
 * Merge SignalR update with existing data
 */
const mergeSignalRUpdate = (
  existing: MachineOperationData,
  update: MachineOeeUpdate
): MachineOperationData => ({
  ...existing,
  machineId: update.machineId,
  machineName: update.machineName,
  oee: update.oee * 100,
  availability: update.availability * 100,
  performance: update.performance * 100,
  quality: update.quality * 100,
  availabilityVsLastPeriod: update.availabilityVsLastPeriod,
  performanceVsLastPeriod: update.performanceVsLastPeriod,
  qualityVsLastPeriod: update.qualityVsLastPeriod,
  oeeVsLastPeriod: update.oeeVsLastPeriod,
  goodCount: update.goodCount,
  totalCount: update.totalCount,
  scrapQuantity: update.totalCount - update.goodCount,
  goodCountVsLastPeriod: update.goodCountVsLastPeriod,
  totalCountVsLastPeriod: update.totalCountVsLastPeriod,
  plannedProductionTime: update.plannedProductionTime,
  runTime: update.runTime,
  downtime: update.downtime,
  speedLossTime: update.speedLossTime,
  estimatedFinishTime: update.estimatedFinishTime,
  productName: update.currentProductName || existing.productName,
  // Preserve existing product data unless we have better info
  currentQuantity: update.totalCount || existing.currentQuantity,
});

/**
 * Merge API product state with existing data
 */
const mergeProductState = (
  existing: MachineOperationData,
  productState: GetCurrentProductByMachineResult
): MachineOperationData => ({
  ...existing,
  productId: productState.productId,
  productName: productState.productName,
  productionOrderNumber: productState.productionOrderNumber,
  plannedQuantity: productState.plannedQuantity,
  userId: productState.userId,
  progressPercentage:
    productState.plannedQuantity && existing.currentQuantity
      ? (existing.currentQuantity / productState.plannedQuantity) * 100
      : existing.progressPercentage,
});

import Chart from 'react-apexcharts';
import { useState, useEffect, useCallback } from 'react';

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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { apiConfig } from 'src/api/config';
import { MachineHubService } from 'src/services/machineHub';
import { getapiMachinemachineIdavailableproducts } from 'src/api/services/generated/machine';
import { getapiDefectReasongetdefectreasons } from 'src/api/services/generated/defect-reason';
import { getapiStopMachineReasongetreasonpage } from 'src/api/services/generated/stop-machine-reason';
import {
  getapimachineproductionmachineIddefecteditems,
  postapimachineproductionmachineIdchangeproduct,
  postapimachineproductionmachineIdchangerunmode,
  getapimachineproductionmachineIdcurrentproductstate,
  postapimachineproductionmachineIdaddexternalquantity,
  postapimachineproductionmachineIddefecteditemsaddnew,
  postapimachineproductionmachineIdlabeldowntimerecord,
  getapimachineproductionmachineIdcurrentrunstaterecords,
  postapimachineproductionmachineIdupdateexternalquantity,
  deleteapimachineproductionmachineIdremoveexternalquantity,
  getapimachineproductionmachineIdaddexternalquantityhistory,
} from 'src/api/services/generated/machine-production';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../../context';

// ----------------------------------------------------------------------

// Simplified product interface for product change dialog
interface AvailableProduct {
  productId: string;
  productCode: string;
  productName: string;
  imageUrl?: string | null;
}

// Quantity add history interface
interface QuantityAddHistory {
  id: string;
  timestamp: string;
  addedQuantity: number;
  addedBy: string;
  note?: string;
}

interface DefectType {
  defectId: string;
  defectName: string;
  imageUrl?: string;
  colorHex: string;
  allowMultipleDefectsPerUnit?: boolean;
}

interface DefectSubmission {
  id: string;
  timestamp: string;
  defects: Array<{ defectId: string; defectName: string; quantity: number; colorHex: string }>;
  submittedBy: string;
}

// Stop reason interfaces for downtime labeling
interface StopReason {
  reasonId: string;
  reasonName: string;
  imageUrl?: string;
  colorHex: string;
}

interface DowntimeLabelHistory {
  id: string;
  timestamp: string;
  startTime?: string;
  endTime?: string | null;
  duration: number; // in minutes
  reasons: Array<{ reasonId: string; reasonName: string; colorHex: string }>;
  note?: string;
  labeledBy: string;
}

interface MachineStatus {
  status: 'running' | 'planstop' | 'unplanstop' | 'testing';
  label: string;
  color: 'success' | 'info' | 'error' | 'warning';
}

const getMachineStatus = (machineData: MachineOperationData | null): MachineStatus => {
  if (!machineData || !machineData.machineId) {
    return { status: 'unplanstop', label: 'Dừng không kế hoạch', color: 'error' };
  }
  return { status: 'running', label: 'Đang chạy', color: 'success' };
};

// Combined OEE + APQ Chart with 270-degree coverage
function OEEAPQCombinedChart({
  oee,
  availability,
  performance,
  quality,
}: {
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}) {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 400,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135, // 270-degree: -135 to 135
        endAngle: 135,
        track: {
          background: '#e7e7e7',
          strokeWidth: '70%',
          margin: 12, // Space between bars
        },
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#666',
            offsetY: 120,
          },
          value: {
            offsetY: 76,
            fontSize: '28px',
            fontWeight: 'bold',
            formatter: (val: number) => `${Math.round(val)}%`,
          },
          total: {
            show: true,
            label: 'OEE',
            fontSize: '18px',
            color: '#666',
            formatter: () => `${Math.round(oee)}%`,
          },
        },
        hollow: {
          size: '20%',
        },
      },
    },
    colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'], // OEE (Green), Availability (Blue), Performance (Orange), Quality (Purple)
    labels: ['OEE', 'Availability', 'Performance', 'Quality'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        size: 6,
        strokeWidth: 4,
        // radius: 12, // Rounded markers
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
    stroke: {
      lineCap: 'round', // Rounded corners
    },
  };

  const series = [oee, availability, performance, quality];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 3, // Rounded container corners
        p: 2,
      }}
    >
      <Chart options={chartOptions} series={series} type="radialBar" height={400} />
    </Box>
  );
}

// ApexCharts Timeline Visualization Component
function ApexTimelineVisualization({ records }: { records: CurrentMachineRunStateRecords[] }) {
  const getStateColor = (state?: string, isUnlabeled?: boolean) => {
    if (isUnlabeled) return '#ef4444'; // Red for unlabeled downtime
    if (state === 'running') return '#22c55e'; // Green
    if (state === 'speedLoss') return '#f59e0b'; // Orange
    if (state === 'unPlannedDowntime' || state === 'plannedDowntime') return '#64748b'; // Gray for labeled downtime
    return '#94a3b8'; // Light gray default
  };

  // Convert records to ApexCharts timeline format
  const timelineData = records.map((record, index) => {
    const isUnlabeled =
      record.stateId === '000000000000000000000000' &&
      (record.state === 'unPlannedDowntime' || record.state === 'plannedDowntime');
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

export function MachineOperationView() {
  // const { t } = useTranslation(); // TODO: Add translations when needed
  const router = useRouter();
  const { selectedMachine } = useMachineSelector();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Unified machine operation data state
  const [machineData, setMachineData] = useState<MachineOperationData>(() =>
    createEmptyMachineData(selectedMachine?.id, selectedMachine?.name)
  );

  const [timelineRecords, setTimelineRecords] = useState<CurrentMachineRunStateRecords[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [timelineView, setTimelineView] = useState<'current' | 'shift' | 'day'>('current');

  // Dialog states
  const [productChangeDialogOpen, setProductChangeDialogOpen] = useState(false);
  const [productTargetDialogOpen, setProductTargetDialogOpen] = useState(false);
  const [selectedProductForChange, setSelectedProductForChange] = useState<AvailableProduct | null>(null);
  const [targetQuantity, setTargetQuantity] = useState<string>('');
  const [addQuantityDialogOpen, setAddQuantityDialogOpen] = useState(false);
  const [addQuantityTabValue, setAddQuantityTabValue] = useState(0);
  const [quantityToAdd, setQuantityToAdd] = useState<string>('');
  const [quantityNote, setQuantityNote] = useState<string>('');
  const [quantityHistory, setQuantityHistory] = useState<QuantityAddHistory[]>([]);
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [editQuantityValue, setEditQuantityValue] = useState<string>('');
  const [editQuantityNote, setEditQuantityNote] = useState<string>('');
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Defect/Scrap dialog states
  const [addDefectDialogOpen, setAddDefectDialogOpen] = useState(false);
  const [defectTabValue, setDefectTabValue] = useState(0);
  const [defectTypes, setDefectTypes] = useState<DefectType[]>([]);
  const [defectEntries, setDefectEntries] = useState<Map<string, number>>(new Map());
  const [defectHistory, setDefectHistory] = useState<DefectSubmission[]>([]);

  // Label downtime dialog states
  const [labelDowntimeDialogOpen, setLabelDowntimeDialogOpen] = useState(false);
  const [downtimeTabValue, setDowntimeTabValue] = useState(0);
  const [stopReasons, setStopReasons] = useState<StopReason[]>([]);
  const [downtimeToLabel, setDowntimeToLabel] = useState<CurrentMachineRunStateRecords | null>(
    null
  );
  const [showReasonGrid, setShowReasonGrid] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [labelNote, setLabelNote] = useState<string>('');
  const [downtimeHistory, setDowntimeHistory] = useState<DowntimeLabelHistory[]>([]);

  const hubService = MachineHubService.getInstance(apiConfig.baseUrl);

  // Handle SignalR updates - merge with existing data
  const handleMachineUpdate = useCallback((update: MachineOeeUpdate) => {
    setMachineData((prev) => mergeSignalRUpdate(prev, update));
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

        // Load real data from APIs
        const machineId = selectedMachine.id || '';

        try {
          // Load product working state
          const productState = await getapimachineproductionmachineIdcurrentproductstate(machineId);
          if (mounted && productState) {
            setMachineData((prev) => mergeProductState(prev, productState));
          }
        } catch (error) {
          console.error('Failed to load product state:', error);
        }

        try {
          // Load timeline records
          const records = await getapimachineproductionmachineIdcurrentrunstaterecords(machineId);
          if (mounted && records) {
            setTimelineRecords(Array.isArray(records) ? records : []);
          }
        } catch (error) {
          console.error('Failed to load timeline data:', error);
        }

        try {
          // Load quantity history
          const history =
            await getapimachineproductionmachineIdaddexternalquantityhistory(machineId);
          if (mounted && history) {
            const formattedHistory: QuantityAddHistory[] = history.map((item) => ({
              id: item.id || `${item.createdAt}`, // Use actual ID from API
              timestamp: item.createdAt || new Date().toISOString(),
              addedQuantity: item.quantity || 0,
              addedBy: item.userAdded || 'Unknown',
              note: item.remark || undefined,
            }));
            setQuantityHistory(formattedHistory);
          }
        } catch (error) {
          console.error('Failed to load quantity history:', error);
        }

        try {
          // Load defect types
          const defectData = await getapiDefectReasongetdefectreasons({
            pageNumber: 0,
            pageSize: 100,
          });
          if (mounted && defectData?.items) {
            const formattedDefects: DefectType[] = defectData.items.map((item) => ({
              defectId: item.id || '',
              defectName: item.name || 'Unknown',
              imageUrl: undefined, // No image URL in API
              colorHex: item.colorHex || '#ef4444',
            }));
            setDefectTypes(formattedDefects);
          }
        } catch (error) {
          console.error('Failed to load defect types:', error);
        }

        try {
          // Load stop reasons
          const stopData = await getapiStopMachineReasongetreasonpage({
            PageNumber: 0,
            PageSize: 100,
          });
          if (mounted && stopData?.items) {
            const formattedReasons: StopReason[] = stopData.items.map((item) => ({
              reasonId: item.id || '',
              reasonName: item.name || 'Unknown',
              imageUrl: undefined, // No image URL in API
              colorHex: item.color || '#ef4444',
            }));
            setStopReasons(formattedReasons);
          }
        } catch (error) {
          console.error('Failed to load stop reasons:', error);
        }

        try {
          // Load defect history for current machine
          const defectHistoryResponse =
            await getapimachineproductionmachineIddefecteditems(machineId);
          if (mounted && defectHistoryResponse?.defectedItems) {
            const formattedDefectHistory: DefectSubmission[] =
              defectHistoryResponse.defectedItems.map((item) => ({
                id: item.createdAt || '',
                timestamp: item.createdAt || new Date().toISOString(),
                defects: [
                  {
                    defectId: '', // Not provided by API
                    defectName: item.defectReasonName || 'Unknown',
                    quantity: item.quantity || 0,
                    colorHex: item.defectReasonHexColor || '#ef4444',
                  },
                ],
                submittedBy: 'Unknown', // Not provided by API
              }));
            setDefectHistory(formattedDefectHistory);
          }
        } catch (error) {
          console.error('Failed to load defect history:', error);
        }

        await hubService.subscribeToMachine(selectedMachine.id || '', handleMachineUpdate);

        if (!mounted) return;

        const aggregation = await hubService.getMachineAggregation(selectedMachine.id || '');
        if (aggregation && mounted) {
          // Merge initial aggregation data
          setMachineData((prev) => ({
            ...prev,
            availability: aggregation.availability * 100,
            performance: aggregation.performance * 100,
            quality: aggregation.quality * 100,
            oee: aggregation.oee * 100,
            goodCount: aggregation.goodCount,
            totalCount: aggregation.totalCount,
            scrapQuantity:
              aggregation.scrappedCount ?? aggregation.totalCount - aggregation.goodCount,
            plannedQuantity: aggregation.plannedQuantity ?? prev.plannedQuantity,
            progressPercentage: aggregation.progressPercentage ?? prev.progressPercentage,
            runTime: aggregation.totalRunTime,
            downtime: aggregation.totalDowntime,
            speedLossTime: aggregation.totalSpeedLossTime,
            actualCycleTime: aggregation.actualCycleTime,
            estimatedFinishTime: aggregation.estimatedFinishTime,
          }));
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

  // Load available products when product change dialog opens
  useEffect(() => {
    if (!productChangeDialogOpen || !selectedMachine?.id) return;

    const loadAvailableProducts = async () => {
      try {
        const response = await getapiMachinemachineIdavailableproducts(selectedMachine.id || '', {
          page: 0,
          pageSize: 100,
        });

        if (response?.items) {
          const formattedProducts: AvailableProduct[] = response.items.map((item) => ({
            productId: item.productId || '',
            productCode: item.productCode || '',
            productName: item.productName || 'Unknown',
            imageUrl: item.imageUrl,
          }));
          setAvailableProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Failed to load available products:', error);
      }
    };

    loadAvailableProducts();
  }, [productChangeDialogOpen, selectedMachine?.id]);

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
      // F3 for add defect/scrap
      if (event.key === 'F3') {
        event.preventDefault();
        setAddDefectDialogOpen(true);
      }
      // F4 for label downtime
      if (event.key === 'F4') {
        event.preventDefault();
        setLabelDowntimeDialogOpen(true);
      }
      // Escape to close dialogs
      if (event.key === 'Escape') {
        setProductChangeDialogOpen(false);
        setAddQuantityDialogOpen(false);
        setAddDefectDialogOpen(false);
        setLabelDowntimeDialogOpen(false);
        setShowReasonGrid(false);
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
  }, [showKeyboardHelp, addQuantityDialogOpen, addDefectDialogOpen, labelDowntimeDialogOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    router.push('/oi/select-machine');
  };

  // Handle product selection - opens target dialog
  const handleProductClick = (product: AvailableProduct) => {
    setSelectedProductForChange(product);
    setTargetQuantity(''); // Reset target
    setProductTargetDialogOpen(true);
  };

  // Confirm product change with target quantity
  const handleConfirmProductChange = async () => {
    if (!selectedMachine?.id || !selectedProductForChange) return;

    const target = parseInt(targetQuantity, 10);
    if (!target || target <= 0) {
      // TODO: Show validation error
      return;
    }

    try {
      await postapimachineproductionmachineIdchangeproduct(selectedMachine.id, {
        productId: selectedProductForChange.productId,
        plannedQuantity: target,
      });

      // Reload product data after change
      const productState = await getapimachineproductionmachineIdcurrentproductstate(
        selectedMachine.id
      );
      if (productState) {
        setMachineData((prev) => mergeProductState(prev, productState));
      }

      // Close dialogs
      setProductTargetDialogOpen(false);
      setProductChangeDialogOpen(false);
      setSelectedProductForChange(null);
    } catch (error) {
      console.error('Failed to change product:', error);
      // TODO: Show error notification to user
    }
  };

  // Handle update target for currently running product
  const handleUpdateTarget = async () => {
    if (!selectedMachine?.id || !machineData.productId) return;

    const target = parseInt(targetQuantity, 10);
    if (!target || target <= 0) {
      // TODO: Show validation error
      return;
    }

    try {
      // Use the same API to update target for running product
      await postapimachineproductionmachineIdchangeproduct(selectedMachine.id, {
        productId: machineData.productId,
        plannedQuantity: target,
      });

      // Reload product data after update
      const productState = await getapimachineproductionmachineIdcurrentproductstate(
        selectedMachine.id
      );
      if (productState) {
        setMachineData((prev) => mergeProductState(prev, productState));
      }

      setProductTargetDialogOpen(false);
    } catch (error) {
      console.error('Failed to update target:', error);
      // TODO: Show error notification to user
    }
  };

  const handleAddQuantity = async () => {
    const qty = parseInt(quantityToAdd, 10);
    if (qty > 0 && selectedMachine?.id) {
      try {
        await postapimachineproductionmachineIdaddexternalquantity(selectedMachine.id, {
          quantity: qty,
          remark: quantityNote || undefined,
        });

        // Reload quantity history
        const history = await getapimachineproductionmachineIdaddexternalquantityhistory(
          selectedMachine.id
        );
        if (history) {
          const formattedHistory: QuantityAddHistory[] = history.map((item) => ({
            id: item.id || `${item.createdAt}`,
            timestamp: item.createdAt || new Date().toISOString(),
            addedQuantity: item.quantity || 0,
            addedBy: item.userAdded || 'Unknown',
            note: item.remark || undefined,
          }));
          setQuantityHistory(formattedHistory);
        }

        // Reload product data to get updated quantities
        const productState = await getapimachineproductionmachineIdcurrentproductstate(
          selectedMachine.id
        );
        if (productState) {
          setMachineData((prev) => mergeProductState(prev, productState));
        }

        // Reset form
        setQuantityToAdd('');
        setQuantityNote('');
        setAddQuantityDialogOpen(false);
        setAddQuantityTabValue(0);
      } catch (error) {
        console.error('Failed to add quantity:', error);
        // TODO: Show error notification to user
      }
    }
  };

  const handleEditQuantity = (history: QuantityAddHistory) => {
    setEditingQuantityId(history.id);
    setEditQuantityValue(String(history.addedQuantity));
    setEditQuantityNote(history.note || '');
  };

  const handleSaveEditQuantity = async (historyId: string) => {
    const newQty = parseInt(editQuantityValue, 10);
    if (newQty > 0 && selectedMachine?.id) {
      try {
        await postapimachineproductionmachineIdupdateexternalquantity(selectedMachine.id, {
          externalQuantityId: historyId,
          newQuantity: newQty,
          remark: editQuantityNote || undefined,
        });

        // Reload quantity history
        const history = await getapimachineproductionmachineIdaddexternalquantityhistory(
          selectedMachine.id
        );
        if (history) {
          const formattedHistory: QuantityAddHistory[] = history.map((item) => ({
            id: item.id || `${item.createdAt}`,
            timestamp: item.createdAt || new Date().toISOString(),
            addedQuantity: item.quantity || 0,
            addedBy: item.userAdded || 'Unknown',
            note: item.remark || undefined,
          }));
          setQuantityHistory(formattedHistory);
        }

        // Reload product data to get updated quantities
        const productState = await getapimachineproductionmachineIdcurrentproductstate(
          selectedMachine.id
        );
        if (productState) {
          setMachineData((prev) => mergeProductState(prev, productState));
        }

        // Reset edit state
        setEditingQuantityId(null);
        setEditQuantityValue('');
        setEditQuantityNote('');
      } catch (error) {
        console.error('Failed to update quantity:', error);
        // TODO: Show error notification to user
      }
    }
  };

  const handleCancelEditQuantity = () => {
    setEditingQuantityId(null);
    setEditQuantityValue('');
    setEditQuantityNote('');
  };

  const handleDeleteQuantity = async (historyId: string) => {
    if (!selectedMachine?.id) return;

    try {
      await deleteapimachineproductionmachineIdremoveexternalquantity(selectedMachine.id, {
        externalQuantityId: historyId,
      });

      // Reload quantity history
      const history = await getapimachineproductionmachineIdaddexternalquantityhistory(
        selectedMachine.id
      );
      if (history) {
        const formattedHistory: QuantityAddHistory[] = history.map((item) => ({
          id: item.id || `${item.createdAt}`,
          timestamp: item.createdAt || new Date().toISOString(),
          addedQuantity: item.quantity || 0,
          addedBy: item.userAdded || 'Unknown',
          note: item.remark || undefined,
        }));
        setQuantityHistory(formattedHistory);
      }

      // Reload product data to get updated quantities
      const productState = await getapimachineproductionmachineIdcurrentproductstate(
        selectedMachine.id
      );
      if (productState) {
        setMachineData((prev) => mergeProductState(prev, productState));
      }
    } catch (error) {
      console.error('Failed to delete quantity:', error);
      // TODO: Show error notification to user
    }
  };

  // Defect handling functions
  const handleDefectQuantityChange = (defectId: string, value: string) => {
    const qty = parseInt(value, 10);
    if (!Number.isNaN(qty) && qty > 0) {
      setDefectEntries(new Map(defectEntries.set(defectId, qty)));
    } else {
      const newMap = new Map(defectEntries);
      newMap.delete(defectId);
      setDefectEntries(newMap);
    }
  };

  const handleDefectIncrement = (defectId: string) => {
    const current = defectEntries.get(defectId) || 0;
    setDefectEntries(new Map(defectEntries.set(defectId, current + 1)));
  };

  const handleDefectDecrement = (defectId: string) => {
    const current = defectEntries.get(defectId) || 0;
    if (current > 1) {
      setDefectEntries(new Map(defectEntries.set(defectId, current - 1)));
    } else {
      const newMap = new Map(defectEntries);
      newMap.delete(defectId);
      setDefectEntries(newMap);
    }
  };

  const handleSubmitDefects = async () => {
    if (defectEntries.size === 0 || !selectedMachine?.id) return;

    try {
      // Submit each defect entry to the API
      for (const [defectId, quantity] of defectEntries.entries()) {
        await postapimachineproductionmachineIddefecteditemsaddnew(selectedMachine.id, {
          defectReasonId: defectId,
          quantity,
        });
      }

      // Reload defect history
      const defectHistoryResponse = await getapimachineproductionmachineIddefecteditems(
        selectedMachine.id
      );
      if (defectHistoryResponse?.defectedItems) {
        const formattedDefectHistory: DefectSubmission[] = defectHistoryResponse.defectedItems.map(
          (item) => ({
            id: item.createdAt || '',
            timestamp: item.createdAt || new Date().toISOString(),
            defects: [
              {
                defectId: '',
                defectName: item.defectReasonName || 'Unknown',
                quantity: item.quantity || 0,
                colorHex: item.defectReasonHexColor || '#ef4444',
              },
            ],
            submittedBy: 'Unknown',
          })
        );
        setDefectHistory(formattedDefectHistory);
      }

      // Reload product data to get updated scrap quantity
      const productState = await getapimachineproductionmachineIdcurrentproductstate(
        selectedMachine.id
      );
      if (productState) {
        setMachineData((prev) => mergeProductState(prev, productState));
      }

      // Reset form
      setDefectEntries(new Map());
      setAddDefectDialogOpen(false);
      setDefectTabValue(0);
    } catch (error) {
      console.error('Failed to submit defects:', error);
      // TODO: Show error notification to user
    }
  };

  // Downtime label handlers
  const calculateDuration = (start?: string, end?: string | null) => {
    if (!start) return 0;
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    return Math.round((endTime - startTime) / 60000); // Minutes
  };

  const handleLabelDowntime = (downtime: CurrentMachineRunStateRecords) => {
    setDowntimeToLabel(downtime);
    setShowReasonGrid(true);
  };

  const handleStopReasonToggle = (reasonId: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reasonId)) {
        return prev.filter((id) => id !== reasonId);
      }
      return [...prev, reasonId];
    });
  };

  const handleSubmitLabel = async () => {
    if (selectedReasons.length === 0 || !downtimeToLabel || !selectedMachine?.id) return;

    try {
      await postapimachineproductionmachineIdlabeldowntimerecord(selectedMachine.id, {
        startTime: downtimeToLabel.startTime || '',
        reasonIds: selectedReasons, // API now supports multiple reasons
        note: labelNote || undefined,
      });

      // Reload timeline records
      const records = await getapimachineproductionmachineIdcurrentrunstaterecords(
        selectedMachine.id
      );
      if (records) {
        setTimelineRecords(Array.isArray(records) ? records : []);
      }

      // Add to local history for UI display
      const reasons = selectedReasons.map((id) => {
        const reason = stopReasons.find((r) => r.reasonId === id);
        return {
          reasonId: id,
          reasonName: reason?.reasonName || 'Unknown',
          colorHex: reason?.colorHex || '#gray',
        };
      });

      const newLabel: DowntimeLabelHistory = {
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: downtimeToLabel.startTime,
        endTime: downtimeToLabel.endTime,
        duration: calculateDuration(downtimeToLabel.startTime, downtimeToLabel.endTime),
        reasons,
        note: labelNote,
        labeledBy: 'Current User', // TODO: Get from user context
      };

      setDowntimeHistory([newLabel, ...downtimeHistory]);

      // Reset and close
      setSelectedReasons([]);
      setLabelNote('');
      setShowReasonGrid(false);
      setDowntimeToLabel(null);
    } catch (error) {
      console.error('Failed to label downtime:', error);
      // TODO: Show error notification to user
    }
  };

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.productName.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const isCurrentProductRunning = !!machineData.productId;

  const unlabeledDowntimeCount = timelineRecords.filter(
    (record) =>
      record.stateId === '000000000000000000000000' &&
      (record.state === 'unPlannedDowntime' || record.state === 'plannedDowntime')
  ).length;

  // Get unlabeled downtimes sorted by newest first
  const unlabeledDowntimes = timelineRecords
    .filter(
      (record) =>
        record.stateId === '000000000000000000000000' &&
        (record.state === 'unPlannedDowntime' || record.state === 'plannedDowntime')
    )
    .sort((a, b) => {
      const timeA = new Date(a.startTime || '').getTime();
      const timeB = new Date(b.startTime || '').getTime();
      return timeB - timeA; // Newest first
    });

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
                onClick={() => setAddDefectDialogOpen(true)}
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
                onClick={() => setLabelDowntimeDialogOpen(true)}
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
            <Switch
              checked={testMode}
              onChange={async (e) => {
                const newTestMode = e.target.checked;
                setTestMode(newTestMode);

                // Call API to change run mode
                if (selectedMachine?.id) {
                  try {
                    await postapimachineproductionmachineIdchangerunmode(selectedMachine.id, {
                      testMode: newTestMode,
                    });
                  } catch (error) {
                    console.error('Failed to change run mode:', error);
                    // Revert the toggle on error
                    setTestMode(!newTestMode);
                  }
                }
              }}
            />
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

      {isConnecting && !machineData.machineId ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={64} />
        </Box>
      ) : (
        <Stack spacing={3}>
          {/* Timeline Container */}
          <Card sx={{ p: 3 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
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

                {/* Combined OEE + APQ Chart with 270-degree coverage */}
                <Box sx={{ mb: 3 }}>
                  <OEEAPQCombinedChart
                    oee={machineData.oee ?? 0}
                    availability={machineData.availability ?? 0}
                    performance={machineData.performance ?? 0}
                    quality={machineData.quality ?? 0}
                  />
                </Box>

                {/* OEE Formula */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    OEE = Availability × Performance × Quality
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {machineData.availability.toFixed(1) ?? '00.0'}% ×{' '}
                    {machineData.performance.toFixed(1) ?? '00.0'}% ×{' '}
                    {machineData.quality.toFixed(1) ?? '00.0'}% ={' '}
                    {machineData.oee.toFixed(1) ?? '00.0'}%
                  </Typography>
                </Box>

                {/* Downtime & Test Stats */}
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Iconify
                          icon="solar:danger-triangle-bold-duotone"
                          width={20}
                          sx={{ color: 'error.main' }}
                        />
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                          Downtime
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="error.main">
                        {machineData.downtime || '0.5'}h
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        3 lần
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Iconify
                          icon="solar:test-tube-bold"
                          width={20}
                          sx={{ color: 'warning.main' }}
                        />
                        <Typography
                          variant="body2"
                          color="warning.main"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Test Mode
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="warning.main">
                        0.12h
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 lần
                      </Typography>
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
                        src={`${apiConfig.baseUrl}/api/Product/${machineData.productId}/image`}
                        alt={machineData.productName || ''}
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
                        {machineData.productName || machineData.productName || 'N/A'}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={machineData.productionOrderNumber ?? ''}
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
                        {machineData.currentQuantity ?? 0} / {machineData.plannedQuantity ?? 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((machineData.currentQuantity ?? 0) / (machineData.plannedQuantity ?? 1)) *
                        100
                      }
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
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 'bold', color: 'success.main' }}
                      >
                        {(
                          ((machineData.currentQuantity ?? 0) /
                            (machineData.plannedQuantity ?? 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        100%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Completion Time */}
                  <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Iconify
                        icon="solar:clock-circle-bold"
                        width={20}
                        sx={{ color: 'info.main' }}
                      />
                      <Typography variant="body2" color="info.main" sx={{ fontWeight: 'bold' }}>
                        Thời gian hoàn thành dự kiến
                      </Typography>
                    </Stack>
                    <Typography variant="h6" color="info.main">
                      {machineData.estimatedFinishTime}
                    </Typography>
                  </Box>

                  {/* Quality Stats */}
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Tổng cộng
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {machineData.currentQuantity || machineData.totalCount || 0}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'success.lighter',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="success.main" sx={{ mb: 0.5 }}>
                          Đạt
                        </Typography>
                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {machineData.goodCount || machineData.goodCount || 0}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'error.lighter',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="error.main" sx={{ mb: 0.5 }}>
                          Lỗi
                        </Typography>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {machineData.scrapQuantity || 0}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Cycle Time */}
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          Nhịp lý tưởng
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {machineData.idealCycleTime ?? 'N/A'}s
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          Nhịp thực tế
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {machineData.actualCycleTime ?? 'N/A'}s
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Operator Info with Avatar */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'background.neutral',
                      borderRadius: 1,
                    }}
                  >
                    <Avatar
                      src={`${apiConfig.baseUrl}/api/User/${machineData.userId}/avatar-image`}
                      sx={{ width: 48, height: 48 }}
                    >
                      <Iconify icon="solar:user-circle-bold" width={48} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        Người vận hành
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {machineData.userId || 'N/A'}
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
            placeholder="Tìm kiếm sản phẩm..."
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
              },
            }}
          />

          {/* Product Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Mã sản phẩm</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => {
                  const isRunning = machineData.productId === product.productId;
                  return (
                    <TableRow key={product.productId} hover>
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
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
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
                            ) : (
                              <Box sx={{ fontSize: '20px' }}>📦</Box>
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {product.productName}
                            </Typography>
                            {isRunning && (
                              <Chip label="Đang chạy" size="small" color="success" sx={{ mt: 0.5 }} />
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{product.productCode}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant={isRunning ? 'outlined' : 'contained'}
                          onClick={() => {
                            if (isRunning) {
                              // For running product, open target dialog for update
                              setSelectedProductForChange(product);
                              setTargetQuantity(String(machineData.plannedQuantity || ''));
                              setProductTargetDialogOpen(true);
                            } else {
                              // For new product, open target dialog for selection
                              handleProductClick(product);
                            }
                          }}
                        >
                          {isRunning ? 'Cập nhật' : 'Chọn'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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

      {/* Product Target Dialog */}
      <Dialog
        open={productTargetDialogOpen}
        onClose={() => setProductTargetDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {selectedProductForChange?.productId === machineData.productId
            ? 'Cập nhật mục tiêu'
            : 'Nhập mục tiêu sản xuất'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Sản phẩm: {selectedProductForChange?.productName}
            </Typography>
            <TextField
              fullWidth
              label="Số lượng mục tiêu"
              type="number"
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(e.target.value)}
              placeholder="Nhập số lượng..."
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductTargetDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={
              selectedProductForChange?.productId === machineData.productId
                ? handleUpdateTarget
                : handleConfirmProductChange
            }
            variant="contained"
            disabled={!targetQuantity || parseInt(targetQuantity, 10) <= 0}
          >
            {selectedProductForChange?.productId === machineData.productId
              ? 'Cập nhật'
              : 'Xác nhận'}
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
            <Stack spacing={3} height="700px">
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
                  },
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
                <Button variant="outlined" onClick={() => setAddQuantityDialogOpen(false)}>
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
            <TableContainer style={{ height: '700px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thời gian</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell>Người thêm</TableCell>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quantityHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Chưa có lịch sử thêm số lượng
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    quantityHistory.map((history) => (
                      <TableRow key={history.id} hover>
                        <TableCell>{new Date(history.timestamp).toLocaleString('vi-VN')}</TableCell>
                        <TableCell align="center">
                          {editingQuantityId === history.id ? (
                            <TextField
                              size="small"
                              type="number"
                              value={editQuantityValue}
                              onChange={(e) => setEditQuantityValue(e.target.value)}
                              sx={{ width: '100px' }}
                            />
                          ) : (
                            <Chip
                              label={`+${history.addedQuantity}`}
                              size="small"
                              color="success"
                            />
                          )}
                        </TableCell>
                        <TableCell>{history.addedBy}</TableCell>
                        <TableCell>
                          {editingQuantityId === history.id ? (
                            <TextField
                              size="small"
                              fullWidth
                              value={editQuantityNote}
                              onChange={(e) => setEditQuantityNote(e.target.value)}
                              placeholder="Ghi chú"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {history.note || '-'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {editingQuantityId === history.id ? (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleSaveEditQuantity(history.id)}
                              >
                                <Iconify icon="solar:check-circle-bold" />
                              </IconButton>
                              <IconButton size="small" onClick={handleCancelEditQuantity}>
                                <Iconify icon="mingcute:close-line" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton size="small" onClick={() => handleEditQuantity(history)}>
                                <Iconify icon="solar:pen-bold" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteQuantity(history.id)}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Box>
                          )}
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

      {/* Add Defect/Scrap Dialog */}
      <Dialog
        open={addDefectDialogOpen}
        onClose={() => setAddDefectDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Nhập lỗi/Scrap
            </Typography>
            <IconButton onClick={() => setAddDefectDialogOpen(false)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={defectTabValue}
            onChange={(e, newValue) => setDefectTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Nhập lỗi" />
            <Tab label="Lịch sử" />
          </Tabs>

          {/* Tab 1: Add Defects Grid */}
          {defectTabValue === 0 && (
            <Box sx={{ height: 600, overflow: 'auto' }}>
              <Grid container spacing={2}>
                {defectTypes.map((defect) => {
                  const quantity = defectEntries.get(defect.defectId) || 0;

                  return (
                    <Grid key={defect.defectId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        sx={{
                          p: 2,
                          borderLeft: 4,
                          borderColor: defect.colorHex,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Defect image/icon */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 100,
                            borderRadius: 1,
                            bgcolor: defect.colorHex,
                            opacity: 0.15,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            position: 'relative',
                          }}
                        >
                          {defect.imageUrl ? (
                            <img
                              src={defect.imageUrl}
                              alt={defect.defectName}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <Typography
                              variant="h1"
                              sx={{
                                color: defect.colorHex,
                                opacity: 0.7,
                              }}
                            >
                              ⚠️
                            </Typography>
                          )}
                        </Box>

                        {/* Defect name */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            color: defect.colorHex,
                          }}
                        >
                          {defect.defectName}
                        </Typography>

                        {/* Quantity controls */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 'auto' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDefectDecrement(defect.defectId)}
                            disabled={quantity === 0}
                            sx={{
                              border: 1,
                              borderColor: defect.colorHex,
                              color: defect.colorHex,
                            }}
                          >
                            <Iconify icon="eva:minus-fill" />
                          </IconButton>

                          <TextField
                            size="small"
                            value={quantity || ''}
                            onChange={(e) =>
                              handleDefectQuantityChange(defect.defectId, e.target.value)
                            }
                            type="number"
                            sx={{ flex: 1 }}
                            slotProps={{
                              input: {
                                sx: { textAlign: 'center' },
                              },
                            }}
                            placeholder="0"
                          />

                          <IconButton
                            size="small"
                            onClick={() => handleDefectIncrement(defect.defectId)}
                            sx={{
                              border: 1,
                              borderColor: defect.colorHex,
                              bgcolor: defect.colorHex,
                              color: 'white',
                              '&:hover': {
                                bgcolor: defect.colorHex,
                                opacity: 0.9,
                              },
                            }}
                          >
                            <Iconify icon="eva:plus-fill" />
                          </IconButton>
                        </Box>

                        {/* Show current quantity if > 0 */}
                        {quantity > 0 && (
                          <Chip
                            label={`${quantity} lỗi`}
                            size="small"
                            sx={{
                              mt: 1,
                              bgcolor: defect.colorHex,
                              color: 'white',
                            }}
                          />
                        )}
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Submit button */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="outlined" onClick={() => setAddDefectDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleSubmitDefects}
                  disabled={defectEntries.size === 0}
                  startIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  Xác nhận ({Array.from(defectEntries.values()).reduce((sum, qty) => sum + qty, 0)}{' '}
                  lỗi)
                </Button>
              </Box>
            </Box>
          )}

          {/* Tab 2: History Grid */}
          {defectTabValue === 1 && (
            <Box sx={{ height: 600, overflow: 'auto' }}>
              {defectHistory.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có lịch sử nhập lỗi
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={3}>
                  {defectHistory.map((submission) => (
                    <Card key={submission.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(submission.timestamp).toLocaleString('vi-VN')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {submission.submittedBy}
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {submission.defects.map((defect) => (
                          <Grid key={defect.defectId} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box
                              sx={{
                                p: 2,
                                borderLeft: 4,
                                borderColor: defect.colorHex,
                                bgcolor: 'background.neutral',
                                borderRadius: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 'bold',
                                  color: defect.colorHex,
                                }}
                              >
                                {defect.defectName}
                              </Typography>
                              <Chip
                                label={`${defect.quantity}`}
                                size="small"
                                sx={{
                                  bgcolor: defect.colorHex,
                                  color: 'white',
                                }}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Label Downtime Dialog */}
      <Dialog
        open={labelDowntimeDialogOpen}
        onClose={() => {
          setLabelDowntimeDialogOpen(false);
          setDowntimeTabValue(0);
          setShowReasonGrid(false);
          setDowntimeToLabel(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: 600 },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Lý do dừng máy</Typography>
            <IconButton
              onClick={() => {
                setLabelDowntimeDialogOpen(false);
                setDowntimeTabValue(0);
                setShowReasonGrid(false);
                setDowntimeToLabel(null);
              }}
            >
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
          <Tabs value={downtimeTabValue} onChange={(e, value) => setDowntimeTabValue(value)}>
            <Tab label="Cần gán nhãn" />
            <Tab label="Lịch sử" />
          </Tabs>
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 400 }}>
          {/* Tab 1: Unlabeled Downtimes */}
          {downtimeTabValue === 0 && (
            <Box>
              {showReasonGrid && downtimeToLabel ? (
                // Show reason selection grid
                <Box>
                  <Button
                    startIcon={<Iconify icon="eva:arrow-back-fill" />}
                    onClick={() => {
                      setShowReasonGrid(false);
                      setDowntimeToLabel(null);
                      setSelectedReasons([]);
                      setLabelNote('');
                    }}
                    sx={{ mb: 2 }}
                  >
                    Quay lại
                  </Button>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Thời gian:{' '}
                    {downtimeToLabel.startTime
                      ? new Date(downtimeToLabel.startTime).toLocaleString()
                      : 'N/A'}{' '}
                    -
                    {downtimeToLabel.endTime
                      ? new Date(downtimeToLabel.endTime).toLocaleString()
                      : ' Đang diễn ra'}{' '}
                    ({calculateDuration(downtimeToLabel.startTime, downtimeToLabel.endTime)} phút)
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {stopReasons.map((reason) => (
                      <Grid key={reason.reasonId} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            borderLeft: 4,
                            borderColor: reason.colorHex,
                            bgcolor: selectedReasons.includes(reason.reasonId)
                              ? `${reason.colorHex}20`
                              : 'background.paper',
                            '&:hover': {
                              bgcolor: `${reason.colorHex}10`,
                            },
                          }}
                          onClick={() => handleStopReasonToggle(reason.reasonId)}
                        >
                          <Box
                            sx={{
                              height: 100,
                              bgcolor: `${reason.colorHex}15`,
                              borderRadius: 1,
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '2rem',
                            }}
                          >
                            {reason.imageUrl ? (
                              <img
                                src={reason.imageUrl}
                                alt={reason.reasonName}
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                              />
                            ) : (
                              '⚠️'
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 'bold', color: reason.colorHex }}
                            >
                              {reason.reasonName}
                            </Typography>
                            <Iconify
                              icon={
                                selectedReasons.includes(reason.reasonId)
                                  ? 'eva:checkmark-square-2-fill'
                                  : 'eva:square-outline'
                              }
                              sx={{ color: reason.colorHex }}
                            />
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    label="Ghi chú (tùy chọn)"
                    value={labelNote}
                    onChange={(e) => setLabelNote(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmitLabel}
                    disabled={selectedReasons.length === 0}
                  >
                    Xác nhận ({selectedReasons.length} lý do)
                  </Button>
                </Box>
              ) : (
                // Show unlabeled downtimes list
                <Stack spacing={2}>
                  {unlabeledDowntimes.length === 0 ? (
                    <Alert severity="success">Không có thời gian dừng cần gán nhãn</Alert>
                  ) : (
                    unlabeledDowntimes.map((downtime, index) => {
                      const isOngoing = !downtime.endTime;
                      const duration = calculateDuration(downtime.startTime, downtime.endTime);

                      return (
                        <Card key={`${downtime.startTime}-${index}`} sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {downtime.startTime
                                  ? new Date(downtime.startTime).toLocaleString()
                                  : 'N/A'}{' '}
                                -
                                {downtime.endTime
                                  ? new Date(downtime.endTime).toLocaleString()
                                  : ' Đang diễn ra'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip
                                  icon={<Iconify icon="eva:clock-outline" />}
                                  label={`${duration} phút`}
                                  size="small"
                                  color="default"
                                />
                                {isOngoing && (
                                  <Chip label="Đang diễn ra" size="small" color="error" />
                                )}
                              </Box>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleLabelDowntime(downtime)}
                            >
                              Gán nhãn
                            </Button>
                          </Box>
                        </Card>
                      );
                    })
                  )}
                </Stack>
              )}
            </Box>
          )}

          {/* Tab 2: Labeled Downtime History */}
          {downtimeTabValue === 1 && (
            <Box>
              {downtimeHistory.length === 0 ? (
                <Alert severity="info">Chưa có lịch sử gán nhãn</Alert>
              ) : (
                <Stack spacing={2}>
                  {downtimeHistory.map((history) => (
                    <Card key={history.id} sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {history.startTime ? new Date(history.startTime).toLocaleString() : 'N/A'}{' '}
                          -
                          {history.endTime
                            ? new Date(history.endTime).toLocaleString()
                            : ' Đang diễn ra'}{' '}
                          ({history.duration} phút)
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Gán bởi: {history.labeledBy} •{' '}
                          {new Date(history.timestamp).toLocaleString()}
                        </Typography>
                      </Box>

                      <Grid container spacing={1} sx={{ mb: history.note ? 2 : 0 }}>
                        {history.reasons.map((reason) => (
                          <Grid key={reason.reasonId} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box
                              sx={{
                                p: 1,
                                borderLeft: 4,
                                borderColor: reason.colorHex,
                                bgcolor: `${reason.colorHex}10`,
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 'bold', color: reason.colorHex }}
                              >
                                {reason.reasonName}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {history.note && (
                        <Box sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Ghi chú:
                          </Typography>
                          <Typography variant="body2">{history.note}</Typography>
                        </Box>
                      )}
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Keyboard Help Dialog */}
      <Dialog open={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} maxWidth="sm">
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
