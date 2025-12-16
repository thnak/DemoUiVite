/**
 * ChartBlock Component
 *
 * Placeholder Chart block UI with x/y axis selectors.
 * Minimal implementation - chart wiring is optional in follow-up.
 */

import type { ChartBlock as ChartBlockType } from 'src/types/report-builder';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ChartBlockProps {
  block: ChartBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onRemoveField: (fieldName: string) => void;
  onUpdateXAxis: (field: string) => void;
  onUpdateYAxis: (field: string) => void;
}

export function ChartBlock({
  block,
  isSelected,
  onSelect,
  onRemoveField,
  onUpdateXAxis,
  onUpdateYAxis,
}: ChartBlockProps) {
  return (
    <Card
      sx={{
        p: 2,
        cursor: 'pointer',
        border: (theme) => `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
      onClick={onSelect}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Iconify icon="solar:chart-bold-duotone" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          {block.title || 'Chart Block'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {block.chartType}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Fields:
      </Typography>

      {block.fields.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', mb: 2 }}>
          No fields added. Click Add in the palette to add fields.
        </Typography>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {block.fields.map((field) => (
            <Chip
              key={field}
              label={field}
              size="small"
              onDelete={() => onRemoveField(field)}
              onClick={(e) => e.stopPropagation()}
              deleteIcon={
                <IconButton size="small" sx={{ '& svg': { fontSize: 16 } }}>
                  <Iconify icon={"solar:trash-bin-trash-bold" as any} />
                </IconButton>
              }
            />
          ))}
        </Stack>
      )}

      <Box sx={{ display: 'flex', gap: 2 }} onClick={(e) => e.stopPropagation()}>
        <FormControl size="small" fullWidth>
          <InputLabel>X Axis</InputLabel>
          <Select
            value={block.xAxis || ''}
            onChange={(e) => onUpdateXAxis(e.target.value)}
            label="X Axis"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {block.fields.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Y Axis</InputLabel>
          <Select
            value={block.yAxis || ''}
            onChange={(e) => onUpdateYAxis(e.target.value)}
            label="Y Axis"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {block.fields.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Extension points for future features */}
      {/* TODO: Wire with react-chartjs-2 or similar library */}
      {/* TODO: Add aggregation configuration for Y axis */}
      {/* TODO: Add chart preview using sample data */}
      {/* TODO: Add support for multiple Y axes/series */}
    </Card>
  );
}
