import { useTranslation } from 'react-i18next';

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
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.machineType'),
          path: '/machine-types',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.product'),
          path: '/products',
          icon: icon('ic-cart'),
        },
        {
          title: t('nav.productGroup'),
          path: '/product-groups',
          icon: icon('ic-cart'),
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
          icon: icon('ic-disabled'),
        },
        {
          title: t('nav.area'),
          path: '/area',
          icon: icon('space-two-tone'),
        },
        {
          title: t('nav.calendar'),
          path: '/calendars',
          icon: icon('ic-analytics'),
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
