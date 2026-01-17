import { Card, Stack, Button, Checkbox, Typography, CardContent, FormControlLabel } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ReportFieldDto, EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  entity?: EntityMetadataDto;
  selectedFields: ReportFieldDto[];
  onFieldsChange: (fields: ReportFieldDto[]) => void;
};

export function FieldSelector({ entity, selectedFields, onFieldsChange }: Props) {
  const handleToggleField = (fieldName: string) => {
    const isSelected = selectedFields.some((f) => f.field === fieldName);

    if (isSelected) {
      onFieldsChange(selectedFields.filter((f) => f.field !== fieldName));
    } else {
      onFieldsChange([...selectedFields, { field: fieldName }]);
    }
  };

  const handleSelectAll = () => {
    if (!entity) return;
    const allFields = entity.properties?.map((p) => ({ field: p.propertyName })) || [];
    onFieldsChange(allFields);
  };

  const handleClearAll = () => {
    onFieldsChange([]);
  };

  if (!entity) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Iconify icon="solar:document-bold-duotone" width={48} sx={{ color: 'text.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              Select an entity first
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Choose a source entity to start building your report
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Select Fields</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleSelectAll}>
              All
            </Button>
            <Button size="small" onClick={handleClearAll}>
              Clear
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={1} sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {entity.properties?.map((property) => (
            <FormControlLabel
              key={property.propertyName}
              control={
                <Checkbox
                  checked={selectedFields.some((f) => f.field === property.propertyName)}
                  onChange={() => handleToggleField(property.propertyName || '')}
                />
              }
              label={
                <Stack>
                  <Typography variant="body2">{property.displayName || property.propertyName}</Typography>
                  {property.description && (
                    <Typography variant="caption" color="text.secondary">
                      {property.description}
                    </Typography>
                  )}
                </Stack>
              }
            />
          ))}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
        </Typography>
      </CardContent>
    </Card>
  );
}
