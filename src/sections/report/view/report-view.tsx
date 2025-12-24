import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { OEEMetricCard } from '../components/oee-metric-card';
import { FactoryCanvas2D } from '../components/factory-canvas-2d';

// ----------------------------------------------------------------------

// Mock data for factory OEE metrics
const mockFactoryOEE = {
  overall: {
    oee: 78.5,
    availability: 89.2,
    performance: 92.3,
    quality: 95.4,
  },
  areas: [
    {
      id: 'area-1',
      name: 'Assembly Line A',
      oee: 82.1,
      availability: 91.5,
      performance: 93.8,
      quality: 95.7,
    },
    {
      id: 'area-2',
      name: 'Assembly Line B',
      oee: 75.3,
      availability: 87.2,
      performance: 90.5,
      quality: 95.2,
    },
    {
      id: 'area-3',
      name: 'Packaging',
      oee: 79.8,
      availability: 89.7,
      performance: 92.1,
      quality: 96.5,
    },
    {
      id: 'area-4',
      name: 'Quality Control',
      oee: 76.2,
      availability: 88.3,
      performance: 91.2,
      quality: 94.6,
    },
  ],
  trends: {
    oee: { value: 2.3, isPositive: true },
    availability: { value: 1.5, isPositive: true },
    performance: { value: -0.8, isPositive: false },
    quality: { value: 0.5, isPositive: true },
  },
};

// Mock data for 2D Canvas
const mockCanvasData = [
  {
    id: 'area-1',
    name: 'Assembly Line A',
    position: { x: 50, y: 50 },
    width: 500,
    height: 300,
    machines: [
      {
        id: 'machine-1',
        name: 'Machine 1',
        position: { x: 20, y: 50 },
        status: 'running' as const,
        oee: 85.2,
      },
      {
        id: 'machine-2',
        name: 'Machine 2',
        position: { x: 120, y: 50 },
        status: 'running' as const,
        oee: 88.7,
      },
      {
        id: 'machine-3',
        name: 'Machine 3',
        position: { x: 220, y: 50 },
        status: 'maintenance' as const,
        oee: 72.1,
      },
      {
        id: 'machine-4',
        name: 'Machine 4',
        position: { x: 320, y: 50 },
        status: 'running' as const,
        oee: 90.3,
      },
      {
        id: 'machine-5',
        name: 'Machine 5',
        position: { x: 20, y: 150 },
        status: 'running' as const,
        oee: 79.8,
      },
      {
        id: 'machine-6',
        name: 'Machine 6',
        position: { x: 120, y: 150 },
        status: 'stopped' as const,
        oee: 45.2,
      },
    ],
  },
  {
    id: 'area-2',
    name: 'Assembly Line B',
    position: { x: 600, y: 50 },
    width: 500,
    height: 300,
    machines: [
      {
        id: 'machine-7',
        name: 'Machine 7',
        position: { x: 20, y: 50 },
        status: 'running' as const,
        oee: 82.4,
      },
      {
        id: 'machine-8',
        name: 'Machine 8',
        position: { x: 120, y: 50 },
        status: 'running' as const,
        oee: 76.9,
      },
      {
        id: 'machine-9',
        name: 'Machine 9',
        position: { x: 220, y: 50 },
        status: 'idle' as const,
        oee: 55.3,
      },
      {
        id: 'machine-10',
        name: 'Machine 10',
        position: { x: 320, y: 50 },
        status: 'running' as const,
        oee: 84.1,
      },
    ],
  },
  {
    id: 'area-3',
    name: 'Packaging',
    position: { x: 50, y: 400 },
    width: 500,
    height: 300,
    machines: [
      {
        id: 'machine-11',
        name: 'Machine 11',
        position: { x: 20, y: 50 },
        status: 'running' as const,
        oee: 87.6,
      },
      {
        id: 'machine-12',
        name: 'Machine 12',
        position: { x: 120, y: 50 },
        status: 'running' as const,
        oee: 81.2,
      },
      {
        id: 'machine-13',
        name: 'Machine 13',
        position: { x: 220, y: 50 },
        status: 'running' as const,
        oee: 89.4,
      },
    ],
  },
  {
    id: 'area-4',
    name: 'Quality Control',
    position: { x: 600, y: 400 },
    width: 500,
    height: 300,
    machines: [
      {
        id: 'machine-14',
        name: 'Machine 14',
        position: { x: 20, y: 50 },
        status: 'running' as const,
        oee: 78.3,
      },
      {
        id: 'machine-15',
        name: 'Machine 15',
        position: { x: 120, y: 50 },
        status: 'maintenance' as const,
        oee: 68.7,
      },
    ],
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as any,
    },
  },
};

