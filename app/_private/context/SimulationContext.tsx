'use client';

import React, {
  createContext, useContext, useReducer, useEffect, useMemo,
} from 'react';

// Types
import { UseReducer } from '@/_private/types/lib/simulationTypes';

// Reducers
import simulationReducer from '@/_private/lib/reducers/simulationReducer';

// Actions
import simulationActionCreators from '@/_private/lib/actions/simulationActions';

// Context
const SimulationContext = createContext<UseReducer | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const simulationState: UseReducer = useReducer(simulationReducer, []);
  const contextValue = useMemo(() => simulationState, [simulationState[0]]);

  useEffect(() => { simulationActionCreators.readAllSimulations(simulationState[1]); }, []);

  return (
    <SimulationContext.Provider value={contextValue}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): UseReducer {
  const context = useContext(SimulationContext);

  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }

  return context;
}
