/**
 * Real-Time Dashboard View
 * Demonstrates SignalR-based real-time metrics with selective computation
 */

import type { MetricConfig } from 'src/services/realtime/types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';

import { DashboardContent } from 'src/layouts/dashboard';

import { MetricWidget } from '../metric-widget';
import { MetricSparkline } from '../metric-sparkline';
import { ConnectionStatus } from '../connection-status';

// Sample metrics configuration
const PERFORMANCE_METRICS: MetricConfig[] = [
  {
    id: 'cpu_usage',
    name: 'CPU Usage',
    unit: '%',
    refreshInterval: 1000,
    thresholds: { warning: 70, critical: 90 },
    description: 'Server CPU utilization',
    category: 'Performance',
  },
  {
    id: 'memory_usage',
    name: 'Memory Usage',
    unit: 'GB',
    refreshInterval: 1000,
    thresholds: { warning: 12, critical: 15 },
    description: 'RAM consumption',
    category: 'Performance',
  },
  {
    id: 'disk_usage',
    name: 'Disk Usage',
    unit: '%',
    refreshInterval: 2000,
    thresholds: { warning: 80, critical: 95 },
    description: 'Storage utilization',
    category: 'Performance',
  },
];

const TRAFFIC_METRICS: MetricConfig[] = [
  {
    id: 'active_connections',
    name: 'Active Connections',
    unit: 'conn',
    refreshInterval: 500,
    description: 'Current active connections',
    category: 'Traffic',
  },
  {
    id: 'requests_per_second',
    name: 'Requests/Second',
    unit: 'req/s',
    refreshInterval: 500,
    description: 'Incoming request rate',
    category: 'Traffic',
  },
  {
    id: 'active_users',
    name: 'Active Users',
    unit: 'users',
    refreshInterval: 2000,
    description: 'Currently active users',
    category: 'Traffic',
  },
];

const APPLICATION_METRICS: MetricConfig[] = [
  {
    id: 'response_time',
    name: 'Avg Response Time',
    unit: 'ms',
    refreshInterval: 1000,
    thresholds: { warning: 500, critical: 1000 },
    description: 'Average API response time',
    category: 'Application',
  },
  {
    id: 'error_rate',
    name: 'Error Rate',
    unit: '%',
    refreshInterval: 1000,
    thresholds: { warning: 1, critical: 5 },
    description: 'Percentage of failed requests',
    category: 'Application',
  },
  {
    id: 'cache_hit_rate',
    name: 'Cache Hit Rate',
    unit: '%',
    refreshInterval: 2000,
    description: 'Cache effectiveness',
    category: 'Application',
  },
];

const SPARKLINE_METRICS: MetricConfig[] = [
  {
    id: 'cpu_usage',
    name: 'CPU Trend',
    unit: '%',
    refreshInterval: 1000,
  },
  {
    id: 'memory_usage',
    name: 'Memory Trend',
    unit: 'GB',
    refreshInterval: 1000,
  },
  {
    id: 'response_time',
    name: 'Response Time Trend',
    unit: 'ms',
    refreshInterval: 1000,
  },
];

export function RealtimeDashboardView() {
  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Real-Time Dashboard</Typography>
          <ConnectionStatus />
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Research Implementation: SignalR + Orleans Pattern</AlertTitle>
          This dashboard demonstrates real-time data streaming with selective computation. Metrics
          are only computed when actively subscribed (Pub/Sub pattern). Data is simulated via mock
          generator for demonstration purposes.
        </Alert>
      </Box>

      {/* Performance Metrics */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Performance Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {PERFORMANCE_METRICS.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricWidget config={metric} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Traffic Metrics */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Traffic Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {TRAFFIC_METRICS.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricWidget config={metric} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Application Metrics */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Application Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {APPLICATION_METRICS.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricWidget config={metric} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Sparkline Charts */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Historical Trends
      </Typography>
      <Grid container spacing={3}>
        {SPARKLINE_METRICS.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, md: 4 }}>
            <MetricSparkline config={metric} />
          </Grid>
        ))}
      </Grid>

      {/* Implementation Info */}
      <Box sx={{ mt: 5, p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Implementation Details
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Real-Time Communication:</strong> SignalR WebSocket connection with automatic
          reconnection
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Selective Computation:</strong> Metrics are only computed when clients are
          subscribed (Pub/Sub pattern)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>In-Memory Processing:</strong> Mock data generator simulates high-performance
          compute pipeline
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>State Management:</strong> Connection state tracked and persisted across
          reconnections
        </Typography>
      </Box>
    </DashboardContent>
  );
}
