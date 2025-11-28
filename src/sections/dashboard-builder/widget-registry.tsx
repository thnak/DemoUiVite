import type { CardProps } from '@mui/material/Card';
import type { IconifyName } from 'src/components/iconify/register-icons';

import {
  TextWidget,
  ChartWidget,
  ImageWidget,
  TableWidget,
  TextImageWidget,
  ImageBlurWidget,
} from './widgets';

import type { WidgetType, WidgetConfig } from './types';

// ----------------------------------------------------------------------

// Widget renderer type
type WidgetRenderer<T> = React.FC<CardProps & { config: T }>;

// Widget registry entry
interface WidgetRegistryEntry<T = unknown> {
  type: WidgetType;
  name: string;
  description: string;
  renderer: WidgetRenderer<T>;
  icon: IconifyName;
}

// Built-in widget registry
const builtInWidgets: Map<WidgetType, WidgetRegistryEntry> = new Map([
  [
    'chart',
    {
      type: 'chart',
      name: 'Chart',
      description: 'Display data using ApexCharts (line, bar, pie, etc.)',
      renderer: ChartWidget as WidgetRenderer<unknown>,
      icon: 'mdi:chart-line',
    },
  ],
  [
    'text',
    {
      type: 'text',
      name: 'Text',
      description: 'Display text content with customizable typography',
      renderer: TextWidget as WidgetRenderer<unknown>,
      icon: 'mdi:format-text',
    },
  ],
  [
    'image',
    {
      type: 'image',
      name: 'Image',
      description: 'Display an image with customizable fit options',
      renderer: ImageWidget as WidgetRenderer<unknown>,
      icon: 'mdi:image',
    },
  ],
  [
    'text-image',
    {
      type: 'text-image',
      name: 'Text + Image',
      description: 'Combined text and image widget',
      renderer: TextImageWidget as WidgetRenderer<unknown>,
      icon: 'mdi:image-text',
    },
  ],
  [
    'table',
    {
      type: 'table',
      name: 'Table',
      description: 'Display tabular data with optional striping and compact mode',
      renderer: TableWidget as WidgetRenderer<unknown>,
      icon: 'mdi:table',
    },
  ],
  [
    'image-blur',
    {
      type: 'image-blur',
      name: 'Image with Text Overlay',
      description: 'Blurred background image with text overlay',
      renderer: ImageBlurWidget as WidgetRenderer<unknown>,
      icon: 'mdi:image-filter-drama',
    },
  ],
]);

// Custom widget registry for extensions
const customWidgets: Map<string, WidgetRegistryEntry> = new Map();

// Register a custom widget type
export function registerWidget<T>(entry: WidgetRegistryEntry<T>): void {
  customWidgets.set(entry.type, entry as WidgetRegistryEntry);
}

// Get all registered widget types
export function getRegisteredWidgets(): WidgetRegistryEntry[] {
  return [...builtInWidgets.values(), ...customWidgets.values()];
}

// Get a specific widget entry
export function getWidgetEntry(type: WidgetType | string): WidgetRegistryEntry | undefined {
  return builtInWidgets.get(type as WidgetType) ?? customWidgets.get(type);
}

// Render a widget based on its configuration
export function renderWidget(widgetConfig: WidgetConfig, props?: CardProps): React.ReactNode {
  const entry = getWidgetEntry(widgetConfig.type);

  if (!entry) {
    console.warn(`Unknown widget type: ${widgetConfig.type}`);
    return null;
  }

  const WidgetComponent = entry.renderer as WidgetRenderer<typeof widgetConfig.config>;
  return <WidgetComponent config={widgetConfig.config} {...props} />;
}
