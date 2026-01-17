import type { ReportResultDto } from 'src/api/types/generated';

import { Card, Stack, Alert, Typography, CardContent, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  result?: ReportResultDto | null;
  error?: Error | null;
  isLoading?: boolean;
};

export function ResultsPreview({ result, error, isLoading }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Preview Results
        </Typography>

        {isLoading && (
          <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading preview...
            </Typography>
          </Stack>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {!isLoading && !error && !result && (
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Iconify
              icon="solar:home-angle-bold-duotone"
              width={48}
              sx={{ color: 'text.disabled' }}
            />
            <Typography variant="body2" color="text.secondary" align="center">
              Click &quot;Preview Query&quot; to see results
            </Typography>
          </Stack>
        )}

        {result && !isLoading && (
          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1.5,
                bgcolor: 'background.neutral',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                <strong>{result.totalCount}</strong> total records
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {result.executionTimeMs}ms
              </Typography>
            </Stack>

            <Stack
              sx={{
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 1,
                maxHeight: 400,
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
                {JSON.stringify(result.data?.slice(0, 5), null, 2)}
              </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Showing first 5 of {result.data?.length || 0} preview records
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
