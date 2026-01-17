import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import type { ReportQueryDto } from 'src/api/types/generated';
import {
  postapireportsquerydata,
  postapireportsquerypreview,
  postapireportsqueryvalidate,
} from 'src/api/services/generated/report-query';

// ----------------------------------------------------------------------

/**
 * Hook for executing report queries
 */
export function useReportQuery() {
  const [lastExecutedQuery, setLastExecutedQuery] = useState<ReportQueryDto | null>(null);

  const executeMutation = useMutation({
    mutationFn: async (query: ReportQueryDto) => {
      setLastExecutedQuery(query);
      const result = await postapireportsquerydata(query);
      return result.value;
    },
  });

  const previewMutation = useMutation({
    mutationFn: async (query: ReportQueryDto) => {
      const result = await postapireportsquerypreview(query);
      return result.value;
    },
  });

  const validateMutation = useMutation({
    mutationFn: async (query: ReportQueryDto) => {
      const result = await postapireportsqueryvalidate(query);
      return result.value;
    },
  });

  const executeQuery = useCallback(
    (query: ReportQueryDto) => {
      return executeMutation.mutateAsync(query);
    },
    [executeMutation]
  );

  const previewQuery = useCallback(
    (query: ReportQueryDto) => {
      return previewMutation.mutateAsync(query);
    },
    [previewMutation]
  );

  const validateQuery = useCallback(
    (query: ReportQueryDto) => {
      return validateMutation.mutateAsync(query);
    },
    [validateMutation]
  );

  return {
    executeQuery,
    previewQuery,
    validateQuery,
    isExecuting: executeMutation.isPending,
    isPreviewing: previewMutation.isPending,
    isValidating: validateMutation.isPending,
    executionResult: executeMutation.data,
    previewResult: previewMutation.data,
    validationResult: validateMutation.data,
    executionError: executeMutation.error,
    previewError: previewMutation.error,
    validationError: validateMutation.error,
    lastExecutedQuery,
  };
}
