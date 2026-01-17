import { Card, Stack, Button, Typography, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ReportFilterDto, EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  entity?: EntityMetadataDto;
  filters: ReportFilterDto[];
  onFiltersChange: (filters: ReportFilterDto[]) => void;
};

export function FilterBuilder({ entity, filters, onFiltersChange }: Props) {
  const handleAddFilter = () => {
    onFiltersChange([
      ...filters,
      {
        field: entity?.properties?.[0]?.propertyName || '',
        operator: 'equals',
        value: '',
      },
    ]);
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
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  p: 1,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {filter.field} {filter.operator} {String(filter.value)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
