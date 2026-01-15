import { useRef, useState } from 'react';
import { Rect, Text, Line, Stage, Layer, Group, Circle } from 'react-konva';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

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

type FactoryCanvas2DProps = {
  areas: AreaData[];
  onMachineClick?: (machineId: string) => void;
  onAreaClick?: (areaId: string) => void;
};

export function FactoryCanvas2D({ areas, onMachineClick, onAreaClick }: FactoryCanvas2DProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredMachine, setHoveredMachine] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const canvasWidth = 1200;
  const canvasHeight = 800;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: any) => {
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
  };

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
    <>
      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="solar:map-bold" />}
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        View Factory Layout (2D)
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Factory Layout - 2D View</Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn}>
                  <Iconify icon="eva:plus-fill" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomOut}>
                  <Iconify icon="eva:minus-outline" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset Zoom">
                <IconButton onClick={handleResetZoom}>
                  <Iconify icon="solar:restart-bold" />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleClose}>
                <Iconify icon="eva:plus-fill" />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
            {/* Legend */}
            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
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

            {/* Canvas */}
            <Box
              sx={{
                width: '100%',
                height: canvasHeight,
                overflow: 'hidden',
                bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
                borderRadius: 1,
                position: 'relative',
              }}
            >
              <Stage
                ref={stageRef}
                width={canvasWidth}
                height={canvasHeight}
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
                  {areas.map((area) => (
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
                        onClick={() => onAreaClick?.(area.id)}
                        onTap={() => onAreaClick?.(area.id)}
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
                              onClick={() => onMachineClick?.(machine.id)}
                              onTap={() => onMachineClick?.(machine.id)}
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
                            <Circle x={absX + 12} y={absY + 12} radius={3} fill={statusColor} />

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

              {/* Zoom Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'background.paper',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  boxShadow: 2,
                }}
              >
                <Typography variant="caption">Zoom: {(scale * 100).toFixed(0)}%</Typography>
              </Box>
            </Box>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
