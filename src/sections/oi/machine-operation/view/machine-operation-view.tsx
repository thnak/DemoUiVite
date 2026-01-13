import type { ApexOptions } from 'apexcharts';
import type { MachineOeeUpdate } from 'src/services/machineHub';
import type { CurrentMachineRunStateRecords, ProductWorkingStateByMachine as BaseProductWorkingState } from 'src/api/types/generated';

// Extended type with legacy fields for backward compatibility
type ProductWorkingStateByMachine = BaseProductWorkingState & {
  currentQuantity?: number;
  goodQuantity?: number;
  scrapQuantity?: number;
  actualCycleTime?: string;
};

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
  getapimachineproductionmachineIdaddexternalquantityhistory,
} from 'src/api/services/generated/machine-production';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../../context';

// ----------------------------------------------------------------------

// Mapped product interface for product change dialog
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

const getMachineStatus = (machineData: MachineOeeUpdate | null): MachineStatus => {
  if (!machineData) {
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
        strokeWidth: 4
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
    const isUnlabeled = record.stateId === '000000000000000000000000' && 
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
  const [downtimeToLabel, setDowntimeToLabel] = useState<CurrentMachineRunStateRecords | null>(null);
  const [showReasonGrid, setShowReasonGrid] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [labelNote, setLabelNote] = useState<string>('');
  const [downtimeHistory, setDowntimeHistory] = useState<DowntimeLabelHistory[]>([]);

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
        
        // Load real data from APIs
        const machineId = selectedMachine.id || '';
        
        try {
          // Load product working state
          const productState = await getapimachineproductionmachineIdcurrentproductstate(machineId);
          if (mounted && productState) {
            setProductData(productState);
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
          const history = await getapimachineproductionmachineIdaddexternalquantityhistory(machineId);
          if (mounted && history) {
            const formattedHistory: QuantityAddHistory[] = history.map((item) => ({
              id: `${item.createdAt}`, // Use timestamp as ID since there's no id field
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
          const stopData = await getapiStopMachineReasongetreasonpage([], {
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
          const defectHistoryResponse = await getapimachineproductionmachineIddefecteditems(machineId);
          if (mounted && defectHistoryResponse?.defectedItems) {
            const formattedDefectHistory: DefectSubmission[] = defectHistoryResponse.defectedItems.map((item) => ({
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

  // Load available products when product change dialog opens
  useEffect(() => {
    if (!productChangeDialogOpen || !selectedMachine?.id) return;

    const loadAvailableProducts = async () => {
      try {
        const response = await getapiMachinemachineIdavailableproducts(
          selectedMachine.id || '',
          { page: 0, pageSize: 100 }
        );
        
        if (response?.items) {
          const formattedProducts: MappedProduct[] = response.items.map((item) => ({
            id: item.productId || '',
            productId: item.productId || '',
            productName: item.productName || 'Unknown',
            productionOrderNumber: item.productionOrderNumber || '',
            targetQuantity: item.plannedQuantity || 0,
            currentQuantity: 0, // Will be updated from real data
            isActive: false, // Will be determined by comparing with current product
            startTime: new Date().toISOString(),
          }));
          setMappedProducts(formattedProducts);
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

  const handleProductSelect = async (product: MappedProduct) => {
    if (!selectedMachine?.id) return;
    
    try {
      await postapimachineproductionmachineIdchangeproduct(selectedMachine.id, {
        productId: product.productId,
        productionOrderNumber: product.productionOrderNumber,
        plannedQuantity: product.targetQuantity,
      });
      
      // Reload product data after change
      const productState = await getapimachineproductionmachineIdcurrentproductstate(selectedMachine.id);
      if (productState) {
        setProductData(productState);
      }
      
      setProductChangeDialogOpen(false);
    } catch (error) {
      console.error('Failed to change product:', error);
      // TODO: Show error notification to user
    }
  };

  const handleUpdateTarget = (productId: string, newTarget: number) => {
    // TODO: Implement target update logic if API is available
    console.log('Update target:', productId, newTarget);
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
        const history = await getapimachineproductionmachineIdaddexternalquantityhistory(selectedMachine.id);
        if (history) {
          const formattedHistory: QuantityAddHistory[] = history.map((item) => ({
            id: `${item.createdAt}`,
            timestamp: item.createdAt || new Date().toISOString(),
            addedQuantity: item.quantity || 0,
            addedBy: item.userAdded || 'Unknown',
            note: item.remark || undefined,
          }));
          setQuantityHistory(formattedHistory);
        }
        
        // Reload product data to get updated quantities
        const productState = await getapimachineproductionmachineIdcurrentproductstate(selectedMachine.id);
        if (productState) {
          setProductData(productState);
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
      const defectHistoryResponse = await getapimachineproductionmachineIddefecteditems(selectedMachine.id);
      if (defectHistoryResponse?.defectedItems) {
        const formattedDefectHistory: DefectSubmission[] = defectHistoryResponse.defectedItems.map((item) => ({
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
        }));
        setDefectHistory(formattedDefectHistory);
      }
      
      // Reload product data to get updated scrap quantity
      const productState = await getapimachineproductionmachineIdcurrentproductstate(selectedMachine.id);
      if (productState) {
        setProductData(productState);
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
      const records = await getapimachineproductionmachineIdcurrentrunstaterecords(selectedMachine.id);
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

  const filteredProducts = mappedProducts.filter(product =>
    product.productName.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.productionOrderNumber.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const unlabeledDowntimeCount = timelineRecords.filter(
    record => record.stateId === '000000000000000000000000' && 
             (record.state === 'unPlannedDowntime' || record.state === 'plannedDowntime')
  ).length;

  // Get unlabeled downtimes sorted by newest first
  const unlabeledDowntimes = timelineRecords
    .filter(record => record.stateId === '000000000000000000000000' && 
                     (record.state === 'unPlannedDowntime' || record.state === 'plannedDowntime'))
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
                
                {/* Combined OEE + APQ Chart with 270-degree coverage */}
                <Box sx={{ mb: 3 }}>
                  <OEEAPQCombinedChart
                    oee={machineData?.oee || 85}
                    availability={machineData?.availability || 92}
                    performance={machineData?.performance || 95}
                    quality={machineData?.quality || 97}
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
            <Stack spacing={3} height='700px'>
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
            <TableContainer style={{ height: '700px' }}>
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
                            onChange={(e) => handleDefectQuantityChange(defect.defectId, e.target.value)}
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
                <Button 
                  variant="outlined" 
                  onClick={() => setAddDefectDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={handleSubmitDefects}
                  disabled={defectEntries.size === 0}
                  startIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  Xác nhận ({Array.from(defectEntries.values()).reduce((sum, qty) => sum + qty, 0)} lỗi)
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
                    Thời gian: {downtimeToLabel.startTime ? new Date(downtimeToLabel.startTime).toLocaleString() : 'N/A'} - 
                    {downtimeToLabel.endTime ? new Date(downtimeToLabel.endTime).toLocaleString() : ' Đang diễn ra'}
                    {' '}({calculateDuration(downtimeToLabel.startTime, downtimeToLabel.endTime)} phút)
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
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {downtime.startTime ? new Date(downtime.startTime).toLocaleString() : 'N/A'} - 
                                {downtime.endTime ? new Date(downtime.endTime).toLocaleString() : ' Đang diễn ra'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip
                                  icon={<Iconify icon="eva:clock-outline" />}
                                  label={`${duration} phút`}
                                  size="small"
                                  color="default"
                                />
                                {isOngoing && (
                                  <Chip
                                    label="Đang diễn ra"
                                    size="small"
                                    color="error"
                                  />
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
                          {history.startTime ? new Date(history.startTime).toLocaleString() : 'N/A'} - 
                          {history.endTime ? new Date(history.endTime).toLocaleString() : ' Đang diễn ra'}
                          {' '}({history.duration} phút)
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Gán bởi: {history.labeledBy} • {new Date(history.timestamp).toLocaleString()}
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
