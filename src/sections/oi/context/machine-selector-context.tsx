import type { ReactNode } from 'react';
import type { MachineEntity } from 'src/api/types/generated';

import { useState, useEffect, useContext, useCallback, createContext } from 'react';

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

  // Restore selected machine from localStorage on mount
  useEffect(() => {
    const savedMachine = localStorage.getItem('oi-selected-machine');
    if (savedMachine) {
      try {
        const machine = JSON.parse(savedMachine) as MachineEntity;
        setSelectedMachineState(machine);
      } catch (error) {
        console.error('Failed to restore selected machine:', error);
        localStorage.removeItem('oi-selected-machine');
      }
    }
  }, []);

  const setSelectedMachine = useCallback((machine: MachineEntity | null) => {
    setSelectedMachineState(machine);
    // Persist to localStorage
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
