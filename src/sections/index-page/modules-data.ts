import type { ModuleItem } from './types';

// ----------------------------------------------------------------------

export const MODULES: ModuleItem[] = [
  {
    id: 'master-data',
    title: 'Master Data',
    subtitle: 'Manage core production and tracking data',
    icon: 'solar:database-bold-duotone',
    path: '/products',
    color: 'primary',
  },
  {
    id: 'user-management',
    title: 'User Management',
    subtitle: 'Manage users, roles, and permissions',
    icon: 'solar:user-circle-bold-duotone',
    path: '/user',
    color: 'secondary',
  },
  {
    id: 'device-management',
    title: 'Device Management',
    subtitle: 'Manage IoT devices and sensors',
    icon: 'solar:cpu-bolt-bold-duotone',
    path: '/iot-devices',
    color: 'primary',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Dashboard builder and analytics',
    icon: 'solar:pie-chart-2-bold-duotone',
    path: '/dashboard-builder',
    color: 'secondary',
  },
  {
    id: 'mms',
    title: 'MMS',
    subtitle: 'Machine monitoring system - tracking, production, alerts',
    icon: 'solar:factory-bold-duotone',
    path: '/machines',
    color: 'primary',
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'System configuration - units, conversions, plugins, scheduler',
    icon: 'solar:settings-bold-duotone',
    path: '/settings/units',
    color: 'secondary',
  },
];
