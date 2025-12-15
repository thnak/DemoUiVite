/**
 * Frontend Developer Guide View
 * Interactive demonstration of real-time dashboard integration patterns
 */

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`guide-tabpanel-${index}`}
      aria-labelledby={`guide-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CODE_EXAMPLES = {
  basicConnection: `import * as signalR from "@microsoft/signalr";

// Initialize SignalR connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/hubs/dashboard-metrics", {
        accessTokenFactory: () => "your-jwt-token-here"
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Handle metric updates
connection.on("MetricUpdate", (data) => {
    console.log("Received metric update:", data);
    updateChart(data.MetricName, data.Value, data.Timestamp);
});

// Start connection
await connection.start();
await connection.invoke("SubscribeToDashboard", "demo-dashboard-1");`,

  reactHook: `import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export function useDashboardMetrics({ dashboardId, hubUrl }) {
    const [metrics, setMetrics] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        connection.on('MetricUpdate', (data) => {
            setMetrics(prev => ({
                ...prev,
                [data.metricName]: data
            }));
        });

        connection.start()
            .then(() => {
                setIsConnected(true);
                return connection.invoke('SubscribeToDashboard', dashboardId);
            });

        connectionRef.current = connection;

        return () => {
            connection.invoke('UnsubscribeFromDashboard', dashboardId)
                .finally(() => connection.stop());
        };
    }, [dashboardId, hubUrl]);

    return { metrics, isConnected };
}`,

  vueComposable: `import { ref, onMounted, onUnmounted } from 'vue';
import * as signalR from '@microsoft/signalr';

export function useDashboardMetrics(dashboardId) {
    const metrics = ref({});
    const isConnected = ref(false);
    let connection = null;

    const connect = async () => {
        connection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/dashboard-metrics')
            .withAutomaticReconnect()
            .build();

        connection.on('MetricUpdate', (data) => {
            metrics.value[data.metricName] = data;
        });

        await connection.start();
        isConnected.value = true;
        await connection.invoke('SubscribeToDashboard', dashboardId);
    };

    onMounted(connect);
    onUnmounted(() => connection?.stop());

    return { metrics, isConnected };
}`,

  browserTest: `// Quick test script for browser console
