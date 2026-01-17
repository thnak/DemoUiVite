import type { ReportQueryDto } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import type { SavedReport } from '../types';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'report-builder-saved-reports';

/**
 * Hook for managing saved reports in localStorage
 */
export function useSavedReports() {
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    // Initialize from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as SavedReport[];
      }
    } catch (error) {
      console.error('Failed to load saved reports:', error);
    }
    return [];
  });

  // Save reports to localStorage whenever they change
  const persistReports = useCallback((reports: SavedReport[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      setSavedReports(reports);
    } catch (error) {
      console.error('Failed to save reports:', error);
    }
  }, []);

  const saveReport = useCallback(
    (name: string, query: ReportQueryDto, description?: string, tags?: string[]) => {
      const newReport: SavedReport = {
        id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        query,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags,
      };

      const updated = [...savedReports, newReport];
      persistReports(updated);
      return newReport;
    },
    [savedReports, persistReports]
  );

  const updateReport = useCallback(
    (id: string, updates: Partial<Omit<SavedReport, 'id' | 'createdAt'>>) => {
      const updated = savedReports.map((report) =>
        report.id === id
          ? { ...report, ...updates, updatedAt: new Date().toISOString() }
          : report
      );
      persistReports(updated);
    },
    [savedReports, persistReports]
  );

  const deleteReport = useCallback(
    (id: string) => {
      const updated = savedReports.filter((report) => report.id !== id);
      persistReports(updated);
    },
    [savedReports, persistReports]
  );

  const duplicateReport = useCallback(
    (id: string) => {
      const original = savedReports.find((r) => r.id === id);
      if (!original) return null;

      const duplicate: SavedReport = {
        ...original,
        id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [...savedReports, duplicate];
      persistReports(updated);
      return duplicate;
    },
    [savedReports, persistReports]
  );

  const getReportById = useCallback(
    (id: string) => savedReports.find((report) => report.id === id),
    [savedReports]
  );

  return {
    savedReports,
    saveReport,
    updateReport,
    deleteReport,
    duplicateReport,
    getReportById,
  };
}
