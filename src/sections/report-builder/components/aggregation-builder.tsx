import {
  Card,
  Chip,
  Stack,
  Alert,
  Select,
  MenuItem,
  TextField,
  Typography,
  CardContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ReportFieldDto, EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  entity?: EntityMetadataDto;
  fields: ReportFieldDto[];
  groupBy: string[];
  onFieldsChange: (fields: ReportFieldDto[]) => void;
  onGroupByChange: (groupBy: string[]) => void;
};

// Aggregation functions as per REPORT_ENGINE_QUERY_SYNTAX.md
const AGGREGATION_FUNCTIONS = [
  { value: 'Count', label: 'Count', description: 'Count records', icon: 'solar:calculator-bold' },
  {
    value: 'Sum',
    label: 'Sum',
    description: 'Sum of values',
    icon: 'solar:add-circle-bold',
  },
  { value: 'Avg', label: 'Average', description: 'Average of values', icon: 'solar:chart-bold' },
  { value: 'Min', label: 'Minimum', description: 'Minimum value', icon: 'solar:arrow-down-bold' },
  { value: 'Max', label: 'Maximum', description: 'Maximum value', icon: 'solar:arrow-up-bold' },
] as const;

export function AggregationBuilder({
  entity,
  fields,
  groupBy,
  onFieldsChange,
  onGroupByChange,
}: Props) {
  const aggregatedFields = fields.filter((f) => f.aggregation);
  const nonAggregatedFields = fields.filter((f) => !f.aggregation);

  // Future: Toggle aggregation directly from this component
  // const handleToggleAggregation = (fieldName: string) => {
  //   const existingField = fields.find((f) => f.field === fieldName);
  //   if (existingField?.aggregation) {
  //     onFieldsChange(
  //       fields.map((f) =>
  //         f.field === fieldName ? { field: f.field, alias: f.alias } : f
  //       )
  //     );
  //   } else {
  //     onFieldsChange(
  //       fields.map((f) =>
  //         f.field === fieldName
  //           ? { ...f, aggregation: 'Count', alias: f.alias || `${fieldName}_count` }
  //           : f
  //       )
  //     );
  //     if (!groupBy.includes(fieldName)) {
  //       onGroupByChange([...groupBy, fieldName]);
  //     }
  //   }
  // };

  const handleAggregationChange = (fieldName: string, aggregation: string) => {
    onFieldsChange(
      fields.map((f) =>
        f.field === fieldName ? { ...f, aggregation: aggregation as any } : f
      )
    );
  };

  const handleAliasChange = (fieldName: string, alias: string) => {
    onFieldsChange(
      fields.map((f) => (f.field === fieldName ? { ...f, alias } : f))
    );
  };

  const handleToggleGroupBy = (fieldName: string) => {
    if (groupBy.includes(fieldName)) {
      onGroupByChange(groupBy.filter((f) => f !== fieldName));
    } else {
      onGroupByChange([...groupBy, fieldName]);
    }
  };

  if (!entity) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Aggregations & Grouping
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Select an entity first
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hasAggregations = aggregatedFields.length > 0;
  const missingGroupBy = nonAggregatedFields.filter(
    (f) => !groupBy.includes(f.field || '')
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Aggregations & Grouping
        </Typography>

        {hasAggregations && missingGroupBy.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              All non-aggregated fields must be in Group By. Missing:{' '}
              {missingGroupBy.map((f) => f.field).join(', ')}
            </Typography>
          </Alert>
        )}

        {/* Aggregated Fields */}
        {aggregatedFields.length > 0 && (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:calculator-bold" width={20} />
              Aggregated Fields ({aggregatedFields.length})
            </Typography>
            {aggregatedFields.map((field) => (
              <Stack
                key={field.field}
                spacing={1}
                sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {field.field}
                  </Typography>
                  <Chip
                    size="small"
                    label={field.aggregation}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Select
                  size="small"
                  value={field.aggregation || 'Count'}
                  onChange={(e) => handleAggregationChange(field.field || '', e.target.value)}
                >
                  {AGGREGATION_FUNCTIONS.map((fn) => (
                    <MenuItem key={fn.value} value={fn.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={fn.icon} width={16} />
                        <span>{fn.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  size="small"
                  label="Alias (for sorting/display)"
                  value={field.alias || ''}
                  onChange={(e) => handleAliasChange(field.field || '', e.target.value)}
                  placeholder={`${field.field}_${field.aggregation?.toLowerCase()}`}
                />
              </Stack>
            ))}
          </Stack>
        )}

        {/* Group By Fields */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:layers-bold" width={20} />
            Group By Fields ({groupBy.length}/10)
          </Typography>

          {groupBy.length === 0 ? (
            <Typography variant="body2" color="text.disabled">
              No grouping applied
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {groupBy.map((field) => (
                <Chip
                  key={field}
                  label={field}
                  size="small"
                  onDelete={() => handleToggleGroupBy(field)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Stack>

        {hasAggregations && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              <strong>Note:</strong> All non-aggregated fields must be in Group By. Aggregated
              fields can be used in Sort Order by their alias.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
