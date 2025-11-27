import type { CardProps } from '@mui/material/Card';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type TimeTrackerCardProps = CardProps & {
  title?: string;
  initialTime?: number; // in seconds
};

export function TimeTrackerCard({
  title = 'Time Tracker',
  initialTime = 5048, // 1:24:08
  sx,
  ...other
}: TimeTrackerCardProps) {
  const theme = useTheme();
  const [seconds, setSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
  }, []);

  const handlePlay = useCallback(() => {
    setIsRunning(true);
  }, []);

  return (
    <Card
      sx={[
        {
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'success.dark',
          color: 'common.white',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            ${alpha(theme.palette.common.white, 0.05)} 10px,
            ${alpha(theme.palette.common.white, 0.05)} 20px
          )`,
          pointerEvents: 'none',
        }}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, position: 'relative' }}>
        {title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: 2,
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          {formatTime(seconds)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
          {isRunning ? (
            <IconButton
              onClick={handlePause}
              sx={{
                bgcolor: 'common.white',
                color: 'success.dark',
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) },
              }}
            >
              <Iconify icon="solar:restart-bold" />
            </IconButton>
          ) : (
            <IconButton
              onClick={handlePlay}
              sx={{
                bgcolor: 'common.white',
                color: 'success.dark',
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) },
              }}
            >
              <Iconify icon="solar:play-circle-bold" />
            </IconButton>
          )}
          <IconButton
            onClick={handleStop}
            sx={{
              bgcolor: 'error.main',
              color: 'common.white',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
