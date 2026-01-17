import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  TextField,
  Typography,
  CardContent,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { ReportQueryDto } from '../types';
import { useSavedReports, useReportQuery, useReportEntities } from '../hooks';
import {
  EntitySelector,
  FieldSelector,
  FilterBuilder,
  JoinBuilder,
  QueryPreview,
  ResultsPreview,
} from '../components';

// ----------------------------------------------------------------------

export function ReportBuilderCreateEditView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { savedReports, saveReport, updateReport, getReportById } = useSavedReports();
  const { previewQuery, isPreviewing, previewResult, previewError } = useReportQuery();
  const { data: entities, isLoading: isLoadingEntities } = useReportEntities();

  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [currentQuery, setCurrentQuery] = useState<ReportQueryDto>({
    sourceEntity: undefined,
    fields: [],
    filters: [],
    joins: [],
    sorts: [],
    groupBy: [],
    page: 1,
    pageSize: 50,
  });

  // Load existing report if editing
  useEffect(() => {
    if (isEdit && id) {
      const report = getReportById(id);
      if (report) {
        setReportName(report.name);
        setReportDescription(report.description || '');
        setCurrentQuery(report.query);
      }
    }
  }, [isEdit, id, getReportById]);

  const selectedEntity = useMemo(
    () => entities?.find((e) => e.entityName === currentQuery.sourceEntity),
    [entities, currentQuery.sourceEntity]
  );

  const handleEntityChange = useCallback((entityName: string) => {
    setCurrentQuery((prev) => ({
      ...prev,
      sourceEntity: entityName,
      fields: [],
      filters: [],
      joins: [],
      sorts: [],
      groupBy: [],
    }));
  }, []);

  const handleFieldsChange = useCallback((fields: ReportQueryDto['fields']) => {
    setCurrentQuery((prev) => ({ ...prev, fields }));
  }, []);

  const handleFiltersChange = useCallback((filters: ReportQueryDto['filters']) => {
    setCurrentQuery((prev) => ({ ...prev, filters }));
  }, []);

  const handleJoinsChange = useCallback((joins: ReportQueryDto['joins']) => {
    setCurrentQuery((prev) => ({ ...prev, joins }));
  }, []);

  const handlePreview = useCallback(async () => {
    if (!currentQuery.sourceEntity) return;
    await previewQuery(currentQuery);
  }, [currentQuery, previewQuery]);

  const handleSave = useCallback(() => {
    if (!reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    if (!currentQuery.sourceEntity) {
      alert('Please select a source entity');
      return;
    }

    if (isEdit && id) {
      updateReport(id, {
        name: reportName,
        description: reportDescription,
        query: currentQuery,
      });
    } else {
      saveReport(reportName, currentQuery, reportDescription);
    }

    navigate('/dev/report-builder');
  }, [
    reportName,
    reportDescription,
    currentQuery,
    isEdit,
    id,
    saveReport,
    updateReport,
    navigate,
  ]);

  const handleCancel = useCallback(() => {
    navigate('/dev/report-builder');
  }, [navigate]);

  return (
    <DashboardContent>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit Report' : 'Create Report'}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ typography: 'body2', color: 'text.disabled' }}>
          <Typography variant="inherit">Developer Hub</Typography>
          <Typography variant="inherit">•</Typography>
          <Typography variant="inherit">Report Builder</Typography>
          <Typography variant="inherit">•</Typography>
          <Typography variant="inherit">{isEdit ? 'Edit' : 'Create'}</Typography>
        </Stack>
      </Box>

      {/* Canva-style Layout */}
      <Grid container spacing={3}>
        {/* Left Panel - Entity & Configuration */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={3}>
            {/* Report Info Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Report Info
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Report Name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="My Report"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe what this report does..."
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Entity Selector */}
            <EntitySelector
              entities={entities || []}
              selectedEntity={currentQuery.sourceEntity}
              onSelectEntity={handleEntityChange}
              isLoading={isLoadingEntities}
            />

            {/* Action Buttons */}
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Iconify icon="solar:eye-bold" />}
                    onClick={handlePreview}
                    disabled={!currentQuery.sourceEntity || isPreviewing}
                  >
                    {isPreviewing ? 'Previewing...' : 'Preview Query'}
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="solar:diskette-bold" />}
                    onClick={handleSave}
                    disabled={!reportName.trim() || !currentQuery.sourceEntity}
                  >
                    Save Report
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Center Panel - Query Builder */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/* Field Selector */}
            <FieldSelector
              entity={selectedEntity}
              selectedFields={currentQuery.fields || []}
              onFieldsChange={handleFieldsChange}
            />

            {/* Join Builder */}
            <JoinBuilder
              sourceEntity={selectedEntity}
              joins={currentQuery.joins || []}
              onJoinsChange={handleJoinsChange}
            />

            {/* Filter Builder */}
            <FilterBuilder
              entity={selectedEntity}
              filters={currentQuery.filters || []}
              onFiltersChange={handleFiltersChange}
            />
          </Stack>
        </Grid>

        {/* Right Panel - Preview */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={3}>
            {/* Query JSON Preview */}
            <QueryPreview query={currentQuery} />

            {/* Results Preview */}
            <ResultsPreview
              result={previewResult}
              error={previewError}
              isLoading={isPreviewing}
            />
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
