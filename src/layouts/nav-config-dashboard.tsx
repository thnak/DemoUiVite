import { useTranslation } from 'react-i18next';

import { Label } from 'src/components/label';
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
      subheader: t('nav.overview'),
      items: [
        {
          title: t('nav.dashboard'),
          path: '/',
          icon: icon('ic-analytics'),
        },
        {
          title: 'Demo Dashboard',
          path: '/demo/dashboard',
          icon: icon('ic-cart'),
        },
        {
          title: 'Dashboard Builder',
          path: '/dashboard-builder',
          icon: icon('draw-two-tone'),
        },
      ],
    },
    {
      subheader: t('nav.management'),
      items: [
        {
          title: t('nav.user'),
          path: '/user',
          icon: icon('ic-user'),
        },
        {
          title: t('nav.area'),
          path: '/area',
          icon: icon('space-two-tone'),
        },
        {
          title: t('nav.product'),
          path: '/products',
          icon: icon('ic-cart'),
          info: (
            <Label color="error" variant="inverted">
              +3
            </Label>
          ),
        },
        {
          title: t('nav.workingParameter'),
          path: '/working-parameter',
          icon: icon('medical-info-two-tone'),
        },
        {
          title: t('nav.stopMachineReason'),
          path: '/stop-machine-reason',
          icon: icon('ic-disabled'),
        },
        {
          title: t('nav.productGroup'),
          path: '/product-groups',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.machine'),
          path: '/machines',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.downtimeReport'),
          path: '/downtime-report',
          icon: icon('ic-analytics'),
        },
        {
          title: 'shift template',
          path: '/shift-templates',
          icon: icon('shift-templates'),
        },
        {
          title: 'calendar',
          path: '/calendars',
          icon: icon('ic-analytics'),
        },
        {
          title: 'defect reason',
          path: '/defect-reasons',
          icon: icon('defect-reasons'),
        },
        {
          title: 'defect reason group',
          path: '/defect-reason-group',
          icon: icon('defect-reason-group'),
        },
        {
          title: 'IoT Devices',
          path: '/iot-devices',
          icon: icon('ic-analytics'),
        },
        {
          title: t('nav.blog'),
          path: '/blog',
          icon: icon('ic-blog'),
        },
      ],
    },
    {
      subheader: t('nav.other'),
      items: [
        {
          title: t('nav.signIn'),
          path: '/sign-in',
          icon: icon('ic-lock'),
        },
        {
          title: t('nav.notFound'),
          path: '/404',
          icon: icon('ic-disabled'),
        },
      ],
    },
  ];
}

// Keep navData for backward compatibility (uses English as fallback)
export const navData: NavData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Demo Dashboard',
        path: '/demo/dashboard',
        icon: icon('ic-cart'),
      },
      {
        title: 'Dashboard Builder',
        path: '/dashboard-builder',
        icon: icon('draw-two-tone'),
      },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'User',
        path: '/user',
        icon: icon('ic-user'),
      },
      {
        title: 'Area',
        path: '/area',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Product',
        path: '/products',
        icon: icon('ic-cart'),
        info: (
          <Label color="error" variant="inverted">
            +3
          </Label>
        ),
      },
      {
        title: 'Working Parameter',
        path: '/working-parameter',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Stop Machine Reason',
        path: '/stop-machine-reason',
        icon: icon('ic-disabled'),
      },
      {
        title: 'Product Group',
        path: '/product-groups',
        icon: icon('ic-cart'),
      },
      {
        title: 'Machine',
        path: '/machines',
        icon: icon('ic-cart'),
      },
      {
        title: 'Downtime Report',
        path: '/downtime-report',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Blog',
        path: '/blog',
        icon: icon('ic-blog'),
      },
    ],
  },
  {
    subheader: 'Other',
    items: [
      {
        title: 'Sign in',
        path: '/sign-in',
        icon: icon('ic-lock'),
      },
      {
        title: 'Not found',
        path: '/404',
        icon: icon('ic-disabled'),
      },
    ],
  },
];
