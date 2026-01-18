import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useReportNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.reports'),
      items: [
        {
          title: t('nav.oeeSummaryReport'),
          path: '/report',
          icon: icon('ic-analytics'),
        },
        {
          title: t('nav.downtimeReport'),
          path: '/downtime-report',
          icon: icon('ic-disabled'),
        },
      ],
    },
  ];
}
