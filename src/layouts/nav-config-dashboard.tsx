import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export type NavGroup = {
  subheader: string;
  items: NavItem[];
};

export type NavData = NavGroup[];

export function useNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.dashboard'),
      items: [
        {
          title: t('nav.dashboardBuilder'),
          path: '/dashboard-builder',
          icon: icon('draw-two-tone'),
        },
        {
          title: t('nav.demoDashboard'),
          path: '/demo/dashboard',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.realtimeDashboard'),
          path: '/realtime-dashboard',
          icon: icon('ic-analytics'),
        },
        {
          title: t('nav.frontendGuide'),
          path: '/frontend-guide',
          icon: icon('ic-user'),
        },
      ],
    },
  ];
}

// Keep navData for backward compatibility (uses English as fallback)
export const navData: NavData = [
  {
    subheader: 'Dashboard',
    items: [
      {
        title: 'Dashboard Builder',
        path: '/dashboard-builder',
        icon: icon('draw-two-tone'),
      },
      {
        title: 'Demo Dashboard',
        path: '/demo/dashboard',
        icon: icon('ic-cart'),
      },
      {
        title: 'Real-Time Dashboard',
        path: '/realtime-dashboard',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Frontend Guide',
        path: '/frontend-guide',
        icon: icon('ic-user'),
      },
    ],
  },
];
