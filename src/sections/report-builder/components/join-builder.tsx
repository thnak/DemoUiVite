import { Card, Stack, Button, Typography, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ReportJoinDto, EntityMetadataDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  sourceEntity?: EntityMetadataDto;
  joins: ReportJoinDto[];
  onJoinsChange: (joins: ReportJoinDto[]) => void;
};

export function JoinBuilder({ sourceEntity, joins, onJoinsChange }: Props) {
  const handleAddJoin = () => {
    const firstRelationship = sourceEntity?.relationships?.[0];
    if (!firstRelationship) return;

    onJoinsChange([
      ...joins,
      {
        targetEntity: firstRelationship.targetEntity || '',
        joinType: 'inner',
        sourceField: firstRelationship.foreignKeyProperty || '',
        targetField: firstRelationship.referencedProperty || 'Id',
        alias: firstRelationship.targetEntity?.replace('Entity', '') || '',
      },
    ]);
  };

  if (!sourceEntity) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Joins
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Select an entity to add joins
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Joins</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddJoin}
            disabled={!sourceEntity.relationships?.length}
          >
            Add Join
          </Button>
        </Stack>

        {joins.length === 0 ? (
          <Typography variant="body2" color="text.disabled">
            No joins configured
          </Typography>
        ) : (
          <Stack spacing={2}>
            {joins.map((join, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  p: 1.5,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                <Iconify
                  icon={join.joinType === 'inner' ? 'solar:info-circle-bold' : 'solar:link-bold-duotone'}
                  width={20}
                />
                <Stack sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    {join.joinType} Join to {join.targetEntity}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {join.sourceField} → {join.targetField} (as {join.alias})
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        {sourceEntity.relationships && sourceEntity.relationships.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            {sourceEntity.relationships.length} relationship
            {sourceEntity.relationships.length !== 1 ? 's' : ''} available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
