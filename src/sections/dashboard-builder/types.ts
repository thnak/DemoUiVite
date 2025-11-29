import type { Layout, Layouts } from 'react-grid-layout';
import type { ChartOptions } from 'src/components/chart';

// ----------------------------------------------------------------------

export type WidgetType = 'chart' | 'text' | 'image' | 'text-image' | 'table' | 'image-blur' | 'image-cutout';

export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'radialBar' | 'scatter';

// Chart widget configuration
export interface ChartWidgetConfig {
  chartType: ChartType;
  title: string;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options?: ChartOptions;
  categories?: string[];
}

// Text widget configuration
export interface TextWidgetConfig {
  content: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2';
  align?: 'left' | 'center' | 'right';
}

// Image widget configuration
export interface ImageWidgetConfig {
  src: string;
  alt: string;
  objectFit?: 'contain' | 'cover' | 'fill';
}

// Text + Image merged widget configuration
export interface TextImageWidgetConfig {
  text: TextWidgetConfig;
  image: ImageWidgetConfig;
  layout: 'text-left' | 'text-right' | 'text-top' | 'text-bottom';
}

// Table widget configuration
export interface TableWidgetConfig {
  title?: string;
  headers: string[];
  rows: string[][];
  striped?: boolean;
  compact?: boolean;
}

// Image blur with text overlay widget configuration
export interface ImageBlurWidgetConfig {
  src: string;
  alt: string;
  blurLevel?: number; // 0-20, default 4
  text: string;
  textVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  textAlign?: 'left' | 'center' | 'right';
}

// Image cutout widget configuration - displays image with shape mask
export type CutoutShape = 'circle' | 'ellipse' | 'hexagon' | 'star' | 'heart' | 'diamond' | 'rounded-square';

export interface ImageCutoutWidgetConfig {
  src: string;
  alt: string;
  shape: CutoutShape;
  backgroundColor?: string; // Background color behind cutout
  borderWidth?: number; // Optional border around shape
  borderColor?: string;
}

// Widget configuration union type
export type WidgetConfig =
  | { type: 'chart'; config: ChartWidgetConfig }
  | { type: 'text'; config: TextWidgetConfig }
  | { type: 'image'; config: ImageWidgetConfig }
  | { type: 'text-image'; config: TextImageWidgetConfig }
  | { type: 'table'; config: TableWidgetConfig }
  | { type: 'image-blur'; config: ImageBlurWidgetConfig }
  | { type: 'image-cutout'; config: ImageCutoutWidgetConfig };

// Widget item with layout information
export interface WidgetItem {
  id: string;
  widgetConfig: WidgetConfig;
}

// Dashboard state with layouts for different breakpoints
export interface DashboardState {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetItem[];
  layouts: Layouts;
  createdAt: string;
  updatedAt: string;
}

// Layout breakpoints configuration
export interface BreakpointConfig {
  name: string;
  cols: number;
  width: number;
}

// Default breakpoint configurations
export const BREAKPOINT_CONFIGS: Record<string, BreakpointConfig> = {
  lg: { name: 'Large', cols: 12, width: 1200 },
  md: { name: 'Medium', cols: 10, width: 996 },
  sm: { name: 'Small', cols: 6, width: 768 },
  xs: { name: 'Extra Small', cols: 4, width: 480 },
  xxs: { name: 'Extra Extra Small', cols: 2, width: 0 },
};

// Widget merge compatibility matrix
export const MERGE_COMPATIBLE: Record<WidgetType, WidgetType[]> = {
  "image-cutout": [],
  text: ['image'],
  image: ['text'],
  chart: [],
  'text-image': [],
  table: [],
  'image-blur': []
};

// Check if two widget types can be merged
export function canMergeWidgets(type1: WidgetType, type2: WidgetType): boolean {
  return MERGE_COMPATIBLE[type1]?.includes(type2) ?? false;
}

// Get default layout item for a widget
export function getDefaultLayoutItem(widgetId: string, index: number): Layout {
  return {
    i: widgetId,
    x: (index * 4) % 12,
    y: Math.floor((index * 4) / 12) * 4,
    w: 4,
    h: 4,
    minW: 2,
    minH: 2,
  };
}

// Create default layouts for all breakpoints
export function createDefaultLayouts(widgets: WidgetItem[]): Layouts {
  const layouts: Layouts = {};

  Object.keys(BREAKPOINT_CONFIGS).forEach((breakpoint) => {
    layouts[breakpoint] = widgets.map((widget, index) => {
      const config = BREAKPOINT_CONFIGS[breakpoint];
      const defaultLayout = getDefaultLayoutItem(widget.id, index);

      return {
        ...defaultLayout,
        w: Math.min(defaultLayout.w, config.cols),
        x: defaultLayout.x % config.cols,
      };
    });
  });

  return layouts;
}
