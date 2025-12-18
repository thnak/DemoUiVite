import type { ReactNode } from 'react';
import type { MachineEntity } from 'src/api/types/generated';

import { createContext, useCallback, useContext, useState } from 'react';

// ----------------------------------------------------------------------

interface MachineSelectorContextValue {
  selectedMachine: MachineEntity | null;
  setSelectedMachine: (machine: MachineEntity | null) => void;
}

const MachineSelectorContext = createContext<MachineSelectorContextValue | undefined>(undefined);

// ----------------------------------------------------------------------

interface MachineSelectorProviderProps {
  children: ReactNode;
}

export function MachineSelectorProvider({ children }: MachineSelectorProviderProps) {
  const [selectedMachine, setSelectedMachineState] = useState<MachineEntity | null>(null);

  const setSelectedMachine = useCallback((machine: MachineEntity | null) => {
    setSelectedMachineState(machine);
    // Optionally persist to localStorage
    if (machine) {
      localStorage.setItem('oi-selected-machine', JSON.stringify(machine));
    } else {
      localStorage.removeItem('oi-selected-machine');
    }
  }, []);

  return (
    <MachineSelectorContext.Provider value={{ selectedMachine, setSelectedMachine }}>
      {children}
    </MachineSelectorContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useMachineSelector() {
  const context = useContext(MachineSelectorContext);
  
  if (!context) {
    throw new Error('useMachineSelector must be used within MachineSelectorProvider');
  }
  
  return context;
}
