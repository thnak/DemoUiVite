/**
 * Report Builder Canvas View
 *
 * Main page that composes the Palette, Canvas, and PropertiesPanel.
 * Provides Run/Save actions, loads metadata from the API, executes preview queries,
 * and persists definitions to localStorage.
 */

import type {
  Block,
  EntityMetadata,
  ReportResult,
  TableBlock as TableBlockType,
} from 'src/types/report-builder';

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { Iconify } from 'src/components/iconify';
import {
  fetchAllEntitiesMetadata,
  fetchEntityMetadata,
  executeQueryPreview,
  buildQueryFromBlock,
} from 'src/api/report-builder-api';
import { Palette } from 'src/components/report-builder/Palette';
import { Canvas } from 'src/components/report-builder/Canvas';
import { PropertiesPanel } from 'src/components/report-builder/PropertiesPanel';
import { OnboardingWizard } from 'src/components/report-builder/OnboardingWizard';

// ----------------------------------------------------------------------

const STORAGE_KEY_PREFIX = 'report:canvas:';

export function ReportBuilderCanvasView() {
  const [allEntities, setAllEntities] = useState<EntityMetadata[]>([]);
  const [selectedEntityName, setSelectedEntityName] = useState<string>('');
  const [entityMetadata, setEntityMetadata] = useState<EntityMetadata | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Load all entities on mount
  useEffect(() => {
    const loadAllEntities = async () => {
      try {
        setLoading(true);
        const entities = await fetchAllEntitiesMetadata();
        setAllEntities(entities);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities');
      } finally {
        setLoading(false);
      }
    };

    loadAllEntities();
  }, []);

  // Load entity metadata when entity is selected
  useEffect(() => {
    if (!selectedEntityName) return;

    const loadMetadata = async () => {
      try {
        setLoading(true);
        const metadata = await fetchEntityMetadata(selectedEntityName);
        setEntityMetadata(metadata);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entity metadata');
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [selectedEntityName]);

  const handleAddField = (fieldName: string) => {
    if (!selectedBlockId) {
      // Auto-create a table block if none is selected
      const newBlock: TableBlockType = {
        id: uuidv4(),
        type: 'table',
        title: 'Table 1',
        fields: [fieldName],
        pageSize: 10,
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
    } else {
      // Add field to selected block
      setBlocks(
        blocks.map((block) =>
          block.id === selectedBlockId && !block.fields.includes(fieldName)
            ? { ...block, fields: [...block.fields, fieldName] }
            : block
        )
      );
    }
  };

  const handleUpdateSelectedBlock = (updates: Partial<Block>) => {
    if (!selectedBlockId) return;

    setBlocks(
      blocks.map((block) => (block.id === selectedBlockId ? { ...block, ...updates } : block))
    );
  };

  const handleRun = async () => {
    if (!selectedEntityName || blocks.length === 0) {
      setError('Please select an entity and add at least one block');
      return;
    }

    // Find first table block to preview
    const firstTableBlock = blocks.find((b) => b.type === 'table') as TableBlockType | undefined;
    if (!firstTableBlock || firstTableBlock.fields.length === 0) {
      setError('No table block with fields found');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const query = buildQueryFromBlock(
        selectedEntityName,
        firstTableBlock.fields,
        firstTableBlock.pageSize
      );
      const result = await executeQueryPreview(query);
      setPreviewResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!selectedEntityName) {
      setError('Please select an entity first');
      return;
    }

    const timestamp = new Date().toISOString();
    const key = `${STORAGE_KEY_PREFIX}${selectedEntityName}:${timestamp}`;
    const definition = {
      entityName: selectedEntityName,
      blocks,
    };

    try {
      localStorage.setItem(key, JSON.stringify(definition));
      alert(`Report saved to localStorage with key: ${key}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save report');
    }
  };

  const handleWizardComplete = (entityName: string, selectedFields: string[]) => {
    setSelectedEntityName(entityName);
    
    // Create a table block with selected fields
    const newBlock: TableBlockType = {
      id: uuidv4(),
      type: 'table',
      title: 'Table 1',
      fields: selectedFields,
      pageSize: 10,
    };
    setBlocks([newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Report Builder Canvas
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Entity</InputLabel>
              <Select
                value={selectedEntityName}
                onChange={(e) => setSelectedEntityName(e.target.value)}
                label="Entity"
                disabled={loading}
              >
                {allEntities
                  .filter((e) => e.isAvailable)
                  .map((entity) => (
                    <MenuItem key={entity.entityName} value={entity.entityName}>
                      {entity.displayName} {entity.category && `(${entity.category})`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:question-mark-circle-outline" />}
              onClick={() => setShowWizard(true)}
            >
              Quick Start
            </Button>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:play-circle-outline" />}
              onClick={handleRun}
              disabled={loading || !selectedEntityName || blocks.length === 0}
            >
              Run Preview
            </Button>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:save-outline" />}
              onClick={handleSave}
              disabled={!selectedEntityName || blocks.length === 0}
            >
              Save
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading && !entityMetadata && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {entityMetadata && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Palette
                properties={entityMetadata.properties}
                entityName={entityMetadata.displayName}
                onAddField={handleAddField}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Canvas
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onBlocksChange={setBlocks}
                onSelectBlock={setSelectedBlockId}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <PropertiesPanel
                selectedBlock={selectedBlock}
                onUpdateBlock={handleUpdateSelectedBlock}
              />
            </Grid>
          </Grid>
        )}

        {/* Preview Results */}
        {previewResult && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Preview Results
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {previewResult.columns.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewResult.data.map((row, index) => (
                    <TableRow key={index}>
                      {previewResult.columns.map((col) => (
                        <TableCell key={col}>
                          {row[col] !== null && row[col] !== undefined
                            ? String(row[col])
                            : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Showing {previewResult.data.length} of {previewResult.totalCount} total records
            </Typography>
          </Box>
        )}
      </Container>

      <OnboardingWizard
        open={showWizard}
        entities={allEntities}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />

      {/* Extension points for future features */}
      {/* TODO: Add filter editor UI (global and per-block filters) */}
      {/* TODO: Add join configuration UI for multi-entity reports */}
      {/* TODO: Add server-side persistence for saved reports */}
      {/* TODO: Add report scheduling and email delivery */}
    </>
  );
}
