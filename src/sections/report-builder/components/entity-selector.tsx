import { Card, Stack, MenuItem, TextField, Typography, CardContent } from '@mui/material';

import type { EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  entities: EntityMetadataDto[];
  selectedEntity?: string;
  onSelectEntity: (entityName: string) => void;
  isLoading?: boolean;
};

export function EntitySelector({ entities, selectedEntity, onSelectEntity, isLoading }: Props) {
  const groupedEntities = entities.reduce(
    (acc, entity) => {
      const category = entity.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(entity);
      return acc;
    },
    {} as Record<string, EntityMetadataDto[]>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Source Entity
        </Typography>
        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            label="Select Entity"
            value={selectedEntity || ''}
            onChange={(e) => onSelectEntity(e.target.value)}
            disabled={isLoading}
          >
            {Object.entries(groupedEntities).map(([category, categoryEntities]) => [
              <MenuItem key={`header-${category}`} disabled sx={{ fontWeight: 'bold' }}>
                {category}
              </MenuItem>,
              ...categoryEntities.map((entity) => (
                <MenuItem key={entity.entityName || ''} value={entity.entityName || ''}>
                  {entity.displayName || entity.entityName}
                </MenuItem>
              )),
            ])}
          </TextField>

          {selectedEntity && (
            <Typography variant="body2" color="text.secondary">
              {entities.find((e) => e.entityName === selectedEntity)?.description ||
                'No description available'}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
