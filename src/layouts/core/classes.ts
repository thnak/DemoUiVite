import { createClasses } from 'src/theme/create-classes';

// ----------------------------------------------------------------------

export const layoutClasses = {
  root: createClasses('layout__root'),
  main: createClasses('layout__main'),
  header: createClasses('layout__header'),
  footer: createClasses('layout__footer'),
  content: createClasses('layout__content'),
  hasSidebar: createClasses('layout__has-sidebar'),
  sidebarContainer: createClasses('layout__sidebar-container'),
};