(async function() {
    // Load SignalR from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@microsoft/signalr@latest/dist/browser/signalr.min.js';
    document.head.appendChild(script);
    
    await new Promise(resolve => script.onload = resolve);
    
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/dashboard-metrics')
        .withAutomaticReconnect()
        .build();
    
    connection.on('MetricUpdate', (data) => {
        console.log('📊 Metric:', data.metricName, '=', data.value.toFixed(2));
    });
    
    await connection.start();
    await connection.invoke('SubscribeToDashboard', 'demo-dashboard-1');
    
    console.log('🎉 Connected! Watch for updates...');
    window.dashboardConnection = connection;
})();`,
};

const DASHBOARDS = [
  {
    id: 'demo-dashboard-1',
    name: 'System Metrics',
    description: 'CPU, memory, disk, and network metrics',
    color: 'primary',
    icon: 'mdi:monitor-dashboard',
  },
  {
    id: 'demo-dashboard-2',
    name: 'Environmental',
    description: 'Temperature, humidity, pressure, air quality',
    color: 'success',
    icon: 'mdi:weather-partly-cloudy',
  },
  {
    id: 'demo-dashboard-3',
    name: 'Business Metrics',
    description: 'Orders, revenue, users, errors',
    color: 'warning',
    icon: 'mdi:chart-line',
  },
];

const FEATURES = [
  {
    title: 'Real-Time Updates',
    description: 'Receive metric updates every 2 seconds via WebSocket',
    icon: 'mdi:clock-fast',
  },
  {
    title: 'Automatic Reconnection',
    description: 'Built-in reconnection with exponential backoff',
    icon: 'mdi:refresh-auto',
  },
  {
    title: 'Multiple Dashboards',
    description: 'Subscribe to multiple dashboards simultaneously',
    icon: 'mdi:view-dashboard-variant',
  },
  {
    title: 'Historical Data',
    description: 'Query past metrics for trend analysis',
    icon: 'mdi:chart-timeline-variant',
  },
  {
    title: 'Framework Agnostic',
    description: 'Works with React, Vue, Angular, or vanilla JS',
    icon: 'mdi:code-braces',
  },
  {
    title: 'TypeScript Support',
    description: 'Full type safety with TypeScript definitions',
    icon: 'mdi:language-typescript',
  },
];

export function FrontendGuideView() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderCodeBlock = (code: string, language: string, label: string) => (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.9),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: (theme) => alpha(theme.palette.grey[800], 0.9),
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.grey[700], 0.5)}`,
        }}
      >
        <Chip label={language} size="small" variant="outlined" />
        <Button
          size="small"
          startIcon={
            <Iconify icon={copiedCode === label ? 'mdi:check' : 'mdi:content-copy'} />
          }
          onClick={() => handleCopyCode(code, label)}
          sx={{ color: 'common.white' }}
        >
          {copiedCode === label ? 'Copied!' : 'Copy'}
        </Button>
      </Box>
      <Box
        component="pre"
        sx={{
          p: 2,
          m: 0,
          color: 'common.white',
          fontFamily: 'monospace',
          fontSize: 13,
          overflow: 'auto',
          maxHeight: 400,
        }}
      >
        <code>{code}</code>
      </Box>
    </Box>
  );

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Frontend Developer Guide
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete guide for integrating real-time dashboard metrics into your frontend
          applications
        </Typography>
      </Box>

      {/* Quick Info Banner */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>📦 Installation:</strong> npm install @microsoft/signalr
          <br />
          <strong>🔗 Hub URL:</strong> /hubs/dashboard-metrics
          <br />
          <strong>🎯 Demo Dashboards:</strong> demo-dashboard-1, demo-dashboard-2, demo-dashboard-3
        </Typography>
      </Alert>

      {/* Available Dashboards */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Available Demo Dashboards
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {DASHBOARDS.map((dashboard) => (
          <Grid key={dashboard.id} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[8],
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Iconify icon={dashboard.icon} width={32} sx={{ mr: 1.5 }} />
                  <Typography variant="h6">{dashboard.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {dashboard.description}
                </Typography>
                <Chip label={dashboard.id} size="small" color={dashboard.color as any} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Features Grid */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Key Features
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {FEATURES.map((feature) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Iconify
                icon={feature.icon}
                width={24}
                sx={{ color: 'primary.main', mt: 0.5 }}
              />
              <Box>
                <Typography variant="subtitle2">{feature.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Code Examples */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Integration Examples
      </Typography>

      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Basic Connection" />
          <Tab label="React Hook" />
          <Tab label="Vue Composable" />
          <Tab label="Browser Test" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Basic TypeScript/JavaScript example showing how to establish a SignalR connection and
            handle metric updates.
          </Typography>
          {renderCodeBlock(CODE_EXAMPLES.basicConnection, 'TypeScript', 'basic')}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Custom React hook for managing dashboard metrics subscriptions with automatic cleanup.
          </Typography>
          {renderCodeBlock(CODE_EXAMPLES.reactHook, 'TypeScript/React', 'react')}
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Vue 3 composable for dashboard metrics integration with reactive state management.
          </Typography>
          {renderCodeBlock(CODE_EXAMPLES.vueComposable, 'TypeScript/Vue', 'vue')}
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Quick test script to paste into your browser console for immediate testing.
          </Typography>
          {renderCodeBlock(CODE_EXAMPLES.browserTest, 'JavaScript', 'browser')}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Open your browser console (F12) and paste this script to test the connection
            immediately!
          </Alert>
        </TabPanel>
      </Card>

      {/* Quick Start Steps */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Start
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Chip label="1" color="primary" size="small" />
                <Box>
                  <Typography variant="subtitle2">Install SignalR</Typography>
                  <Box
                    component="code"
                    sx={{
                      display: 'block',
                      p: 1,
                      mt: 0.5,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: 13,
                    }}
                  >
                    npm install @microsoft/signalr
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Chip label="2" color="primary" size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Ensure Backend is Running</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start your backend server on https://localhost:5001 or your configured URL
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Chip label="3" color="primary" size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Choose Your Framework</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the React hook, Vue composable, or vanilla JavaScript examples above
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Chip label="4" color="primary" size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Subscribe to a Dashboard</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Call SubscribeToDashboard with demo-dashboard-1, demo-dashboard-2, or
                    demo-dashboard-3
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Chip label="5" color="primary" size="small" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Handle Metric Updates</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listen to MetricUpdate events and update your UI accordingly
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Troubleshooting */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Common Issues & Solutions
        </Typography>
        <Stack spacing={2}>
          <Alert severity="error">
            <Typography variant="subtitle2" gutterBottom>
              Cannot connect to SignalR hub
            </Typography>
            <Typography variant="body2">
              • Check if backend is running at the correct URL
              <br />
              • Verify CORS configuration allows your origin
              <br />• Ensure SSL certificate is trusted (for development)
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="subtitle2" gutterBottom>
              No metric updates received
            </Typography>
            <Typography variant="body2">
              • Verify dashboard ID exists (use demo-dashboard-1/2/3)
              <br />
              • Check for SubscriptionConfirmed event
              <br />• Review server logs for errors
            </Typography>
          </Alert>

          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              Connection drops frequently
            </Typography>
            <Typography variant="body2">
              • Enable automatic reconnect: .withAutomaticReconnect()
              <br />• Re-subscribe to dashboards in onreconnected handler
            </Typography>
          </Alert>
        </Stack>
      </Box>

      {/* Call to Action */}
      <Card sx={{ mt: 4, bgcolor: 'primary.lighter' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Ready to try it out?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visit our live demo dashboard to see real-time metrics in action
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              href="/realtime-dashboard"
              endIcon={<Iconify icon="mdi:arrow-right" />}
            >
              View Live Demo
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Resources */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Additional Resources
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mdi:file-document" />}
              href="https://docs.microsoft.com/aspnet/core/signalr/"
              target="_blank"
            >
              SignalR Docs
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mdi:github" />}
              href="https://github.com/dotnet/aspnetcore/tree/main/src/SignalR"
              target="_blank"
            >
              SignalR GitHub
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mdi:book-open-variant" />}
            >
              Backend Guide
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mdi:code-tags" />}
            >
              API Reference
            </Button>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
