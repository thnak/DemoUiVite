/**
 * Real-Time Metric Widget
 * Displays a single metric with live updates
 */

import type { MetricConfig } from 'src/services/realtime/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CircularProgress from '@mui/material/CircularProgress';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

import { useRealtimeMetric } from 'src/hooks/use-realtime-metric';

interface MetricWidgetProps {
  config: MetricConfig;
  formatValue?: (value: number) => string;
}

export function MetricWidget({ config, formatValue }: MetricWidgetProps) {
  const { data, isSubscribed, isConnected } = useRealtimeMetric(config.id, {
    throttleMs: config.refreshInterval,
  });

  const formattedValue =
    data?.value !== undefined ? formatValue?.(data.value) ?? data.value.toFixed(2) : '--';

  const getStatusColor = () => {
    if (!data || !config.thresholds) return 'text.primary';

    if (config.thresholds.critical && data.value >= config.thresholds.critical) {
      return 'error.main';
    }
    if (config.thresholds.warning && data.value >= config.thresholds.warning) {
      return 'warning.main';
    }
    return 'success.main';
  };

  const getTrendIcon = () => {
    if (!data?.trend) return null;

    const iconProps = { fontSize: 'small' as const, sx: { ml: 1 } };

    if (data.trend === 'up') {
      return <TrendingUpIcon {...iconProps} sx={{ ...iconProps.sx, color: 'success.main' }} />;
    }
    if (data.trend === 'down') {
      return <TrendingDownIcon {...iconProps} sx={{ ...iconProps.sx, color: 'error.main' }} />;
    }
    return <TrendingFlatIcon {...iconProps} sx={{ ...iconProps.sx, color: 'text.disabled' }} />;
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {config.name}
          </Typography>
          {!isConnected && (
            <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
              OFFLINE
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          {!isSubscribed && isConnected ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography
                variant="h3"
                sx={{
                  color: getStatusColor(),
                  fontWeight: 600,
                  transition: 'color 0.3s ease',
                }}
              >
                {formattedValue}
              </Typography>
              {config.unit && (
                <Typography variant="body2" color="text.secondary">
                  {config.unit}
                </Typography>
              )}
              {getTrendIcon()}
            </>
          )}
        </Box>

        {data?.delta !== undefined && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Change: {data.delta > 0 ? '+' : ''}
            {data.delta.toFixed(2)} {config.unit}
          </Typography>
        )}

        {data?.timestamp && (
          <Typography variant="caption" color="text.disabled">
            Updated: {new Date(data.timestamp).toLocaleTimeString()}
          </Typography>
        )}

        {config.description && (
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block', mt: 1, fontStyle: 'italic' }}
          >
            {config.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
