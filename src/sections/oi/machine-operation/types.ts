/**
 * Types and interfaces for Machine Operation View
 */

import type { MachineOeeUpdate } from 'src/services/machineHub';
import type { GetCurrentProductByMachineResult } from 'src/api/types/generated';

/**
 * Unified interface for all machine operation data
 * Combines OEE metrics from SignalR with product working state from API
 */
export interface MachineOperationData {
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
  totalTestRunTime: string; // ISO 8601 duration
  estimatedFinishTime?: string; // ISO 8601 date-time

  // Product information (from API GetCurrentProductByMachineResult)
  productId?: string;
  productImageUrl?: string; // Product image URL for faster loading
  productName: string; // Falls back to currentProductName from SignalR
  productionOrderNumber?: string;
  currentQuantity: number; // Falls back to totalCount
  plannedQuantity: number;
  idealCycleTime?: string;
  actualCycleTime?: string;
  userId?: string;
  userName: string;
  startTime?: string;

  // Progress calculation
  progressPercentage: number; // Calculated from currentQuantity / plannedQuantity
}

/**
 * Create initial empty machine operation data
 */
export const createEmptyMachineData = (
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
  totalTestRunTime: 'PT0S',
  productName: '',
  currentQuantity: 0,
  plannedQuantity: 0,
  progressPercentage: 0,
  userName: ''
});

/**
 * Merge SignalR update with existing data
 */
export const mergeSignalRUpdate = (
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
  totalTestRunTime: update.totalTestRunTime ?? existing.totalTestRunTime,
  estimatedFinishTime: update.estimatedFinishTime,
  // Preserve existing product data unless we have better info
  currentQuantity: update.totalCount || existing.currentQuantity,
  actualCycleTime: update.actualCycleTime ?? 0
});

/**
 * Merge API product state with existing data
 */
export const mergeProductState = (
  existing: MachineOperationData,
  productState: GetCurrentProductByMachineResult,
  baseUrl: string
): MachineOperationData => ({
  ...existing,
  productId: productState.productId,
  productImageUrl: productState.productId
    ? `${baseUrl}/api/Product/${productState.productId}/image`
    : undefined,
  productName: productState.productName,
  productionOrderNumber: productState.productionOrderNumber,
  plannedQuantity: productState.plannedQuantity,
  userId: productState.userId,
  userName: productState.userName,
  idealCycleTime: productState.idealCycleTime,
  progressPercentage:
    productState.plannedQuantity && existing.currentQuantity
      ? (existing.currentQuantity / productState.plannedQuantity) * 100
      : existing.progressPercentage,
});

// Simplified product interface for product change dialog
export interface AvailableProduct {
  productId: string;
  productCode: string;
  productName: string;
  imageUrl?: string | null;
}

// Quantity add history interface
export interface QuantityAddHistory {
  id: string;
  timestamp: string;
  addedQuantity: number;
  addedBy: string;
  note?: string;
}

export interface DefectType {
  defectId: string;
  defectName: string;
  imageUrl?: string;
  colorHex: string;
  allowMultipleDefectsPerUnit?: boolean;
}

export interface DefectSubmission {
  id: string;
  timestamp: string;
  defects: Array<{ defectId: string; defectName: string; quantity: number; colorHex: string }>;
  submittedBy: string;
}

// Stop reason interfaces for downtime labeling
export interface StopReason {
  reasonId: string;
  reasonName: string;
  imageUrl?: string;
  colorHex: string;
}

export interface DowntimeLabelHistory {
  id: string;
  timestamp: string;
  startTime?: string;
  endTime?: string | null;
  duration: number; // in minutes
  reasons: Array<{ reasonId: string; reasonName: string; colorHex: string }>;
  note?: string;
  labeledBy: string;
}

export interface MachineStatus {
  status: 'running' | 'planstop' | 'unplanstop' | 'testing';
  label: string;
  color: 'success' | 'info' | 'error' | 'warning';
}

export type TimelineView = 'current' | 'shift' | 'day';

/**
 * Get machine status based on machine data
 */
export const getMachineStatus = (machineData: MachineOperationData | null): MachineStatus => {
  if (!machineData || !machineData.machineId) {
    return { status: 'unplanstop', label: 'Dừng không kế hoạch', color: 'error' };
  }
  return { status: 'running', label: 'Đang chạy', color: 'success' };
};

/**
 * Calculate duration in minutes from start/end time
 */
export const calculateDuration = (start?: string, end?: string | null): number => {
  if (!start) return 0;
  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : Date.now();
  return Math.round((endTime - startTime) / 60000); // Minutes
};
