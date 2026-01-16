/**
 * Translation Sync Button Component
 *
 * UI button to manually trigger translation synchronization with progress indicator.
 */

import { useState, useCallback } from 'react';

import { Box, Button, Popover, Typography, LinearProgress, CircularProgress } from '@mui/material';

import { useTranslationSync } from 'src/services/translation';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TranslationSyncButton() {
  const { syncing, progress, syncAll } = useTranslationSync();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (syncing) {
        setAnchorEl(event.currentTarget);
      } else {
        syncAll();
      }
    },
    [syncing, syncAll]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);

  // Calculate overall progress
  const overallProgress =
    progress.length > 0 ? progress.reduce((sum, p) => sum + p.progress, 0) / progress.length : 0;

  const completedCount = progress.filter((p) => p.status === 'complete').length;
  const errorCount = progress.filter((p) => p.status === 'error').length;

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={syncing ? <CircularProgress size={16} /> : <Iconify icon="solar:refresh-bold" />}
        onClick={handleClick}
        disabled={syncing}
      >
        {syncing ? 'Syncing...' : 'Sync Translations'}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              width: 320,
              mt: 1,
            },
          },
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Sync Progress
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Overall
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(overallProgress)}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={overallProgress} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Total: {progress.length}</Typography>
            <Typography variant="body2" color="success.main">
              Completed: {completedCount}
            </Typography>
            {errorCount > 0 && (
              <Typography variant="body2" color="error.main">
                Errors: {errorCount}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              bgcolor: 'background.neutral',
              borderRadius: 1,
              p: 1,
            }}
          >
            {progress.map((p) => (
              <Box
                key={p.entity}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                  {p.entity}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {p.status === 'complete' && (
                    <Iconify icon="solar:check-circle-bold" color="success.main" width={16} />
                  )}
                  {p.status === 'error' && (
                    <Iconify icon="solar:close-circle-bold" color="error.main" width={16} />
                  )}
                  {p.status === 'syncing' && <CircularProgress size={12} />}
                  <Typography variant="caption" color="text.secondary">
                    {p.progress}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
}
