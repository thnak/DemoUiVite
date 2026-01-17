import {
  Card,
  Stack,
  Button,
  Select,
  MenuItem,
  IconButton,
  Typography,
  CardContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ReportSortDto, EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  entity?: EntityMetadataDto;
  sorts: ReportSortDto[];
  onSortsChange: (sorts: ReportSortDto[]) => void;
  availableFields?: string[]; // Include aggregation aliases
};

const SORT_DIRECTIONS = [
  { value: 'ascending', label: 'Ascending (A-Z, 0-9)', icon: 'solar:sort-vertical-bold' },
  { value: 'descending', label: 'Descending (Z-A, 9-0)', icon: 'solar:sort-vertical-bold' },
] as const;

export function SortBuilder({ entity, sorts, onSortsChange, availableFields = [] }: Props) {
  const handleAddSort = () => {
    const firstField = availableFields[0] || entity?.properties?.[0]?.propertyName || '';
    onSortsChange([
      ...sorts,
      {
        field: firstField,
        direction: 'ascending',
      },
    ]);
  };

  const handleRemoveSort = (index: number) => {
    onSortsChange(sorts.filter((_, i) => i !== index));
  };

  const handleSortChange = (index: number, updates: Partial<ReportSortDto>) => {
    const updated = sorts.map((sort, i) => (i === index ? { ...sort, ...updates } : sort));
    onSortsChange(updated);
  };

  const allFields = [
    ...(entity?.properties?.map((p) => ({
      value: p.propertyName || '',
      label: p.displayName || p.propertyName || '',
    })) || []),
    ...availableFields
      .filter((f) => !entity?.properties?.some((p) => p.propertyName === f))
      .map((f) => ({ value: f, label: f })),
  ].filter(f => f.value !== '');

  if (!entity) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sort Order
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Select an entity to add sorting
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Sort Order</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddSort}
            disabled={sorts.length >= 100}
          >
            Add Sort
          </Button>
        </Stack>

        {sorts.length === 0 ? (
          <Typography variant="body2" color="text.disabled">
            No sorting applied (default order)
          </Typography>
        ) : (
          <Stack spacing={2}>
            {sorts.map((sort, index) => (
              <Stack
                key={index}
                spacing={1}
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30 }}>
                    {index + 1}.
                  </Typography>

                  {/* Field Selection */}
                  <Select
                    size="small"
                    fullWidth
                    value={sort.field || ''}
                    onChange={(e) => handleSortChange(index, { field: e.target.value })}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Field
                    </MenuItem>
                    {allFields.map((field) => (
                      <MenuItem key={field.value} value={field.value}>
                        {field.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Direction Selection */}
                  <Select
                    size="small"
                    value={sort.direction || 'ascending'}
                    onChange={(e) =>
                      handleSortChange(index, { direction: e.target.value as any })
                    }
                    sx={{ minWidth: 150 }}
                  >
                    {SORT_DIRECTIONS.map((dir) => (
                      <MenuItem key={dir.value} value={dir.value}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify
                            icon={dir.icon}
                            width={16}
                            sx={{
                              transform: dir.value === 'descending' ? 'rotate(180deg)' : 'none',
                            }}
                          />
                          <span>{dir.label.split(' ')[0]}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Remove Button */}
                  <IconButton size="small" onClick={() => handleRemoveSort(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {sorts.length} sort{sorts.length !== 1 ? 's' : ''} applied (max 100)
        </Typography>
      </CardContent>
    </Card>
  );
}
