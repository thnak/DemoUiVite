import type { CurrentMachineRunStateRecords } from 'src/api/types/generated';
import type { MachineOeeUpdate, MachineRuntimeBlock } from 'src/services/machineHub';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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

import { fDuration, fRelativeTime } from 'src/utils/format-time';

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
import {
  getMachineStatus,
  calculateDuration,
  mergeProductState,
  mergeSignalRUpdate,
  createEmptyMachineData,
} from '../types';
import {
  OEEAPQChart,
  AddDefectDialog,
  AddQuantityDialog,
  KeyboardHelpDialog,
  LabelDowntimeDialog,
  TimelineVisualization,
} from '../components';

import type {
  DefectType,
  StopReason,
  TimelineView,
  AvailableProduct,
  DefectSubmission,
  QuantityAddHistory,
  DowntimeLabelHistory,
  MachineOperationData,
} from '../types';

// ----------------------------------------------------------------------

export function MachineOperationView() {
  const { t } = useTranslation();
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
  const [timelineView, setTimelineView] = useState<TimelineView>('current');

  // Dialog states
  const [productChangeDialogOpen, setProductChangeDialogOpen] = useState(false);
  const [productTargetDialogOpen, setProductTargetDialogOpen] = useState(false);
  const [selectedProductForChange, setSelectedProductForChange] = useState<AvailableProduct | null>(null);
  const [targetQuantity, setTargetQuantity] = useState<string>('');
  const [addQuantityDialogOpen, setAddQuantityDialogOpen] = useState(false);
  const [quantityHistory, setQuantityHistory] = useState<QuantityAddHistory[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Defect/Scrap dialog states
  const [addDefectDialogOpen, setAddDefectDialogOpen] = useState(false);
  const [defectTypes, setDefectTypes] = useState<DefectType[]>([]);
  const [defectHistory, setDefectHistory] = useState<DefectSubmission[]>([]);

  // Label downtime dialog states
  const [labelDowntimeDialogOpen, setLabelDowntimeDialogOpen] = useState(false);
  const [stopReasons, setStopReasons] = useState<StopReason[]>([]);
  const [downtimeHistory, setDowntimeHistory] = useState<DowntimeLabelHistory[]>([]);

  const hubService = MachineHubService.getInstance(apiConfig.baseUrl);

  // Handle SignalR updates - merge with existing data
  const handleMachineUpdate = useCallback((update: MachineOeeUpdate) => {
    setMachineData((prev) => mergeSignalRUpdate(prev, update));
  }, []);

  // Handle runtime block updates - updates timeline with new blocks
  const handleRuntimeBlockUpdate = useCallback((block: MachineRuntimeBlock) => {
    setTimelineRecords((prevRecords) => {
      // Check if block with same startTime already exists
      const existingIndex = prevRecords.findIndex(
        (record) => record.startTime === block.startTime
      );

      if (existingIndex >= 0) {
        // Update existing block
        const newRecords = [...prevRecords];
        newRecords[existingIndex] = {
          ...newRecords[existingIndex],
          endTime: block.endTime,
          state: block.state as any, // Map MachineRunState to MachineOutputRunState
          stateId: block.stopReasonId,
          stateName: block.name,
          isUnplannedDowntime: block.isUnplannedDowntime,
        };
        return newRecords;
      }

      // Add new block at the end
      return [
        ...prevRecords,
        {
          stateId: block.stopReasonId,
          startTime: block.startTime,
          endTime: block.endTime,
          state: block.state as any, // Map to proper state
          stateName: block.name,
          isUnplannedDowntime: block.isUnplannedDowntime,
        },
      ];
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
            setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
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

        await hubService.subscribeToMachine(
          selectedMachine.id || '',
          handleMachineUpdate,
          handleRuntimeBlockUpdate
        );

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
        setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
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
        setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
      }

      setProductTargetDialogOpen(false);
    } catch (error) {
      console.error('Failed to update target:', error);
      // TODO: Show error notification to user
    }
  };

  // Wrapper for AddQuantityDialog - receives quantity and note as parameters
  const handleAddQuantitySubmit = async (quantity: number, note: string) => {
    if (!selectedMachine?.id) return;

    try {
      await postapimachineproductionmachineIdaddexternalquantity(selectedMachine.id, {
        quantity,
        remark: note || undefined,
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
        setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
      }
    } catch (error) {
      console.error('Failed to add quantity:', error);
      // TODO: Show error notification to user
    }
  };


  const handleSaveEditQuantity = async (historyId: string, newQty: number, note: string) => {
    if (!selectedMachine?.id) return;

    try {
      await postapimachineproductionmachineIdupdateexternalquantity(selectedMachine.id, {
        externalQuantityId: historyId,
        newQuantity: newQty,
        remark: note || undefined,
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
        setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // TODO: Show error notification to user
    }
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
        setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
      }
    } catch (error) {
      console.error('Failed to delete quantity:', error);
      // TODO: Show error notification to user
    }
  };

  // Wrapper for AddDefectDialog - receives defect entries as parameter
  const handleSubmitDefectsWrapper = async (defectEntries: Map<string, number>) => {
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
        setMachineData((prev) => mergeProductState(prev, productState, apiConfig.baseUrl));
      }
    } catch (error) {
      console.error('Failed to submit defects:', error);
      // TODO: Show error notification to user
    }
  };

  // Downtime label handlers

  // Wrapper for LabelDowntimeDialog component
  const handleLabelDowntimeSubmit = async (
    downtime: CurrentMachineRunStateRecords,
    reasonIds: string[],
    note: string
  ) => {
    if (reasonIds.length === 0 || !selectedMachine?.id) return;

    try {
      await postapimachineproductionmachineIdlabeldowntimerecord(selectedMachine.id, {
        startTime: downtime.startTime || '',
        reasonIds,
        note: note || undefined,
      });

      // Reload timeline records
      const records = await getapimachineproductionmachineIdcurrentrunstaterecords(
        selectedMachine.id
      );
      if (records) {
        setTimelineRecords(Array.isArray(records) ? records : []);
      }

      // Add to local history for UI display
      const reasons = reasonIds.map((id) => {
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
        startTime: downtime.startTime,
        endTime: downtime.endTime,
        duration: calculateDuration(downtime.startTime, downtime.endTime),
        reasons,
        note,
        labeledBy: 'Current User', // TODO: Get from user context
      };

      setDowntimeHistory([newLabel, ...downtimeHistory]);
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
                  {t('oi.operation.changeProduct')}
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
                {t('oi.operation.addProduct')}
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
                {t('oi.operation.inputDefect')}
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
                {t('oi.operation.stopReason')}
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
              <TimelineVisualization records={timelineRecords} />
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
                  <OEEAPQChart
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
                        {fDuration(machineData.downtime)}
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
                        {fDuration(machineData.totalTestRunTime)}
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
                      {machineData.productImageUrl ? (
                        <img
                          key={machineData.productId} // Force re-render on product change
                          src={machineData.productImageUrl}
                          alt={machineData.productName ?? ''}
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
                      ) : (
                        <Box
                          sx={{
                            fontSize: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          📦
                        </Box>
                      )}
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
                      {fRelativeTime(machineData.estimatedFinishTime)}
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
                          {fDuration(machineData.idealCycleTime)}
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
                          {fDuration(machineData.actualCycleTime)}
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
                        {machineData.userName || 'N/A'}
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
                                key={product.productId} // Force re-render on product change
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
      <AddQuantityDialog
        open={addQuantityDialogOpen}
        onClose={() => setAddQuantityDialogOpen(false)}
        quantityHistory={quantityHistory}
        onAdd={handleAddQuantitySubmit}
        onEdit={handleSaveEditQuantity}
        onDelete={handleDeleteQuantity}
      />

      {/* Add Defect/Scrap Dialog */}
      <AddDefectDialog
        open={addDefectDialogOpen}
        onClose={() => setAddDefectDialogOpen(false)}
        defectTypes={defectTypes}
        defectHistory={defectHistory}
        onSubmit={handleSubmitDefectsWrapper}
      />

      {/* Label Downtime Dialog */}
      <LabelDowntimeDialog
        open={labelDowntimeDialogOpen}
        onClose={() => setLabelDowntimeDialogOpen(false)}
        unlabeledDowntimes={unlabeledDowntimes}
        stopReasons={stopReasons}
        downtimeHistory={downtimeHistory}
        onLabelDowntime={handleLabelDowntimeSubmit}
      />

      {/* Keyboard Help Dialog */}
      <KeyboardHelpDialog
        open={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </Container>
  );
}
