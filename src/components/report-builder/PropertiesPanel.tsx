/**
 * PropertiesPanel Component
 *
 * Right-hand properties panel to edit selected block properties
 * (title, page size, chart type).
 */

import type { Block, ChartBlock as ChartBlockType } from 'src/types/report-builder';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// ----------------------------------------------------------------------

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (updates: Partial<Block>) => void;
}

export function PropertiesPanel({ selectedBlock, onUpdateBlock }: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select a block to edit properties
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6">Properties</Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={selectedBlock.title || ''}
            onChange={(e) => onUpdateBlock({ title: e.target.value })}
            size="small"
          />

          {selectedBlock.type === 'table' && (
            <TextField
              fullWidth
              type="number"
              label="Page Size"
              value={selectedBlock.pageSize}
              onChange={(e) =>
                onUpdateBlock({ pageSize: Math.max(1, parseInt(e.target.value, 10) || 10) })
              }
              size="small"
              inputProps={{ min: 1, max: 100 }}
              helperText="Number of rows per page"
            />
          )}

          {selectedBlock.type === 'chart' && (
            <>
              <FormControl size="small" fullWidth>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={(selectedBlock as ChartBlockType).chartType}
                  onChange={(e) =>
                    onUpdateBlock({
                      chartType: e.target.value as ChartBlockType['chartType'],
                    })
                  }
                  label="Chart Type"
                >
                  <MenuItem value="bar">Bar</MenuItem>
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="pie">Pie</MenuItem>
                  <MenuItem value="area">Area</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Aggregation</InputLabel>
                <Select
                  value={(selectedBlock as ChartBlockType).aggregation || ''}
                  onChange={(e) =>
                    onUpdateBlock({
                      aggregation: e.target.value as ChartBlockType['aggregation'],
                    })
                  }
                  label="Aggregation"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Sum">Sum</MenuItem>
                  <MenuItem value="Avg">Average</MenuItem>
                  <MenuItem value="Count">Count</MenuItem>
                  <MenuItem value="Min">Minimum</MenuItem>
                  <MenuItem value="Max">Maximum</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Block Type: {selectedBlock.type}
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Fields: {selectedBlock.fields.length}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Extension points for future features */}
      {/* TODO: Add filter configuration UI */}
      {/* TODO: Add sort configuration UI */}
      {/* TODO: Add conditional formatting options */}
      {/* TODO: Add export options (CSV, Excel, PDF) */}
    </Card>
  );
}
