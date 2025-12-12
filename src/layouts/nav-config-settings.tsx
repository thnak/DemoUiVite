import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useSettingsNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.settings'),
      items: [
        {
          title: t('nav.unitGroup'),
          path: '/settings/unit-groups',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.unit'),
          path: '/settings/units',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.unitConversion'),
          path: '/settings/unit-conversions',
          icon: icon('ic-cart'),
        },
      ],
    },
  ];
}
