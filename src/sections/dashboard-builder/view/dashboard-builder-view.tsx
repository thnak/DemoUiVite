import 'react-grid-layout/css/styles.css';

import type { Layout, LayoutItem, ResponsiveLayouts } from 'react-grid-layout/legacy';

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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
import { WidgetTemplatesDrawer } from '../widget-templates-drawer';
import { renderWidget, getRegisteredWidgets } from '../widget-registry';
import { generateId, saveDashboard, getDashboardById } from '../storage';
import {
  findMergeRecipe,
  CookingBookDrawer,
  MergeHistoryDrawer,
  MergePreviewDialog,
} from '../cooking-book';

import type { WidgetTemplate } from '../widget-templates-drawer';
import type { MergeRecipe, MergeHistoryEntry } from '../cooking-book';
import type {
  WidgetItem,
  WidgetType,
  CutoutShape,
  WidgetConfig,
  DashboardState,
  ChartWidgetConfig,
  TableWidgetConfig,
  ImageBlurWidgetConfig,
  ImageCutoutWidgetConfig,
} from '../types';

// ----------------------------------------------------------------------

const ResponsiveGridLayout = WidthProvider(Responsive);

// Virtual breakpoint presets for preview
const VIRTUAL_BREAKPOINTS = [
  { key: 'auto', label: 'Auto (Responsive)', width: null, icon: 'mdi:responsive' },
  { key: 'lg', label: 'Desktop (1200px)', width: 1200, icon: 'mdi:monitor' },
  { key: 'md', label: 'Tablet (996px)', width: 996, icon: 'mdi:tablet' },
  { key: 'sm', label: 'Small Tablet (768px)', width: 768, icon: 'mdi:tablet' },
  { key: 'xs', label: 'Mobile (480px)', width: 480, icon: 'mdi:cellphone' },
] as const;

