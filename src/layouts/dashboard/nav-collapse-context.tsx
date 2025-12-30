import type { Dispatch, SetStateAction } from 'react';

import { useMemo, useState, useContext, createContext } from 'react';

// ----------------------------------------------------------------------

type NavCollapseContextValue = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

const NavCollapseContext = createContext<NavCollapseContextValue | undefined>(undefined);

export function NavCollapseProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const value = useMemo(() => ({ collapsed, setCollapsed }), [collapsed]);

  return <NavCollapseContext.Provider value={value}>{children}</NavCollapseContext.Provider>;
}

export function useNavCollapse() {
  const context = useContext(NavCollapseContext);

  if (!context) {
    throw new Error('useNavCollapse must be used within NavCollapseProvider');
  }

  return context;
}
