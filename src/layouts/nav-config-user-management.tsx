import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useUserManagementNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.userManagement'),
      items: [
        {
          title: t('nav.user'),
          path: '/user',
          icon: icon('ic-user'),
        },
        {
          title: t('nav.role'),
          path: '/roles',
          icon: icon('ic-user'),
        },
        {
          title: t('nav.permission'),
          path: '/permissions',
          icon: icon('ic-lock'),
        },
      ],
    },
  ];
}
