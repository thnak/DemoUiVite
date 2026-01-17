import { useTranslation } from 'react-i18next';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

import type { NavData } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export function useMasterDataNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.masterData'),
      items: [
        {
          title: t('nav.machine'),
          path: '/machines',
          icon: <Iconify icon="solar:factory-bold-duotone" />,
        },
        {
          title: t('nav.machineType'),
          path: '/machine-types',
          icon: <Iconify icon="solar:cpu-bolt-bold-duotone" />,
        },
        {
          title: t('nav.product'),
          path: '/products',
          icon: <Iconify icon="solar:cart-3-bold" />,
        },
        {
          title: t('nav.productCategory'),
          path: '/product-categories',
          icon: <Iconify icon="solar:grid-bold-duotone" />,
        },
        {
          title: t('nav.workingParameter'),
          path: '/working-parameter',
          icon: icon('medical-info-two-tone'),
        },
        {
          title: t('nav.defectReason'),
          path: '/defect-reasons',
          icon: icon('defect'),
        },
        {
          title: t('nav.defectReasonGroup'),
          path: '/defect-reason-group',
          icon: icon('defect-group'),
        },
        {
          title: t('nav.stopMachineReason'),
          path: '/stop-machine-reason',
          icon: <Iconify icon="solar:danger-triangle-bold-duotone" />,
        },
        {
          title: t('nav.stopMachineReasonGroup'),
          path: '/stop-machine-reason-group',
          icon: <Iconify icon="solar:list-bold-duotone" />,
        },
        {
          title: t('nav.area'),
          path: '/area',
          icon: icon('space-two-tone'),
        },
        {
          title: t('nav.calendar'),
          path: '/calendars',
          icon: <Iconify icon="solar:calendar-mark-bold" />,
        },
        {
          title: t('nav.shiftTemplate'),
          path: '/shift-templates',
          icon: icon('shift-templates'),
        },
      ],
    },
  ];
}
