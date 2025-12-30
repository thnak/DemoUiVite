import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useOINavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.oi'),
      items: [
        {
          title: t('nav.operatorDashboard'),
          path: '/oi/dashboard',
          icon: icon('ic-analytics'),
        },
        {
          title: t('nav.changeProduct'),
          path: '/oi/change-product',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.addDefect'),
          path: '/oi/defect-input',
          icon: icon('ic-disabled'),
        },
        {
          title: t('nav.downtimeInput'),
          path: '/oi/downtime-input',
          icon: icon('ic-clock'),
        },
      ],
    },
  ];
}
