import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { OEEMetricCard } from '../components/oee-metric-card';

// ----------------------------------------------------------------------

// Mock data for factory OEE metrics
const mockFactoryOEE = {
  overall: {
    oee: 78.5,
    availability: 89.2,
    performance: 92.3,
    quality: 95.4,
    chartData: [75.2, 76.8, 77.5, 78.1, 79.2, 78.9, 78.5, 79.1], // Last 8 periods
  },
  areas: [
    {
      id: 'area-1',
      name: 'Assembly Line A',
      oee: 82.1,
      availability: 91.5,
      performance: 93.8,
      quality: 95.7,
      chartData: [80.2, 81.1, 81.8, 82.5, 82.9, 82.3, 82.0, 82.1],
    },
    {
      id: 'area-2',
      name: 'Assembly Line B',
      oee: 75.3,
      availability: 87.2,
      performance: 90.5,
      quality: 95.2,
      chartData: [73.5, 74.2, 74.8, 75.1, 76.0, 75.8, 75.5, 75.3],
    },
    {
      id: 'area-3',
      name: 'Packaging',
      oee: 79.8,
      availability: 89.7,
      performance: 92.1,
      quality: 96.5,
      chartData: [78.5, 79.1, 79.4, 79.8, 80.2, 79.9, 79.7, 79.8],
    },
    {
      id: 'area-4',
      name: 'Quality Control',
      oee: 76.2,
      availability: 88.3,
      performance: 91.2,
      quality: 94.6,
      chartData: [74.8, 75.5, 76.1, 76.5, 76.8, 76.4, 76.3, 76.2],
    },
  ],
  trends: {
    oee: { value: 2.3, isPositive: true },
    availability: { value: 1.5, isPositive: true, chartData: [87.5, 88.1, 88.5, 89.0, 89.5, 89.3, 89.1, 89.2] },
    performance: { value: -0.8, isPositive: false, chartData: [93.5, 93.2, 92.8, 92.5, 92.1, 92.3, 92.2, 92.3] },
    quality: { value: 0.5, isPositive: true, chartData: [94.8, 95.0, 95.2, 95.3, 95.5, 95.4, 95.3, 95.4] },
  },
};

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
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-scroll effect for Performance by Area section
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return undefined;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isHovering && scrollContainer) {
        scrollPosition += scrollSpeed;
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // Reset to start when reaching the end
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Start animation after a short delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [isHovering]);

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
    <DashboardContent maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
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
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <OEEMetricCard
                title="Overall Equipment Effectiveness"
                value={mockFactoryOEE.overall.oee}
                icon="solar:shield-check-bold"
                color="primary"
                trend={mockFactoryOEE.trends.oee}
                subtitle="Factory-wide performance"
                onClick={() => handleMetricClick('overall')}
                size="large"
                chartData={mockFactoryOEE.overall.chartData}
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
                    chartData={mockFactoryOEE.trends.availability.chartData}
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
                    chartData={mockFactoryOEE.trends.performance.chartData}
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
                    chartData={mockFactoryOEE.trends.quality.chartData}
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

        <Box
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          sx={{
            overflow: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'background.neutral',
              borderRadius: 1,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'text.disabled',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'text.secondary',
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
            {mockFactoryOEE.areas.map((area) => (
              <Box key={area.id} sx={{ width: 300, flexShrink: 0 }}>
                <motion.div variants={itemVariants}>
                  <OEEMetricCard
                    title={area.name}
                    value={area.oee}
                    icon="solar:home-angle-2-bold"
                    onClick={() => handleAreaClick(area.id)}
                    subtitle={`Avail: ${area.availability.toFixed(1)}% | Perf: ${area.performance.toFixed(1)}% | Qual: ${area.quality.toFixed(1)}%`}
                    chartData={area.chartData}
                  />
                </motion.div>
              </Box>
            ))}
          </Box>
        </Box>

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
                startIcon={<Iconify icon='solar:map-bold' />}
                onClick={() => navigate('/area')}
              >
                Area Management
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </motion.div>

      {/* 2D Canvas Button */}
      <motion.div variants={itemVariants}>
        <Button
          variant="contained"
          color="inherit"
          size="large"
          startIcon={<Iconify icon="solar:map-bold" />}
          onClick={() => navigate('/factory-layout')}
          sx={{ mb: 3 }}
        >
          View Factory Layout (2D)
        </Button>
      </motion.div>
    </DashboardContent>
  );
}
