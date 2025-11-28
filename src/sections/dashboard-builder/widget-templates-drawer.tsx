import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

import { renderWidget } from './widget-registry';

import type { ChartType, WidgetType, ChartWidgetConfig } from './types';

// ----------------------------------------------------------------------

// Widget template with visual preview configuration
interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  type: WidgetType;
  category: string;
  icon: string;
  previewConfig: unknown;
}

// Template categories for grouping
interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  templates: WidgetTemplate[];
}

// Predefined widget templates
const WIDGET_TEMPLATES: WidgetTemplate[] = [
  // Chart Templates
  {
    id: 'chart-line',
    name: 'Line Chart',
    description: 'Trend visualization over time',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-line',
    previewConfig: {
      chartType: 'line' as ChartType,
      title: 'Line Chart',
      series: [{ name: 'Data', data: [30, 40, 35, 50, 49, 60, 70] }],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    } as ChartWidgetConfig,
  },
  {
    id: 'chart-bar',
    name: 'Bar Chart',
    description: 'Compare values across categories',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-bar',
    previewConfig: {
      chartType: 'bar' as ChartType,
      title: 'Bar Chart',
      series: [{ name: 'Sales', data: [44, 55, 57, 56, 61, 58, 63] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    } as ChartWidgetConfig,
  },
  {
    id: 'chart-area',
    name: 'Area Chart',
    description: 'Show cumulative totals',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-areaspline',
    previewConfig: {
      chartType: 'area' as ChartType,
      title: 'Area Chart',
      series: [{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    } as ChartWidgetConfig,
  },
  {
    id: 'chart-pie',
    name: 'Pie Chart',
    description: 'Show proportions of a whole',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-pie',
    previewConfig: {
      chartType: 'pie' as ChartType,
      title: 'Pie Chart',
      series: [44, 55, 13, 43, 22],
      categories: ['A', 'B', 'C', 'D', 'E'],
    } as ChartWidgetConfig,
  },
  {
    id: 'chart-donut',
    name: 'Donut Chart',
    description: 'Pie chart with center hole',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-donut',
    previewConfig: {
      chartType: 'donut' as ChartType,
      title: 'Donut Chart',
      series: [44, 55, 41, 17, 15],
      categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    } as ChartWidgetConfig,
  },
  {
    id: 'chart-radial',
    name: 'Radial Bar',
    description: 'Progress-style circular chart',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-arc',
    previewConfig: {
      chartType: 'radialBar' as ChartType,
      title: 'Radial Bar',
      series: [76, 67, 61, 90],
      categories: ['Apples', 'Oranges', 'Bananas', 'Berries'],
    } as ChartWidgetConfig,
  },
  {
    id: 'chart-scatter',
    name: 'Scatter Chart',
    description: 'Show correlation between variables',
    type: 'chart',
    category: 'charts',
    icon: 'mdi:chart-scatter-plot',
    previewConfig: {
      chartType: 'scatter' as ChartType,
      title: 'Scatter Chart',
      series: [
        {
          name: 'Sample A',
          data: [
            [16.4, 5.4],
            [21.7, 2],
            [25.4, 3],
            [19, 2],
            [10.9, 1],
          ],
        },
      ],
      categories: [],
    } as ChartWidgetConfig,
  },
  // Text Templates
  {
    id: 'text-heading',
    name: 'Heading',
    description: 'Large title text',
    type: 'text',
    category: 'text',
    icon: 'mdi:format-header-1',
    previewConfig: {
      content: 'Dashboard Title',
      variant: 'h2',
      align: 'center',
    },
  },
  {
    id: 'text-paragraph',
    name: 'Paragraph',
    description: 'Body text content',
    type: 'text',
    category: 'text',
    icon: 'mdi:format-paragraph',
    previewConfig: {
      content: 'This is a sample paragraph with some descriptive text about your dashboard.',
      variant: 'body1',
      align: 'left',
    },
  },
  {
    id: 'text-caption',
    name: 'Caption',
    description: 'Small descriptive text',
    type: 'text',
    category: 'text',
    icon: 'mdi:format-text',
    previewConfig: {
      content: 'Caption or footnote text',
      variant: 'body2',
      align: 'left',
    },
  },
  // Image Templates
  {
    id: 'image-cover',
    name: 'Cover Image',
    description: 'Full-width cover image',
    type: 'image',
    category: 'media',
    icon: 'mdi:image',
    previewConfig: {
      src: '/assets/images/cover/cover-1.webp',
      alt: 'Cover image',
      objectFit: 'cover',
    },
  },
  {
    id: 'image-contain',
    name: 'Contained Image',
    description: 'Image that fits within bounds',
    type: 'image',
    category: 'media',
    icon: 'mdi:image-outline',
    previewConfig: {
      src: '/assets/images/cover/cover-2.webp',
      alt: 'Contained image',
      objectFit: 'contain',
    },
  },
  {
    id: 'image-blur-overlay',
    name: 'Image with Overlay',
    description: 'Blurred image with text',
    type: 'image-blur',
    category: 'media',
    icon: 'mdi:image-filter-drama',
    previewConfig: {
      src: '/assets/images/cover/cover-3.webp',
      alt: 'Background',
      blurLevel: 4,
      text: 'Featured Content',
      textVariant: 'h4',
      textAlign: 'center',
    },
  },
  // Combined Templates
  {
    id: 'text-image-left',
    name: 'Text Left + Image',
    description: 'Text on left, image on right',
    type: 'text-image',
    category: 'combined',
    icon: 'mdi:page-layout-sidebar-left',
    previewConfig: {
      text: {
        content: 'Description text here',
        variant: 'body1',
        align: 'left',
      },
      image: {
        src: '/assets/images/cover/cover-4.webp',
        alt: 'Sample',
        objectFit: 'cover',
      },
      layout: 'text-left',
    },
  },
  {
    id: 'text-image-right',
    name: 'Image + Text Right',
    description: 'Image on left, text on right',
    type: 'text-image',
    category: 'combined',
    icon: 'mdi:page-layout-sidebar-right',
    previewConfig: {
      text: {
        content: 'Description text here',
        variant: 'body1',
        align: 'left',
      },
      image: {
        src: '/assets/images/cover/cover-5.webp',
        alt: 'Sample',
        objectFit: 'cover',
      },
      layout: 'text-right',
    },
  },
  // Table Templates
  {
    id: 'table-basic',
    name: 'Basic Table',
    description: 'Simple data table',
    type: 'table',
    category: 'data',
    icon: 'mdi:table',
    previewConfig: {
      title: 'Data Table',
      headers: ['Name', 'Value', 'Status'],
      rows: [
        ['Item 1', '100', 'Active'],
        ['Item 2', '200', 'Pending'],
        ['Item 3', '300', 'Complete'],
      ],
      striped: false,
      compact: false,
    },
  },
  {
    id: 'table-striped',
    name: 'Striped Table',
    description: 'Table with alternating row colors',
    type: 'table',
    category: 'data',
    icon: 'mdi:table-row',
    previewConfig: {
      title: 'Striped Table',
      headers: ['Product', 'Quantity', 'Price'],
      rows: [
        ['Product A', '50', '$100'],
        ['Product B', '30', '$200'],
        ['Product C', '20', '$150'],
      ],
      striped: true,
      compact: false,
    },
  },
  {
    id: 'table-compact',
    name: 'Compact Table',
    description: 'Dense table with smaller rows',
    type: 'table',
    category: 'data',
    icon: 'mdi:table-large',
    previewConfig: {
      title: 'Compact Table',
      headers: ['ID', 'Name', 'Date', 'Status'],
      rows: [
        ['001', 'Task 1', '2024-01-01', 'Done'],
        ['002', 'Task 2', '2024-01-02', 'Progress'],
        ['003', 'Task 3', '2024-01-03', 'Pending'],
        ['004', 'Task 4', '2024-01-04', 'Done'],
      ],
      striped: true,
      compact: true,
    },
  },
];

// Group templates by category
const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'charts',
    name: 'Charts',
    icon: 'mdi:chart-box-outline',
    templates: WIDGET_TEMPLATES.filter((t) => t.category === 'charts'),
  },
  {
    id: 'text',
    name: 'Text',
    icon: 'mdi:format-text',
    templates: WIDGET_TEMPLATES.filter((t) => t.category === 'text'),
  },
  {
    id: 'media',
    name: 'Media',
    icon: 'mdi:image-multiple-outline',
    templates: WIDGET_TEMPLATES.filter((t) => t.category === 'media'),
  },
  {
    id: 'data',
    name: 'Data',
    icon: 'mdi:table',
    templates: WIDGET_TEMPLATES.filter((t) => t.category === 'data'),
  },
  {
    id: 'combined',
    name: 'Combined',
    icon: 'mdi:view-grid-plus-outline',
    templates: WIDGET_TEMPLATES.filter((t) => t.category === 'combined'),
  },
];

// ----------------------------------------------------------------------

interface WidgetTemplatesDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WidgetTemplate) => void;
}

