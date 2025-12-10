import { useTranslation } from 'react-i18next';

import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useDeviceManagementNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.deviceManagement'),
      items: [
        {
          title: t('nav.iotDevice'),
          path: '/iot-devices',
          icon: icon('iot-device'),
        },
        {
          title: t('nav.iotSensor'),
          path: '/iot-sensors',
          icon: icon('iot-sensor'),
        },
      ],
    },
  ];
}
