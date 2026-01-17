import type { ReportQueryDto } from 'src/api/types/generated';

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';

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

import { useReportQuery, useSavedReports, useReportEntities } from '../hooks';
import {
  JoinBuilder,
  SortBuilder,
  QueryPreview,
  FieldSelector,
  FilterBuilder,
  EntitySelector,
  ResultsPreview,
  AggregationBuilder,
} from '../components';

// ----------------------------------------------------------------------

export function ReportBuilderCreateEditView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { saveReport, updateReport, getReportById } = useSavedReports();
  const { previewQuery, isPreviewing, previewResult, previewError } = useReportQuery();
  const { data: entities, isLoading: isLoadingEntities } = useReportEntities();

  // Get current report if editing
  const currentReport = useMemo(() => {
    if (isEdit && id) {
      return getReportById(id);
    }
    return null;
  }, [isEdit, id, getReportById]);

  // Initialize form data from report
  const initialFormData = useMemo(() => {
    if (currentReport) {
      return {
        name: currentReport.name,
        description: currentReport.description || '',
        query: currentReport.query,
      };
    }
    return {
      name: '',
      description: '',
      query: {
        sourceEntity: undefined,
        fields: [],
        filters: [],
        joins: [],
        sorts: [],
        groupBy: [],
        page: 1,
        pageSize: 50,
      } as ReportQueryDto,
    };
  }, [currentReport]);

  const [reportName, setReportName] = useState(initialFormData.name);
  const [reportDescription, setReportDescription] = useState(initialFormData.description);
  const [currentQuery, setCurrentQuery] = useState<ReportQueryDto>(initialFormData.query);

  const selectedEntity = useMemo(
    () => entities?.find((e) => e.entityName === currentQuery.sourceEntity),
    [entities, currentQuery.sourceEntity]
  );

  // Available fields for sorting (includes aggregation aliases)
  const availableSortFields = useMemo(() => {
    const fields = currentQuery.fields?.map((f) => f.alias || f.field) || [];
    return fields.filter((f): f is string => !!f);
  }, [currentQuery.fields]);

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

  const handleSortsChange = useCallback((sorts: ReportQueryDto['sorts']) => {
    setCurrentQuery((prev) => ({ ...prev, sorts }));
  }, []);

  const handleGroupByChange = useCallback((groupBy: string[]) => {
    setCurrentQuery((prev) => ({ ...prev, groupBy }));
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
              selectedEntity={currentQuery.sourceEntity || undefined}
              onSelectEntity={handleEntityChange}
              isLoading={isLoadingEntities}
            />

            {/* Action Buttons */}
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="outlined"
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
                  <Button fullWidth variant="outlined" color="inherit" onClick={handleCancel}>
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

            {/* Aggregation & GroupBy */}
            <AggregationBuilder
              entity={selectedEntity}
              fields={currentQuery.fields || []}
              groupBy={currentQuery.groupBy || []}
              onFieldsChange={handleFieldsChange}
              onGroupByChange={handleGroupByChange}
            />

            {/* Sort Order */}
            <SortBuilder
              entity={selectedEntity}
              sorts={currentQuery.sorts || []}
              onSortsChange={handleSortsChange}
              availableFields={availableSortFields}
            />

            {/* Joins */}
            <JoinBuilder
              sourceEntity={selectedEntity}
              joins={currentQuery.joins || []}
              onJoinsChange={handleJoinsChange}
            />

            {/* Filters */}
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

// ----------------------------------------------------------------------

export function ReportBuilderCreateEditView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { saveReport, updateReport, getReportById } = useSavedReports();
  const { previewQuery, isPreviewing, previewResult, previewError } = useReportQuery();
  const { data: entities, isLoading: isLoadingEntities } = useReportEntities();

  // Get current report if editing
  const currentReport = useMemo(() => {
    if (isEdit && id) {
      return getReportById(id);
    }
    return null;
  }, [isEdit, id, getReportById]);

  // Initialize form data from report
  const initialFormData = useMemo(() => {
    if (currentReport) {
      return {
        name: currentReport.name,
        description: currentReport.description || '',
        query: currentReport.query,
      };
    }
    return {
      name: '',
      description: '',
      query: {
        sourceEntity: undefined,
        fields: [],
        filters: [],
        joins: [],
        sorts: [],
        groupBy: [],
        page: 1,
        pageSize: 50,
      } as ReportQueryDto,
    };
  }, [currentReport]);

  const [reportName, setReportName] = useState(initialFormData.name);
  const [reportDescription, setReportDescription] = useState(initialFormData.description);
  const [currentQuery, setCurrentQuery] = useState<ReportQueryDto>(initialFormData.query);

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
              selectedEntity={currentQuery.sourceEntity || undefined}
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
                    startIcon={<Iconify icon="solar:eye-bold" />}
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
