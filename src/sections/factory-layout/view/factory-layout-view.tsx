import { useNavigate } from 'react-router-dom';
import { useRef, useState, useCallback } from 'react';
import { Rect, Text, Line, Stage, Layer, Group, Circle } from 'react-konva';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Position = {
  x: number;
  y: number;
};

type AreaData = {
  id: string;
  name: string;
  position: Position;
  width: number;
  height: number;
  machines: MachineData[];
};

type MachineData = {
  id: string;
  name: string;
  position: Position;
  status: 'running' | 'stopped' | 'maintenance' | 'idle';
  oee: number;
};

// Mock data for 2D Canvas
const mockCanvasData: AreaData[] = [
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

export function FactoryLayoutView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredMachine, setHoveredMachine] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const canvasWidth = 1200;
  const canvasHeight = 800;

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.5, Math.min(3, newScale));

    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, []);

  const handleMachineClick = useCallback(
    (machineId: string) => {
      navigate(`/machines/${machineId}/oee`);
    },
    [navigate]
  );

  const getStatusColor = (status: MachineData['status']) => {
    switch (status) {
      case 'running':
        return theme.palette.success.main;
      case 'stopped':
        return theme.palette.error.main;
      case 'maintenance':
        return theme.palette.warning.main;
      case 'idle':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: MachineData['status']) => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'stopped':
        return 'Stopped';
      case 'maintenance':
        return 'Maintenance';
      case 'idle':
        return 'Idle';
      default:
        return 'Unknown';
    }
  };

  const isDarkMode = theme.palette.mode === 'dark';
  const areaColor = isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100];
  const areaStrokeColor = isDarkMode ? theme.palette.grey[700] : theme.palette.grey[400];
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const gridColor = isDarkMode ? theme.palette.grey[700] : theme.palette.grey[200];

  return (
    <DashboardContent maxWidth="xl">
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Factory Layout - 2D View
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
            <Button
              color="inherit"
              onClick={() => navigate('/report')}
              sx={{ p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent' } }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Report
              </Typography>
            </Button>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Factory Layout
            </Typography>
          </Breadcrumbs>
        </Stack>
      </Box>

      {/* Canvas Container */}
      <Card
        ref={containerRef}
        sx={{
          p: 2,
          bgcolor: 'background.neutral',
          ...(isFullscreen && {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }),
        }}
      >
        {/* Controls Bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          {/* Legend */}
          <Stack direction="row" spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: 0.5 }} />
              <Typography variant="caption">Running</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: 0.5 }} />
              <Typography variant="caption">Stopped</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: 'warning.main', borderRadius: 0.5 }} />
              <Typography variant="caption">Maintenance</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: 'grey.500', borderRadius: 0.5 }} />
              <Typography variant="caption">Idle</Typography>
            </Stack>
          </Stack>

          {/* Zoom Controls */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ mr: 1 }}>
              Zoom: {(scale * 100).toFixed(0)}%
            </Typography>
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} size="small">
                <Iconify icon="eva:plus-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} size="small">
                <Iconify icon={"eva:minus-outline" as any} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Zoom">
              <IconButton onClick={handleResetZoom} size="small">
                <Iconify icon="solar:restart-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <IconButton onClick={handleFullscreen} size="small">
                <Iconify
                  icon={
                    (isFullscreen
                      ? 'solar:quit-full-screen-bold'
                      : 'solar:full-screen-bold') as any
                  }
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Canvas */}
        <Box
          sx={{
            width: '100%',
            height: isFullscreen ? 'calc(100vh - 120px)' : canvasHeight,
            overflow: 'hidden',
            bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          <Stage
            ref={stageRef}
            width={canvasWidth}
            height={isFullscreen ? window.innerHeight - 120 : canvasHeight}
            scaleX={scale}
            scaleY={scale}
            x={position.x}
            y={position.y}
            draggable
            onWheel={handleWheel}
          >
            <Layer>
              {/* Grid Background */}
              {Array.from({ length: 20 }).map((_, i) => (
                <Line
                  key={`h-${i}`}
                  points={[0, i * 40, canvasWidth, i * 40]}
                  stroke={gridColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <Line
                  key={`v-${i}`}
                  points={[i * 40, 0, i * 40, canvasHeight]}
                  stroke={gridColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              ))}
            </Layer>

            <Layer>
              {/* Render Areas */}
              {mockCanvasData.map((area) => (
                <Group key={area.id}>
                  {/* Area Shadow */}
                  <Rect
                    x={area.position.x + 3}
                    y={area.position.y + 3}
                    width={area.width}
                    height={area.height}
                    fill="black"
                    opacity={0.1}
                    cornerRadius={6}
                  />

                  {/* Area Rectangle */}
                  <Rect
                    x={area.position.x}
                    y={area.position.y}
                    width={area.width}
                    height={area.height}
                    fill={areaColor}
                    stroke={areaStrokeColor}
                    strokeWidth={3}
                    cornerRadius={6}
                    shadowBlur={5}
                    shadowColor="black"
                    shadowOpacity={0.15}
                  />

                  {/* Area Header Bar */}
                  <Rect
                    x={area.position.x}
                    y={area.position.y}
                    width={area.width}
                    height={35}
                    fill={isDarkMode ? theme.palette.grey[700] : theme.palette.grey[200]}
                    cornerRadius={[6, 6, 0, 0]}
                  />

                  {/* Area Label */}
                  <Text
                    x={area.position.x + 15}
                    y={area.position.y + 10}
                    text={area.name}
                    fontSize={14}
                    fontStyle="bold"
                    fill={textColor}
                  />

                  {/* Render Machines in Area */}
                  {area.machines.map((machine) => {
                    const absX = area.position.x + machine.position.x;
                    const absY = area.position.y + machine.position.y;
                    const isHovered = hoveredMachine === machine.id;
                    const statusColor = getStatusColor(machine.status);

                    return (
                      <Group key={machine.id}>
                        {/* Machine Shadow */}
                        <Rect
                          x={absX + 2}
                          y={absY + 2}
                          width={90}
                          height={70}
                          fill="black"
                          opacity={0.15}
                          cornerRadius={6}
                        />

                        {/* Machine Background Rectangle */}
                        <Rect
                          x={absX}
                          y={absY}
                          width={90}
                          height={70}
                          fill={statusColor}
                          stroke={isHovered ? '#ffffff' : areaStrokeColor}
                          strokeWidth={isHovered ? 3 : 2}
                          cornerRadius={6}
                          shadowBlur={isHovered ? 15 : 5}
                          shadowColor="black"
                          shadowOpacity={isHovered ? 0.4 : 0.2}
                          onClick={() => handleMachineClick(machine.id)}
                          onTap={() => handleMachineClick(machine.id)}
                          onMouseEnter={() => setHoveredMachine(machine.id)}
                          onMouseLeave={() => setHoveredMachine(null)}
                        />

                        {/* Machine Gradient Overlay */}
                        <Rect
                          x={absX}
                          y={absY}
                          width={90}
                          height={35}
                          fill={statusColor}
                          opacity={0.3}
                          cornerRadius={[6, 6, 0, 0]}
                        />

                        {/* Status Indicator Circle */}
                        <Circle
                          x={absX + 12}
                          y={absY + 12}
                          radius={5}
                          fill="#ffffff"
                          shadowBlur={3}
                          shadowColor="black"
                          shadowOpacity={0.3}
                        />
                        <Circle
                          x={absX + 12}
                          y={absY + 12}
                          radius={3}
                          fill={statusColor}
                        />

                        {/* Machine Icon (Gear representation) */}
                        <Circle
                          x={absX + 75}
                          y={absY + 15}
                          radius={8}
                          stroke="#ffffff"
                          strokeWidth={2}
                          opacity={0.7}
                        />
                        <Line
                          points={[absX + 75, absY + 7, absX + 75, absY + 23]}
                          stroke="#ffffff"
                          strokeWidth={2}
                          opacity={0.7}
                        />
                        <Line
                          points={[absX + 67, absY + 15, absX + 83, absY + 15]}
                          stroke="#ffffff"
                          strokeWidth={2}
                          opacity={0.7}
                        />

                        {/* Machine Name */}
                        <Text
                          x={absX + 5}
                          y={absY + 28}
                          text={machine.name}
                          fontSize={11}
                          fontStyle="bold"
                          fill="#ffffff"
                          width={80}
                          align="center"
                        />

                        {/* Machine Status */}
                        <Text
                          x={absX + 5}
                          y={absY + 43}
                          text={getStatusLabel(machine.status)}
                          fontSize={9}
                          fill="#ffffff"
                          width={80}
                          align="center"
                          opacity={0.9}
                        />

                        {/* OEE Badge */}
                        <Rect
                          x={absX + 20}
                          y={absY + 56}
                          width={50}
                          height={10}
                          fill="#ffffff"
                          cornerRadius={5}
                          opacity={0.95}
                        />
                        <Text
                          x={absX + 20}
                          y={absY + 57}
                          text={`OEE: ${machine.oee.toFixed(0)}%`}
                          fontSize={8}
                          fontStyle="bold"
                          fill={statusColor}
                          width={50}
                          align="center"
                        />
                      </Group>
                    );
                  })}
                </Group>
              ))}
            </Layer>
          </Stage>
        </Box>
      </Card>
    </DashboardContent>
  );
}
