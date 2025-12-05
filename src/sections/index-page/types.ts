import type { IconifyName } from 'src/components/iconify/register-icons';

// ----------------------------------------------------------------------

export type ModuleItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconifyName;
  path: string;
  color: 'primary' | 'secondary';
};

export type ViewMode = 'grid' | 'list';
