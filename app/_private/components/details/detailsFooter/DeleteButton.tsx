import React, { useCallback } from 'react';

import { Button } from '@nextui-org/react';

// Actions
import simulationActionCreators from '@/_private/lib/actions/simulationActions';

// Types
import { Simulation } from '@/_private/types/lib/simulationTypes';

// Context
import { useSimulation } from '@/_private/context/SimulationContext';

export default function DeleteButton(
  {
    setDeleted, selectedSimulation,
  }: {
    setDeleted: React.Dispatch<React.SetStateAction<boolean>>
    selectedSimulation: Simulation,
  },
) {
  const [, dispatchSimulation] = useSimulation();

  const onDelete = useCallback((): void => {
    simulationActionCreators.deleteSimulation(dispatchSimulation, selectedSimulation.id);
    setDeleted(true);
  }, [selectedSimulation]);

  return (
    <Button
      onClick={onDelete}
      variant="light"
      color="danger"
    >
      Delete
    </Button>
  );
}
