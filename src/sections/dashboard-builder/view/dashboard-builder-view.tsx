import 'react-grid-layout/css/styles.css';

import type { Layout, Layouts } from 'react-grid-layout';

import { useParams, useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { BREAKPOINT_CONFIGS } from '../types';
import { renderWidget, getRegisteredWidgets } from '../widget-registry';
import { generateId, saveDashboard, getDashboardById } from '../storage';

import type {
  WidgetItem,
  WidgetType,
  WidgetConfig,
  DashboardState,
  ChartWidgetConfig,
} from '../types';

// ----------------------------------------------------------------------

const ResponsiveGridLayout = WidthProvider(Responsive);

// Default sample data for new widgets
const getDefaultWidgetConfig = (type: WidgetType): WidgetConfig => {
  switch (type) {
    case 'chart':
      return {
        type: 'chart',
        config: {
          chartType: 'line',
          title: 'New Chart',
          series: [{ name: 'Series 1', data: [30, 40, 35, 50, 49, 60, 70, 91] }],
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        } as ChartWidgetConfig,
      };
    case 'text':
      return {
        type: 'text',
        config: {
          content: 'Enter your text here...',
          variant: 'body1',
          align: 'left',
        },
      };
    case 'image':
      return {
        type: 'image',
        config: {
          src: '/assets/images/cover/cover-1.webp',
          alt: 'Sample image',
          objectFit: 'cover',
        },
      };
    case 'text-image':
      return {
        type: 'text-image',
        config: {
          text: {
            content: 'Your text here...',
            variant: 'body1',
            align: 'left',
          },
          image: {
            src: '/assets/images/cover/cover-2.webp',
            alt: 'Sample image',
            objectFit: 'cover',
          },
          layout: 'text-left',
        },
      };
    default:
      return {
        type: 'text',
        config: { content: 'Unknown widget type', variant: 'body1', align: 'left' },
      };
  }
};

// ----------------------------------------------------------------------

export function DashboardBuilderView() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Dashboard state
  const [dashboardName, setDashboardName] = useState('New Dashboard');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);
  const [layouts, setLayouts] = useState<Layouts>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  // UI state
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [editWidgetId, setEditWidgetId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load existing dashboard if ID is provided
  useEffect(() => {
    if (id) {
      const dashboard = getDashboardById(id);
      if (dashboard) {
        setDashboardName(dashboard.name);
        setDashboardDescription(dashboard.description ?? '');
        setWidgets(dashboard.widgets);
        setLayouts(dashboard.layouts);
      }
    }
  }, [id]);

  // Handle layout changes
  const handleLayoutChange = useCallback(
    (_currentLayout: Layout[], allLayouts: Layouts) => {
      setLayouts(allLayouts);
    },
    []
  );

  // Handle breakpoint change
  const handleBreakpointChange = useCallback((newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  }, []);

  // Add a new widget
  const handleAddWidget = useCallback((type: WidgetType) => {
    const newWidget: WidgetItem = {
      id: generateId(),
      widgetConfig: getDefaultWidgetConfig(type),
    };

    setWidgets((prev) => {
      const updated = [...prev, newWidget];
      // Update layouts for the new widget
      setLayouts((prevLayouts) => {
        const newLayouts: Layouts = {};
        Object.keys(BREAKPOINT_CONFIGS).forEach((bp) => {
          const existing = prevLayouts[bp] ?? [];
          const newItem: Layout = {
            i: newWidget.id,
            x: 0,
            y: Infinity, // Place at bottom
            w: Math.min(4, BREAKPOINT_CONFIGS[bp].cols),
            h: 4,
            minW: 2,
            minH: 1,
          };
          newLayouts[bp] = [...existing, newItem];
        });
        return newLayouts;
      });
      return updated;
    });

    setAddWidgetOpen(false);
  }, []);

  // Remove a widget
  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayouts((prev) => {
      const newLayouts: Layouts = {};
      Object.keys(prev).forEach((bp) => {
        newLayouts[bp] = prev[bp].filter((l) => l.i !== widgetId);
      });
      return newLayouts;
    });
  }, []);

  // Save dashboard
  const handleSave = useCallback(() => {
    const dashboardId = id ?? generateId();
    const dashboard: DashboardState = {
      id: dashboardId,
      name: dashboardName,
      description: dashboardDescription,
      widgets,
      layouts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      saveDashboard(dashboard);
      setSnackbar({ open: true, message: 'Dashboard saved successfully!', severity: 'success' });
      setSaveDialogOpen(false);

      // Navigate to the saved dashboard URL if it's a new dashboard
      if (!id) {
        navigate(`/dashboard-builder/${dashboardId}`);
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to save dashboard', severity: 'error' });
    }
  }, [id, dashboardName, dashboardDescription, widgets, layouts, navigate]);

  // Get breakpoint columns
  const breakpointCols = useMemo(
    () =>
      Object.entries(BREAKPOINT_CONFIGS).reduce(
        (acc, [bp, config]) => {
          acc[bp] = config.cols;
          return acc;
        },
        {} as Record<string, number>
      ),
    []
  );

  const breakpointWidths = useMemo(
    () =>
      Object.entries(BREAKPOINT_CONFIGS).reduce(
        (acc, [bp, config]) => {
          acc[bp] = config.width;
          return acc;
        },
        {} as Record<string, number>
      ),
    []
  );

  const registeredWidgets = getRegisteredWidgets();

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">{id ? 'Edit Dashboard' : 'Create Dashboard'}</Typography>
          <Typography variant="body2" color="text.secondary">
            Current breakpoint: {BREAKPOINT_CONFIGS[currentBreakpoint]?.name ?? currentBreakpoint}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:content-save" />}
            onClick={() => setSaveDialogOpen(true)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => setAddWidgetOpen(true)}
          >
            Add Widget
          </Button>
        </Stack>
      </Stack>

      {/* Dashboard Grid */}
      <Box
        sx={{
          minHeight: 400,
          bgcolor: 'background.neutral',
          borderRadius: 2,
          p: 2,
        }}
      >
        {widgets.length === 0 ? (
          <Card
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Iconify icon="mdi:view-dashboard-outline" width={64} sx={{ color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              No widgets yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={() => setAddWidgetOpen(true)}
            >
              Add Your First Widget
            </Button>
          </Card>
        ) : (
          <ResponsiveGridLayout
            layouts={layouts}
            breakpoints={breakpointWidths}
            cols={breakpointCols}
            rowHeight={60}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={handleBreakpointChange}
            isDraggable
            isResizable
            containerPadding={[0, 0]}
            margin={[16, 16]}
          >
            {widgets.map((widget) => (
              <Box key={widget.id} sx={{ height: '100%' }}>
                <Box sx={{ position: 'relative', height: '100%' }}>
                  {/* Widget controls */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Tooltip title="Edit widget">
                      <IconButton size="small" onClick={() => setEditWidgetId(widget.id)}>
                        <Iconify icon="mdi:pencil" width={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove widget">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveWidget(widget.id)}
                      >
                        <Iconify icon="mdi:delete" width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  {/* Render widget */}
                  {renderWidget(widget.widgetConfig)}
                </Box>
              </Box>
            ))}
          </ResponsiveGridLayout>
        )}
      </Box>

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetOpen} onClose={() => setAddWidgetOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Widget</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {registeredWidgets.map((entry) => (
              <Card
                key={entry.type}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => handleAddWidget(entry.type)}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon={entry.icon} width={32} />
                  <Box>
                    <Typography variant="subtitle1">{entry.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.description}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddWidgetOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Dashboard</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="Dashboard Name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description (optional)"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!dashboardName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Widget Dialog - Placeholder for future implementation */}
      <Dialog
        open={!!editWidgetId}
        onClose={() => setEditWidgetId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Widget</DialogTitle>
        <DialogContent>
          <WidgetEditor
            widget={widgets.find((w) => w.id === editWidgetId)}
            onSave={(updatedWidget) => {
              setWidgets((prev) =>
                prev.map((w) => (w.id === updatedWidget.id ? updatedWidget : w))
              );
              setEditWidgetId(null);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditWidgetId(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

// Simple widget editor component
interface WidgetEditorProps {
  widget?: WidgetItem;
  onSave: (widget: WidgetItem) => void;
}

function WidgetEditor({ widget, onSave }: WidgetEditorProps) {
  const [config, setConfig] = useState(widget?.widgetConfig);

  if (!widget || !config) {
    return <Typography>No widget selected</Typography>;
  }

  const handleSave = () => {
    onSave({ ...widget, widgetConfig: config });
  };

  switch (config.type) {
    case 'text':
      return (
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label="Content"
            value={config.config.content}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, content: e.target.value },
              })
            }
            fullWidth
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel>Typography Variant</InputLabel>
            <Select
              value={config.config.variant ?? 'body1'}
              label="Typography Variant"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, variant: e.target.value as typeof config.config.variant },
                })
              }
            >
              <MenuItem value="h1">Heading 1</MenuItem>
              <MenuItem value="h2">Heading 2</MenuItem>
              <MenuItem value="h3">Heading 3</MenuItem>
              <MenuItem value="h4">Heading 4</MenuItem>
              <MenuItem value="h5">Heading 5</MenuItem>
              <MenuItem value="h6">Heading 6</MenuItem>
              <MenuItem value="body1">Body 1</MenuItem>
              <MenuItem value="body2">Body 2</MenuItem>
              <MenuItem value="subtitle1">Subtitle 1</MenuItem>
              <MenuItem value="subtitle2">Subtitle 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Alignment</InputLabel>
            <Select
              value={config.config.align ?? 'left'}
              label="Alignment"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, align: e.target.value as typeof config.config.align },
                })
              }
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSave}>
            Apply Changes
          </Button>
        </Stack>
      );

    case 'image':
      return (
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label="Image URL"
            value={config.config.src}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, src: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            label="Alt Text"
            value={config.config.alt}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, alt: e.target.value },
              })
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Object Fit</InputLabel>
            <Select
              value={config.config.objectFit ?? 'cover'}
              label="Object Fit"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, objectFit: e.target.value as typeof config.config.objectFit },
                })
              }
            >
              <MenuItem value="contain">Contain</MenuItem>
              <MenuItem value="cover">Cover</MenuItem>
              <MenuItem value="fill">Fill</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSave}>
            Apply Changes
          </Button>
        </Stack>
      );

    case 'chart':
      return (
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label="Chart Title"
            value={config.config.title}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, title: e.target.value },
              })
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={config.config.chartType}
              label="Chart Type"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, chartType: e.target.value as typeof config.config.chartType },
                })
              }
            >
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="area">Area</MenuItem>
              <MenuItem value="pie">Pie</MenuItem>
              <MenuItem value="donut">Donut</MenuItem>
              <MenuItem value="radialBar">Radial Bar</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSave}>
            Apply Changes
          </Button>
        </Stack>
      );

    case 'text-image':
      return (
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label="Text Content"
            value={config.config.text.content}
            onChange={(e) =>
              setConfig({
                ...config,
                config: {
                  ...config.config,
                  text: { ...config.config.text, content: e.target.value },
                },
              })
            }
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Image URL"
            value={config.config.image.src}
            onChange={(e) =>
              setConfig({
                ...config,
                config: {
                  ...config.config,
                  image: { ...config.config.image, src: e.target.value },
                },
              })
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Layout</InputLabel>
            <Select
              value={config.config.layout}
              label="Layout"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, layout: e.target.value as typeof config.config.layout },
                })
              }
            >
              <MenuItem value="text-left">Text Left</MenuItem>
              <MenuItem value="text-right">Text Right</MenuItem>
              <MenuItem value="text-top">Text Top</MenuItem>
              <MenuItem value="text-bottom">Text Bottom</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSave}>
            Apply Changes
          </Button>
        </Stack>
      );

    default:
      return <Typography>Unknown widget type</Typography>;
  }
}
