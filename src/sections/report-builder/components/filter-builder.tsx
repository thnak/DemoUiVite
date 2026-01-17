import {
  Card,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  CardContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ReportFilterDto, EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  entity?: EntityMetadataDto;
  filters: ReportFilterDto[];
  onFiltersChange: (filters: ReportFilterDto[]) => void;
};

// Filter operators as per REPORT_API_RULES.md
const FILTER_OPERATORS = [
  { value: 'Equals', label: 'Equals (=)', requiresValue: true },
  { value: 'NotEquals', label: 'Not Equals (≠)', requiresValue: true },
  { value: 'GreaterThan', label: 'Greater Than (>)', requiresValue: true },
  { value: 'GreaterThanOrEqual', label: 'Greater Than or Equal (≥)', requiresValue: true },
  { value: 'LessThan', label: 'Less Than (<)', requiresValue: true },
  { value: 'LessThanOrEqual', label: 'Less Than or Equal (≤)', requiresValue: true },
  { value: 'Contains', label: 'Contains', requiresValue: true },
  { value: 'StartsWith', label: 'Starts With', requiresValue: true },
  { value: 'EndsWith', label: 'Ends With', requiresValue: true },
] as const;

const LOGICAL_OPERATORS = [
  { value: 'And', label: 'AND' },
  { value: 'Or', label: 'OR' },
] as const;

export function FilterBuilder({ entity, filters, onFiltersChange }: Props) {
  const handleAddFilter = () => {
    onFiltersChange([
      ...filters,
      {
        field: entity?.properties?.[0]?.propertyName || '',
        operator: 'Equals',
        value: '',
        logicalOperator: 'And',
      },
    ]);
  };

  const handleRemoveFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (
    index: number,
    updates: Partial<ReportFilterDto>
  ) => {
    const updated = filters.map((filter, i) =>
      i === index ? { ...filter, ...updates } : filter
    );
    onFiltersChange(updated);
  };

  if (!entity) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Select an entity to add filters
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddFilter}
            disabled={filters.length >= 50}
          >
            Add Filter
          </Button>
        </Stack>

        {filters.length === 0 ? (
          <Typography variant="body2" color="text.disabled">
            No filters applied
          </Typography>
        ) : (
          <Stack spacing={2}>
            {filters.map((filter, index) => (
              <Stack
                key={index}
                spacing={1}
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                {/* Field Selection */}
                <Select
                  size="small"
                  value={filter.field || ''}
                  onChange={(e) => handleFilterChange(index, { field: e.target.value })}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Field
                  </MenuItem>
                  {entity.properties?.map((prop) => (
                    <MenuItem key={prop.propertyName} value={prop.propertyName}>
                      {prop.displayName || prop.propertyName}
                    </MenuItem>
                  ))}
                </Select>

                {/* Operator Selection */}
                <Select
                  size="small"
                  value={filter.operator || 'Equals'}
                  onChange={(e) => handleFilterChange(index, { operator: e.target.value as any })}
                >
                  {FILTER_OPERATORS.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {op.label}
                    </MenuItem>
                  ))}
                </Select>

                {/* Value Input */}
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Filter value"
                  value={filter.value || ''}
                  onChange={(e) => handleFilterChange(index, { value: e.target.value })}
                />

                {/* Logical Operator and Remove Button */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {index < filters.length - 1 && (
                    <Select
                      size="small"
                      value={filter.logicalOperator || 'And'}
                      onChange={(e) =>
                        handleFilterChange(index, { logicalOperator: e.target.value as any })
                      }
                      sx={{ minWidth: 100 }}
                    >
                      {LOGICAL_OPERATORS.map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFilter(index)}
                    sx={{ ml: 'auto' }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {filters.length} filter{filters.length !== 1 ? 's' : ''} applied (max 50)
        </Typography>
      </CardContent>
    </Card>
  );
}
