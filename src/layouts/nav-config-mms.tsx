import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useMMSNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.mms'),
      items: [
        {
          title: t('nav.machineTracking'),
          path: '/machines',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.productionTracking'),
          path: '/downtime-report',
          icon: icon('ic-analytics'),
        },
        {
          title: t('nav.alertManagement'),
          path: '/stop-machine-reason',
          icon: icon('ic-disabled'),
        },
      ],
    },
  ];
}
