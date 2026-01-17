import { Card, Stack, Typography, CardContent } from '@mui/material';

import type { ReportQueryDto } from '../types';

// ----------------------------------------------------------------------

type Props = {
  query: ReportQueryDto;
};

export function QueryPreview({ query }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Query JSON
        </Typography>
        <Stack
          sx={{
            p: 2,
            bgcolor: 'background.neutral',
            borderRadius: 1,
            maxHeight: 300,
            overflowY: 'auto',
          }}
        >
          <Typography
            component="pre"
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {JSON.stringify(query, null, 2)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