export function ReportView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleMachineClick = (machineId: string) => {
    // Navigate to machine OEE details
    navigate(`/machines/${machineId}/oee`);
  };

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(areaId);
    // Could navigate to area details page if exists
    console.log('Area clicked:', areaId);
  };

  const handleMetricClick = (metricType: string) => {
    // Navigate to detailed reports
    if (metricType === 'overall') {
      navigate('/oee-summary-report');
    }
    console.log('Metric clicked:', metricType);
  };

  return (
    <DashboardContent maxWidth="xl">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 5 }}>
            <Stack spacing={1}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Factory Report
              </Typography>
              <Breadcrumbs separator="•">
                <Button
                  color="inherit"
                  onClick={() => navigate('/')}
                  sx={{ p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent' } }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Home
                  </Typography>
                </Button>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  Report
                </Typography>
              </Breadcrumbs>
            </Stack>
          </Box>
        </motion.div>

        {/* 2D Canvas Button */}
        <motion.div variants={itemVariants}>
          <FactoryCanvas2D
            areas={mockCanvasData}
            onMachineClick={handleMachineClick}
            onAreaClick={handleAreaClick}
          />
        </motion.div>

        {/* Overall Factory Metrics - Bento Grid */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Overall Factory Performance
          </Typography>
        </motion.div>

        {/* Main Bento Grid - Overall Metrics */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Large OEE Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div variants={itemVariants}>
              <OEEMetricCard
                title="Overall Equipment Effectiveness"
                value={mockFactoryOEE.overall.oee}
                icon="solar:shield-check-bold"
                color="primary"
                trend={mockFactoryOEE.trends.oee}
                subtitle="Factory-wide performance"
                onClick={() => handleMetricClick('overall')}
                size="large"
              />
            </motion.div>
          </Grid>

          {/* Three smaller cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <motion.div variants={itemVariants}>
                  <OEEMetricCard
                    title="Availability"
                    value={mockFactoryOEE.overall.availability}
                    icon="solar:clock-circle-bold"
                    color="info"
                    trend={mockFactoryOEE.trends.availability}
                    subtitle="Equipment uptime"
                    onClick={() => handleMetricClick('availability')}
                    size="small"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <motion.div variants={itemVariants}>
                  <OEEMetricCard
                    title="Performance"
                    value={mockFactoryOEE.overall.performance}
                    icon="solar:speedometer-bold"
                    color="warning"
                    trend={mockFactoryOEE.trends.performance}
                    subtitle="Speed efficiency"
                    onClick={() => handleMetricClick('performance')}
                    size="small"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <motion.div variants={itemVariants}>
                  <OEEMetricCard
                    title="Quality"
                    value={mockFactoryOEE.overall.quality}
                    icon="solar:shield-star-bold"
                    color="success"
                    trend={mockFactoryOEE.trends.quality}
                    subtitle="Good parts ratio"
                    onClick={() => handleMetricClick('quality')}
                    size="small"
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Area-Level Metrics */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Performance by Area
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {mockFactoryOEE.areas.map((area) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={area.id}>
              <motion.div variants={itemVariants}>
                <OEEMetricCard
                  title={area.name}
                  value={area.oee}
                  icon="solar:home-angle-2-bold"
                  onClick={() => handleAreaClick(area.id)}
                  subtitle={`Avail: ${area.availability.toFixed(1)}% | Perf: ${area.performance.toFixed(1)}% | Qual: ${area.quality.toFixed(1)}%`}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 5, p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:document-bold" />}
                onClick={() => navigate('/downtime-report')}
              >
                Downtime Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:chart-bold-duotone" />}
                onClick={() => navigate('/oee-summary-report')}
              >
                Detailed OEE Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:settings-bold-duotone" />}
                onClick={() => navigate('/machines')}
              >
                Machine Management
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon={"solar:map-bold-duotone" as any} />}
                onClick={() => navigate('/area')}
              >
                Area Management
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </motion.div>
    </DashboardContent>
  );
}
