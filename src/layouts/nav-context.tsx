import type { ReactNode } from 'react';

import { useMemo, useContext, createContext } from 'react';

import { usePathname } from 'src/routes/hooks';

import { useOINavData } from './nav-config-oi';
import { useMMSNavData } from './nav-config-mms';
import { useNavData } from './nav-config-dashboard';
import { useDefaultNavData } from './nav-config-default';
import { useSettingsNavData } from './nav-config-settings';
import { useMasterDataNavData } from './nav-config-master-data';
import { useUserManagementNavData } from './nav-config-user-management';
import { useDeviceManagementNavData } from './nav-config-device-management';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

type NavModule =
  | 'default'
  | 'master-data'
  | 'user-management'
  | 'device-management'
  | 'dashboard'
  | 'mms'
  | 'oi'
  | 'settings';

type NavContextValue = {
  navData: NavData;
  currentModule: NavModule;
};

const NavContext = createContext<NavContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

// Route to module mapping
const getModuleFromPath = (pathname: string): NavModule => {
  // Dashboard module routes
  if (pathname.startsWith('/dashboard-builder') || pathname.startsWith('/demo/dashboard')) {
    return 'dashboard';
  }

  // Master Data module routes
  if (
    pathname.startsWith('/products') ||
    pathname.startsWith('/product-categories') ||
    pathname.startsWith('/machines') ||
    pathname.startsWith('/machine-types') ||
    pathname.startsWith('/working-parameter') ||
    pathname.startsWith('/defect-reasons') ||
    pathname.startsWith('/defect-reason-group') ||
    pathname.startsWith('/stop-machine-reason') ||
    pathname.startsWith('/area') ||
    pathname.startsWith('/calendars') ||
    pathname.startsWith('/shift-templates')
  ) {
    return 'master-data';
  }

  // User Management module routes
  if (
    pathname.startsWith('/user') ||
    pathname.startsWith('/roles') ||
    pathname.startsWith('/permissions')
  ) {
    return 'user-management';
  }

  // Device Management module routes
  if (pathname.startsWith('/iot-devices') || pathname.startsWith('/iot-sensors')) {
    return 'device-management';
  }

  // MMS (Machine Monitoring System) module routes
  if (
    pathname.startsWith('/downtime-report') ||
    pathname.startsWith('/machine-tracking') ||
    pathname.startsWith('/production-tracking') ||
    pathname.startsWith('/alert-management')
  ) {
    return 'mms';
  }

  // OI (Operation Interface) module routes
  if (pathname.startsWith('/oi')) {
    return 'oi';
  }

  // Settings module routes
  if (
    pathname.startsWith('/settings')
  ) {
    return 'settings';
  }

  // Default for other routes
  return 'default';
};

// ----------------------------------------------------------------------

type NavProviderProps = {
  children: ReactNode;
};

export function NavProvider({ children }: NavProviderProps) {
  const pathname = usePathname();
  const currentModule = getModuleFromPath(pathname);

  // Get nav data based on current module
  const defaultNavData = useDefaultNavData();
  const masterDataNavData = useMasterDataNavData();
  const userManagementNavData = useUserManagementNavData();
  const deviceManagementNavData = useDeviceManagementNavData();
  const dashboardNavData = useNavData();
  const mmsNavData = useMMSNavData();
  const oiNavData = useOINavData();
  const settingsNavData = useSettingsNavData();

  const navData = useMemo(() => {
    switch (currentModule) {
      case 'master-data':
        return masterDataNavData;
      case 'user-management':
        return userManagementNavData;
      case 'device-management':
        return deviceManagementNavData;
      case 'dashboard':
        return dashboardNavData;
      case 'mms':
        return mmsNavData;
      case 'oi':
        return oiNavData;
      case 'settings':
        return settingsNavData;
      default:
        return defaultNavData;
    }
  }, [
    currentModule,
    defaultNavData,
    masterDataNavData,
    userManagementNavData,
    deviceManagementNavData,
    dashboardNavData,
    mmsNavData,
    oiNavData,
    settingsNavData,
  ]);

  const value = useMemo(
    () => ({
      navData,
      currentModule,
    }),
    [navData, currentModule]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavContextValue {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error('useNav must be used within NavProvider');
  }

  return context;
}