export function WidgetTemplatesDrawer({ open, onClose, onSelectTemplate }: WidgetTemplatesDrawerProps) {
  const drawerWidth = 380;

  const handleTemplateClick = (template: WidgetTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          bgcolor: 'background.default',
        },
      }}
    >
      {/* Drawer Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:widgets-outline" width={24} />
          <Typography variant="h6">Widget Templates</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="mdi:close" />
        </IconButton>
      </Stack>

      {/* Template Categories */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
        }}
      >
        {TEMPLATE_CATEGORIES.map((category) => (
          <Box key={category.id} sx={{ mb: 3 }}>
            {/* Category Header */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Iconify icon={category.icon} width={20} sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="fontWeightBold">
                {category.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({category.templates.length})
              </Typography>
            </Stack>

            {/* Template Grid */}
            <Stack spacing={1.5}>
              {category.templates.map((template) => (
                <Card
                  key={template.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => theme.shadows[8],
                      borderColor: 'primary.main',
                    },
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  onClick={() => handleTemplateClick(template)}
                >
                  {/* Widget Preview */}
                  <Box
                    sx={{
                      height: 120,
                      overflow: 'hidden',
                      bgcolor: 'background.neutral',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left',
                        width: '200%',
                        height: '200%',
                        pointerEvents: 'none',
                      }}
                    >
                      {renderWidget(
                        { type: template.type, config: template.previewConfig } as never,
                        { sx: { height: '100%' } }
                      )}
                    </Box>
                  </Box>

                  {/* Template Info */}
                  <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon={template.icon} width={18} sx={{ color: 'text.secondary' }} />
                      <Typography variant="subtitle2">{template.name}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {category.id !== TEMPLATE_CATEGORIES[TEMPLATE_CATEGORIES.length - 1].id && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Drawer Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
          Click a template to add it to your dashboard
        </Typography>
      </Box>
    </Drawer>
  );
}

// Export template type for use in other components
export type { WidgetTemplate };

// Export templates for external use
export { WIDGET_TEMPLATES, TEMPLATE_CATEGORIES };
