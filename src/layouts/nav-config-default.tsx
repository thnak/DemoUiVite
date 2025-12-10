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

export function useDefaultNavData(): NavData {
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
        {
          title: t('nav.blog'),
          path: '/blog',
          icon: icon('ic-blog'),
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
      {
        title: 'Blog',
        path: '/blog',
        icon: icon('ic-blog'),
      },
    ],
  },
];
