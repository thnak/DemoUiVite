import type { ModuleItem } from './types';

// ----------------------------------------------------------------------

export const MODULES: ModuleItem[] = [
  {
    id: 'master-data',
    title: 'Master Data',
    subtitle: 'Manage core data and configurations',
    icon: 'solar:database-bold-duotone',
    path: '/products',
    color: 'primary',
  },
  {
    id: 'report',
    title: 'Report',
    subtitle: 'Analytics and reporting tools',
    icon: 'solar:chart-bold-duotone',
    path: '/downtime-report',
    color: 'secondary',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Real-time monitoring overview',
    icon: 'solar:pie-chart-2-bold-duotone',
    path: '/dashboard-builder',
    color: 'primary',
  },
  {
    id: 'operation-interface',
    title: 'Operation Interface',
    subtitle: 'Production floor controls',
    icon: 'solar:clapperboard-open-bold-duotone',
    path: '/demo/dashboard',
    color: 'secondary',
  },
  {
    id: 'machine',
    title: 'Machine',
    subtitle: 'Equipment and production lines',
    icon: 'solar:factory-bold-duotone',
    path: '/machines',
    color: 'primary',
  },
  {
    id: 'alert-management',
    title: 'Alert Management',
    subtitle: 'Notifications and warnings',
    icon: 'solar:danger-triangle-bold-duotone',
    path: '/stop-machine-reason',
    color: 'secondary',
  },
  {
    id: 'device-management',
    title: 'Device Management',
    subtitle: 'IoT sensors and devices',
    icon: 'solar:cpu-bolt-bold-duotone',
    path: '/iot-devices',
    color: 'primary',
  },
  {
    id: 'user-management',
    title: 'User Management',
    subtitle: 'Accounts and permissions',
    icon: 'solar:user-circle-bold-duotone',
    path: '/user',
    color: 'secondary',
  },
];
