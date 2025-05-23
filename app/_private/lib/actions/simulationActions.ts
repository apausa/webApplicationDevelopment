// Types
import { ApiGridRunWorkflow, ApiLocalRunWorkflow } from '@/_private/types/api';
import {
  Simulation,
  SimulationActionCreators,
} from '@/_private/types/lib/simulationTypes';

// Constants
export const API_GRID_RUN_WORKFLOW: ApiGridRunWorkflow = '/api/simulation/gridRunWorkflow';
export const API_LOCAL_RUN_WORKFLOW: ApiLocalRunWorkflow = '/api/simulation/localRunWorkflow';

const simulationActionCreators: SimulationActionCreators = {
  readAllSimulations: (dispatch) => {
    const response: string | null = localStorage.getItem('simulations');
    const simulations: Simulation[] | [] = (response) ? JSON.parse(response) : [];

    dispatch({ type: 'READ_ALL_SIMULATIONS', simulations });
  },

  createSimulation: async (dispatch, form) => {
    const response: Response = await fetch(
      '/api/simulation',
      { method: 'POST', body: JSON.stringify(form) },
    );
    const simulation: Simulation | null = await response.json();

    if (simulation) dispatch({ type: 'CREATE_SIMULATION', simulation });
  },

  deleteSimulation: async (dispatch, id) => {
    await fetch(
      '/api/simulation',
      { method: 'DELETE', body: JSON.stringify(id) },
    );

    dispatch({ type: 'DELETE_SIMULATION', id });
  },

  updateSimulation: (dispatch, simulation) => {
    dispatch({ type: 'UPDATE_SIMULATION', simulation });
  },

  runSimulationScript: async (dispatch, simulation, script) => {
    const unresolvedSimulation: Response = await fetch(
      (script === 'localRunWorkflow') ? API_LOCAL_RUN_WORKFLOW : API_GRID_RUN_WORKFLOW,
      { method: 'PUT', body: JSON.stringify(simulation) },
    );

    // @refactored —> Implemented global simulation context
    const resolvedSimulation: Simulation = await unresolvedSimulation.json();
    const handleUpdate = () => {
      dispatch({ type: 'UPDATE_SIMULATION', simulation: resolvedSimulation });
    };

    handleUpdate();
  },
};

export default simulationActionCreators;
