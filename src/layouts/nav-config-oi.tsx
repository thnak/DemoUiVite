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
          path: '/oi/select-machine',
          icon: icon('ic-analytics'),
        },
      ],
    },
  ];
}