// Keyboard shortcuts
const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl+S', description: 'Save dashboard' },
  { key: 'Ctrl+N', description: 'Add new widget' },
  { key: 'Ctrl+E', description: 'Export as JSON' },
  { key: 'Ctrl+I', description: 'Import from JSON' },
  { key: 'Ctrl+M', description: 'Open Cooking Book' },
  { key: '?', description: 'Show shortcuts' },
] as const;

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
    case 'table':
      return {
        type: 'table',
        config: {
          title: 'Sample Table',
          headers: ['Name', 'Value', 'Status'],
          rows: [
            ['Item 1', '100', 'Active'],
            ['Item 2', '200', 'Pending'],
            ['Item 3', '300', 'Complete'],
          ],
          striped: true,
          compact: false,
        } as TableWidgetConfig,
      };
    case 'image-blur':
      return {
        type: 'image-blur',
        config: {
          src: '/assets/images/cover/cover-3.webp',
          alt: 'Background image',
          blurLevel: 4,
          text: 'Your overlay text here',
          textVariant: 'h4',
          textAlign: 'center',
        } as ImageBlurWidgetConfig,
      };
    case 'image-cutout':
      return {
        type: 'image-cutout',
        config: {
          src: '/assets/images/avatar/avatar-1.webp',
          alt: 'Cutout image',
          shape: 'circle',
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: 'primary.main',
        } as ImageCutoutWidgetConfig,
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
  const [layouts, setLayouts] = useState<ResponsiveLayouts>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  // UI state
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [editWidgetId, setEditWidgetId] = useState<string | null>(null);
  const [virtualBreakpoint, setVirtualBreakpoint] = useState<string>('auto');
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [templatesDrawerOpen, setTemplatesDrawerOpen] = useState(false);

  // Cooking Book (Widget Merge) state
  const [cookingBookOpen, setCookingBookOpen] = useState(false);
  const [mergeHistoryOpen, setMergeHistoryOpen] = useState(false);
  const [mergeHistory, setMergeHistory] = useState<MergeHistoryEntry[]>([]);
  const [mergePreviewOpen, setMergePreviewOpen] = useState(false);
  const [pendingMerge, setPendingMerge] = useState<{
    recipe: MergeRecipe | null;
    primaryWidget: WidgetItem | null;
    secondaryWidget: WidgetItem | null;
  }>({ recipe: null, primaryWidget: null, secondaryWidget: null });
  // Click-to-merge state (replacing drag-drop)
  const [mergeSelectOpen, setMergeSelectOpen] = useState(false);
  const [mergeSourceWidget, setMergeSourceWidget] = useState<WidgetItem | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
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
  const handleLayoutChange = useCallback((_currentLayout: Layout, allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
  }, []);

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
        const newLayouts: ResponsiveLayouts = {};
        Object.keys(BREAKPOINT_CONFIGS).forEach((bp) => {
          const existing = prevLayouts[bp] ?? [];
          const newItem: LayoutItem = {
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

  // Add widget from template
  const handleAddWidgetFromTemplate = useCallback((template: WidgetTemplate) => {
    const newWidget: WidgetItem = {
      id: generateId(),
      widgetConfig: { type: template.type, config: template.previewConfig } as WidgetConfig,
    };

    setWidgets((prev) => {
      const updated = [...prev, newWidget];
      // Update layouts for the new widget
      setLayouts((prevLayouts) => {
        const newLayouts: ResponsiveLayouts = {};
        Object.keys(BREAKPOINT_CONFIGS).forEach((bp) => {
          const existing = prevLayouts[bp] ?? [];
          const newItem: LayoutItem = {
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

    setSnackbar({
      open: true,
      message: `Added "${template.name}" widget`,
      severity: 'success',
    });
  }, []);

  // Remove a widget
  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayouts((prev) => {
      const newLayouts: ResponsiveLayouts = {};
      Object.keys(prev).forEach((bp) => {
        newLayouts[bp] = (prev[bp] ?? []).filter((l) => l.i !== widgetId);
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

  // Export dashboard as JSON
  const handleExport = useCallback(() => {
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

    const jsonString = JSON.stringify(dashboard, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${dashboardName.replace(/\s+/g, '-').toLowerCase()}-dashboard.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'Dashboard exported successfully!', severity: 'success' });
  }, [id, dashboardName, dashboardDescription, widgets, layouts]);

  // Import dashboard from JSON
  const handleImport = useCallback(() => {
    try {
      const dashboard = JSON.parse(importJson) as DashboardState;

      if (!dashboard.widgets || !dashboard.layouts) {
        throw new Error('Invalid dashboard format');
      }

      setDashboardName(dashboard.name ?? 'Imported Dashboard');
      setDashboardDescription(dashboard.description ?? '');
      setWidgets(dashboard.widgets);
      setLayouts(dashboard.layouts);
      setImportDialogOpen(false);
      setImportJson('');
      setSnackbar({ open: true, message: 'Dashboard imported successfully!', severity: 'success' });
    } catch {
      setSnackbar({
        open: true,
        message: 'Invalid JSON format. Please check your input.',
        severity: 'error',
      });
    }
  }, [importJson]);

  // Handle merge button click - open merge target selection dialog
  const handleMergeClick = useCallback((widget: WidgetItem) => {
    setMergeSourceWidget(widget);
    setMergeSelectOpen(true);
  }, []);

  // Handle selecting a merge target from the dialog
  const handleSelectMergeTarget = useCallback(
    (targetWidget: WidgetItem, recipe: MergeRecipe) => {
      if (!mergeSourceWidget) return;

      // Determine primary and secondary based on recipe
      let primaryWidget: WidgetItem;
      let secondaryWidget: WidgetItem;

      if (recipe.primaryIngredient === mergeSourceWidget.widgetConfig.type) {
        primaryWidget = mergeSourceWidget;
        secondaryWidget = targetWidget;
      } else {
        primaryWidget = targetWidget;
        secondaryWidget = mergeSourceWidget;
      }

      // Show merge preview dialog
      setPendingMerge({ recipe, primaryWidget, secondaryWidget });
      setMergeSelectOpen(false);
      setMergePreviewOpen(true);
    },
    [mergeSourceWidget]
  );

  // Get available merge options for a widget
  const getAvailableMergeOptions = useCallback(
    (sourceWidget: WidgetItem) => {
      const options: Array<{
        targetWidget: WidgetItem;
        recipe: MergeRecipe;
      }> = [];

      widgets.forEach((targetWidget) => {
        if (targetWidget.id === sourceWidget.id) return;

        // Check if source can be primary
        const recipeAsPrimary = findMergeRecipe(
          sourceWidget.widgetConfig.type,
          targetWidget.widgetConfig.type
        );
        if (recipeAsPrimary) {
          options.push({ targetWidget, recipe: recipeAsPrimary });
        }

        // Check if source can be secondary
        const recipeAsSecondary = findMergeRecipe(
          targetWidget.widgetConfig.type,
          sourceWidget.widgetConfig.type
        );
        if (recipeAsSecondary && recipeAsSecondary.id !== recipeAsPrimary?.id) {
          options.push({ targetWidget, recipe: recipeAsSecondary });
        }
      });

      return options;
    },
    [widgets]
  );

  // Confirm widget merge
  const handleConfirmMerge = useCallback(() => {
    const { recipe, primaryWidget, secondaryWidget } = pendingMerge;
    if (!recipe || !primaryWidget || !secondaryWidget) return;

    // Create merged widget using recipe transform
    const mergedConfig = recipe.transform(primaryWidget.widgetConfig, secondaryWidget.widgetConfig);

    const mergedWidget: WidgetItem = {
      id: generateId(),
      widgetConfig: mergedConfig,
    };

    // Add to merge history for undo
    const historyEntry: MergeHistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      recipeName: recipe.name,
      originalPrimaryWidget: primaryWidget,
      originalSecondaryWidget: secondaryWidget,
      resultWidget: mergedWidget,
    };

    setMergeHistory((prev) => [historyEntry, ...prev]);

    // Update widgets: remove both originals, add merged
    setWidgets((prev) => {
      const filtered = prev.filter((w) => w.id !== primaryWidget.id && w.id !== secondaryWidget.id);
      return [...filtered, mergedWidget];
    });

    // Update layouts: keep primary widget's position, remove secondary
    setLayouts((prevLayouts) => {
      const newLayouts: ResponsiveLayouts = {};
      Object.keys(prevLayouts).forEach((bp) => {
        const primaryLayout = (prevLayouts[bp] ?? []).find((l) => l.i === primaryWidget.id);
        const filteredLayouts = (prevLayouts[bp] ?? []).filter(
          (l) => l.i !== primaryWidget.id && l.i !== secondaryWidget.id
        );
        if (primaryLayout) {
          newLayouts[bp] = [...filteredLayouts, { ...primaryLayout, i: mergedWidget.id }];
        } else {
          newLayouts[bp] = filteredLayouts;
        }
      });
      return newLayouts;
    });

    setMergePreviewOpen(false);
    setPendingMerge({ recipe: null, primaryWidget: null, secondaryWidget: null });
    setSnackbar({
      open: true,
      message: `Successfully merged widgets: ${recipe.name}`,
      severity: 'success',
    });
  }, [pendingMerge]);

  // Undo a merge
  const handleUndoMerge = useCallback((entry: MergeHistoryEntry) => {
    // Remove merged widget, restore originals
    setWidgets((prev) => {
      const filtered = prev.filter((w) => w.id !== entry.resultWidget.id);
      return [...filtered, entry.originalPrimaryWidget, entry.originalSecondaryWidget];
    });

    // Restore layouts
    setLayouts((prevLayouts) => {
      const newLayouts: ResponsiveLayouts = {};
      Object.keys(prevLayouts).forEach((bp) => {
        const mergedLayout = (prevLayouts[bp] ?? []).find((l) => l.i === entry.resultWidget.id);
        const filteredLayouts = (prevLayouts[bp] ?? []).filter((l) => l.i !== entry.resultWidget.id);

        const restoredLayouts = [
          ...filteredLayouts,
          mergedLayout
            ? { ...mergedLayout, i: entry.originalPrimaryWidget.id }
            : {
                i: entry.originalPrimaryWidget.id,
                x: 0,
                y: Infinity,
                w: 4,
                h: 4,
                minW: 2,
                minH: 2,
              },
          {
            i: entry.originalSecondaryWidget.id,
            x: 4,
            y: Infinity,
            w: 4,
            h: 4,
            minW: 2,
            minH: 2,
          },
        ];
        newLayouts[bp] = restoredLayouts;
      });
      return newLayouts;
    });

    // Remove from history
    setMergeHistory((prev) => prev.filter((h) => h.id !== entry.id));

    setSnackbar({
      open: true,
      message: 'Merge undone - original widgets restored',
      severity: 'success',
    });
  }, []);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S: Save
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        setSaveDialogOpen(true);
      }
      // Ctrl+N: Add widget
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        setAddWidgetOpen(true);
      }
      // Ctrl+E: Export
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        handleExport();
      }
      // Ctrl+I: Import
      if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        setImportDialogOpen(true);
      }
      // ?: Show shortcuts
      if (event.key === '?' && !event.ctrlKey && !event.altKey) {
        setShortcutsDialogOpen(true);
      }
      // Ctrl+M: Open Cooking Book
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        setCookingBookOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExport]);

  // Get virtual breakpoint width
  const virtualWidth = useMemo(() => {
    const preset = VIRTUAL_BREAKPOINTS.find((bp) => bp.key === virtualBreakpoint);
    return preset?.width ?? null;
  }, [virtualBreakpoint]);

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
            {virtualWidth && ` • Preview: ${virtualWidth}px`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {/* Virtual Breakpoint Switcher */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={virtualBreakpoint}
              onChange={(e) => setVirtualBreakpoint(e.target.value)}
              displayEmpty
              renderValue={(value) => {
                const preset = VIRTUAL_BREAKPOINTS.find((bp) => bp.key === value);
                return (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon={preset?.icon ?? 'mdi:responsive'} width={18} />
                    <span>{preset?.label.split(' ')[0] ?? 'Auto'}</span>
                  </Stack>
                );
              }}
            >
              {VIRTUAL_BREAKPOINTS.map((bp) => (
                <MenuItem key={bp.key} value={bp.key}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon={bp.icon} width={18} />
                    <span>{bp.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Keyboard shortcuts (?)">
            <IconButton onClick={() => setShortcutsDialogOpen(true)}>
              <Iconify icon="mdi:keyboard" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cooking Book - Merge Widgets (Ctrl+M)">
            <IconButton onClick={() => setCookingBookOpen(true)}>
              <Iconify icon="mdi:chef-hat" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Merge History">
            <IconButton onClick={() => setMergeHistoryOpen(true)}>
              <Iconify icon="mdi:history" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export as JSON (Ctrl+E)">
            <IconButton onClick={handleExport}>
              <Iconify icon="solar:cloud-download-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Import from JSON (Ctrl+I)">
            <IconButton onClick={() => setImportDialogOpen(true)}>
              <Iconify icon="mdi:import" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Widget Templates">
            <IconButton onClick={() => setTemplatesDrawerOpen(true)}>
              <Iconify icon="mdi:widgets-outline" />
            </IconButton>
          </Tooltip>

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
          ...(virtualWidth && {
            maxWidth: virtualWidth,
            mx: 'auto',
            transition: 'max-width 0.3s ease',
          }),
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
            <Iconify
              icon="mdi:view-dashboard-outline"
              width={64}
              sx={{ color: 'text.secondary' }}
            />
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
                      top: -24,
                      right: 8,
                      zIndex: 20,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1,
                      pointerEvents: 'auto',
                    }}
                  >
                    <Tooltip title="Merge with another widget">
                      <IconButton size="small" onClick={() => handleMergeClick(widget)}>
                        <Iconify icon="mdi:merge" width={18} />
                      </IconButton>
                    </Tooltip>
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
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
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
      <Dialog open={!!editWidgetId} onClose={() => setEditWidgetId(null)} maxWidth="md" fullWidth>
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

      {/* Keyboard Shortcuts Dialog */}
      <Dialog
        open={shortcutsDialogOpen}
        onClose={() => setShortcutsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {KEYBOARD_SHORTCUTS.map((shortcut) => (
              <Stack
                key={shortcut.key}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">{shortcut.description}</Typography>
                <Box
                  component="kbd"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                  }}
                >
                  {shortcut.key}
                </Box>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShortcutsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Dashboard from JSON</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Paste the JSON content of a previously exported dashboard below:
            </Typography>
            <TextField
              label="JSON Content"
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              fullWidth
              multiline
              rows={10}
              placeholder='{"name": "My Dashboard", "widgets": [...], "layouts": {...}}'
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleImport} disabled={!importJson.trim()}>
            Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Widget Templates Drawer */}
      <WidgetTemplatesDrawer
        open={templatesDrawerOpen}
        onClose={() => setTemplatesDrawerOpen(false)}
        onSelectTemplate={handleAddWidgetFromTemplate}
      />

      {/* Cooking Book Drawer */}
      <CookingBookDrawer open={cookingBookOpen} onClose={() => setCookingBookOpen(false)} />

      {/* Merge History Drawer */}
      <MergeHistoryDrawer
        open={mergeHistoryOpen}
        onClose={() => setMergeHistoryOpen(false)}
        history={mergeHistory}
        onUndo={handleUndoMerge}
      />

      {/* Merge Target Selection Dialog */}
      <Dialog
        open={mergeSelectOpen}
        onClose={() => {
          setMergeSelectOpen(false);
          setMergeSourceWidget(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:chef-hat" width={24} />
            <span>Select Merge Target</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {mergeSourceWidget && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert severity="info">
                Select a widget to merge with your{' '}
                <strong>
                  {mergeSourceWidget.widgetConfig.type.charAt(0).toUpperCase() +
                    mergeSourceWidget.widgetConfig.type.slice(1)}
                </strong>{' '}
                widget
              </Alert>

              {getAvailableMergeOptions(mergeSourceWidget).length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Iconify icon="mdi:chef-hat" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No compatible widgets to merge with
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Add more widgets or check the Cooking Book for valid recipes
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {getAvailableMergeOptions(mergeSourceWidget).map(({ targetWidget, recipe }) => (
                    <Card
                      key={`${targetWidget.id}-${recipe.id}`}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '2px solid transparent',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleSelectMergeTarget(targetWidget, recipe)}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              p: 0.75,
                              bgcolor: 'primary.lighter',
                              borderRadius: 1,
                              display: 'flex',
                            }}
                          >
                            <Iconify
                              icon={
                                targetWidget.widgetConfig.type === 'chart'
                                  ? 'mdi:chart-box-outline'
                                  : targetWidget.widgetConfig.type === 'text'
                                    ? 'mdi:format-header-1'
                                    : targetWidget.widgetConfig.type === 'image'
                                      ? 'mdi:image-outline'
                                      : targetWidget.widgetConfig.type === 'table'
                                        ? 'mdi:table-large'
                                        : 'mdi:widgets-outline'
                              }
                              width={20}
                            />
                          </Box>
                          <Typography variant="subtitle2">
                            {targetWidget.widgetConfig.type.charAt(0).toUpperCase() +
                              targetWidget.widgetConfig.type.slice(1)}{' '}
                            Widget
                          </Typography>
                          <Iconify
                            icon="mdi:arrow-right"
                            width={16}
                            sx={{ color: 'text.secondary' }}
                          />
                          <Chip
                            size="small"
                            label={recipe.resultType}
                            color="success"
                            variant="outlined"
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {recipe.name}
                        </Typography>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMergeSelectOpen(false);
              setMergeSourceWidget(null);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Merge Preview Dialog */}
      <MergePreviewDialog
        open={mergePreviewOpen}
        onClose={() => {
          setMergePreviewOpen(false);
          setPendingMerge({ recipe: null, primaryWidget: null, secondaryWidget: null });
        }}
        onConfirm={handleConfirmMerge}
        recipe={pendingMerge.recipe}
        primaryWidget={pendingMerge.primaryWidget}
        secondaryWidget={pendingMerge.secondaryWidget}
      />

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
                  config: {
                    ...config.config,
                    variant: e.target.value as typeof config.config.variant,
                  },
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
                  config: {
                    ...config.config,
                    objectFit: e.target.value as typeof config.config.objectFit,
                  },
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
                  config: {
                    ...config.config,
                    chartType: e.target.value as typeof config.config.chartType,
                  },
                })
              }
            >
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="area">Area</MenuItem>
              <MenuItem value="pie">Pie</MenuItem>
              <MenuItem value="donut">Donut</MenuItem>
              <MenuItem value="radialBar">Radial Bar</MenuItem>
              <MenuItem value="scatter">Scatter</MenuItem>
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
                  config: {
                    ...config.config,
                    layout: e.target.value as typeof config.config.layout,
                  },
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

    case 'table':
      return (
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label="Table Title"
            value={config.config.title ?? ''}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, title: e.target.value },
              })
            }
            fullWidth
          />
          <TextField
            label="Headers (comma-separated)"
            value={config.config.headers.join(', ')}
            onChange={(e) =>
              setConfig({
                ...config,
                config: {
                  ...config.config,
                  headers: e.target.value.split(',').map((h) => h.trim()),
                },
              })
            }
            fullWidth
            helperText="Enter column headers separated by commas"
          />
          <TextField
            label="Rows (one per line, comma-separated values)"
            value={config.config.rows.map((row) => row.join(', ')).join('\n')}
            onChange={(e) =>
              setConfig({
                ...config,
                config: {
                  ...config.config,
                  rows: e.target.value
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line) => line.split(',').map((cell) => cell.trim())),
                },
              })
            }
            fullWidth
            multiline
            rows={5}
            helperText="Enter one row per line, with values separated by commas"
          />
          <FormControl fullWidth>
            <InputLabel>Striped Rows</InputLabel>
            <Select
              value={config.config.striped ? 'yes' : 'no'}
              label="Striped Rows"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, striped: e.target.value === 'yes' },
                })
              }
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Compact Mode</InputLabel>
            <Select
              value={config.config.compact ? 'yes' : 'no'}
              label="Compact Mode"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, compact: e.target.value === 'yes' },
                })
              }
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSave}>
            Apply Changes
          </Button>
        </Stack>
      );

    case 'image-blur':
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
          <TextField
            label="Overlay Text"
            value={config.config.text}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, text: e.target.value },
              })
            }
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Blur Level (0-20)"
            type="number"
            value={config.config.blurLevel ?? 4}
            onChange={(e) =>
              setConfig({
                ...config,
                config: {
                  ...config.config,
                  blurLevel: Math.max(0, Math.min(20, Number(e.target.value))),
                },
              })
            }
            fullWidth
            slotProps={{ htmlInput: { min: 0, max: 20 } }}
          />
          <FormControl fullWidth>
            <InputLabel>Text Variant</InputLabel>
            <Select
              value={config.config.textVariant ?? 'h4'}
              label="Text Variant"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: {
                    ...config.config,
                    textVariant: e.target.value as typeof config.config.textVariant,
                  },
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
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Text Alignment</InputLabel>
            <Select
              value={config.config.textAlign ?? 'center'}
              label="Text Alignment"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: {
                    ...config.config,
                    textAlign: e.target.value as typeof config.config.textAlign,
                  },
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

    case 'image-cutout':
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
            <InputLabel>Shape</InputLabel>
            <Select
              value={config.config.shape}
              label="Shape"
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config, shape: e.target.value as CutoutShape },
                })
              }
            >
              <MenuItem value="circle">⬤ Circle</MenuItem>
              <MenuItem value="ellipse">⬮ Ellipse</MenuItem>
              <MenuItem value="hexagon">⬡ Hexagon</MenuItem>
              <MenuItem value="star">★ Star</MenuItem>
              <MenuItem value="heart">♥ Heart</MenuItem>
              <MenuItem value="diamond">◆ Diamond</MenuItem>
              <MenuItem value="rounded-square">▢ Rounded Square</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Background Color"
            value={config.config.backgroundColor ?? 'transparent'}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, backgroundColor: e.target.value },
              })
            }
            fullWidth
            placeholder="transparent, #fff, rgba(0,0,0,0.1)"
          />
          <TextField
            label="Border Width"
            type="number"
            value={config.config.borderWidth ?? 0}
            onChange={(e) =>
              setConfig({
                ...config,
                config: {
                  ...config.config,
                  borderWidth: Math.max(0, Number(e.target.value)),
                },
              })
            }
            fullWidth
            slotProps={{ htmlInput: { min: 0, max: 20 } }}
          />
          <TextField
            label="Border Color"
            value={config.config.borderColor ?? 'primary.main'}
            onChange={(e) =>
              setConfig({
                ...config,
                config: { ...config.config, borderColor: e.target.value },
              })
            }
            fullWidth
            placeholder="primary.main, #333, blue"
          />
          <Button variant="contained" onClick={handleSave}>
            Apply Changes
          </Button>
        </Stack>
      );

    default:
      return <Typography>Unknown widget type</Typography>;
  }
}
