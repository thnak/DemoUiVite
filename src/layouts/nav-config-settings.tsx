import { useTranslation } from 'react-i18next';

import { Iconify } from 'src/components/iconify';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

export function useSettingsNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.settings'),
      items: [
        {
          title: t('nav.unitGroup'),
          path: '/settings/unit-groups',
          icon: <Iconify icon="solar:scale-bold-duotone" />,
        },
        {
          title: t('nav.unit'),
          path: '/settings/units',
          icon: <Iconify icon="solar:ruler-bold-duotone" />,
        },
        {
          title: t('nav.unitConversion'),
          path: '/settings/unit-conversions',
          icon: <Iconify icon="solar:restart-bold" />,
        },
        {
          title: t('nav.timeBlockName'),
          path: '/settings/time-block-names',
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          title: t('nav.keyValueStore'),
          path: '/settings/key-value-store',
          icon: <Iconify icon="solar:database-bold-duotone" />,
        },
      ],
    },
  ];
}
