/**
 * TableBlock Component
 *
 * Lightweight Table block UI showing chips for fields and page-size input.
 * Parent component handles page-size changes.
 */

import type { TableBlock as TableBlockType } from 'src/types/report-builder';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TableBlockProps {
  block: TableBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onRemoveField: (fieldName: string) => void;
  onUpdatePageSize: (pageSize: number) => void;
}

export function TableBlock({
  block,
  isSelected,
  onSelect,
  onRemoveField,
  onUpdatePageSize,
}: TableBlockProps) {
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
        <Iconify icon="solar:grid-bold-duotone" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          {block.title || 'Table Block'}
        </Typography>
        <TextField
          size="small"
          type="number"
          label="Page Size"
          value={block.pageSize}
          onChange={(e) => onUpdatePageSize(Math.max(1, parseInt(e.target.value, 10) || 10))}
          onClick={(e) => e.stopPropagation()}
          sx={{ width: 100 }}
          inputProps={{ min: 1, max: 100 }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Fields:
      </Typography>

      {block.fields.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          No fields added. Click Add in the palette to add fields.
        </Typography>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
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

      {/* Extension points for future features */}
      {/* TODO: Add column configuration (width, alignment, formatting) */}
      {/* TODO: Add sorting configuration UI */}
      {/* TODO: Add aggregation options for numeric columns */}
    </Card>
  );
}
