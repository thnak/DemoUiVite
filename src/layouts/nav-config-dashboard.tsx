import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export type NavGroup = {
  subheader: string;
  items: NavItem[];
};

export type NavData = NavGroup[];

export const navData: NavData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: icon('ic-analytics'),
      },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'User',
        path: '/user',
        icon: icon('ic-user'),
      },
      {
        title: 'Product',
        path: '/products',
        icon: icon('ic-cart'),
        info: (
          <Label color="error" variant="inverted">
            +3
          </Label>
        ),
      },
      {
        title: 'Machine',
        path: '/machines',
        icon: icon('ic-cart'),
      },
      {
        title: 'Blog',
        path: '/blog',
        icon: icon('ic-blog'),
      },
    ],
  },
  {
    subheader: 'Other',
    items: [
      {
        title: 'Sign in',
        path: '/sign-in',
        icon: icon('ic-lock'),
      },
      {
        title: 'Not found',
        path: '/404',
        icon: icon('ic-disabled'),
      },
    ],
  },
];
