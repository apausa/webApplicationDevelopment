// Reducer
import simulationReducer from '../../../../../app/_private/lib/reducers/simulationReducer';

// Types
import { SimulationAction, Simulation } from '../../../../../app/_private/types/lib/simulationTypes';

// Mocks
import {
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../../mocks/dataMocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('simulationReducer', () => {
  it('should handle READ_ALL_SIMULATIONS action', () => {
    const currentState: Simulation[] = [];
    const action: SimulationAction = {
      type: 'READ_ALL_SIMULATIONS',
      simulations: [mockSimulation1, mockSimulation2],
    };

    const newState = simulationReducer(currentState, action);

    expect(newState).toEqual([mockSimulation1, mockSimulation2]);
    expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([mockSimulation1, mockSimulation2]));
  });

  it('should handle CREATE_SIMULATION action', () => {
    const currentState: Simulation[] = [mockSimulation1];
    const action: SimulationAction = {
      type: 'CREATE_SIMULATION',
      simulation: mockSimulation2,
    };

    const newState = simulationReducer(currentState, action);

    expect(newState).toEqual([mockSimulation2, mockSimulation1]);
    expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([mockSimulation2, mockSimulation1]));
  });

  it('should handle DELETE_SIMULATION action', () => {
    const currentState: Simulation[] = [mockSimulation1, mockSimulation2];
    const action: SimulationAction = {
      type: 'DELETE_SIMULATION',
      id: '1',
    };

    const newState = simulationReducer(currentState, action);

    expect(newState).toEqual([mockSimulation2]);
    expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([mockSimulation2]));
  });

  it('should handle UPDATE_SIMULATION action', () => {
    const currentState: Simulation[] = [mockSimulation1, mockSimulation2];
    const updatedSimulation: Simulation = {
      ...mockSimulation1,
      form: { ...mockSimulation1.form, title: 'Updated Title' },
    };

    const action: SimulationAction = {
      type: 'UPDATE_SIMULATION',
      simulation: updatedSimulation,
    };

    const newState = simulationReducer(currentState, action);

    expect(newState).toEqual([updatedSimulation, mockSimulation2]);
    expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([updatedSimulation, mockSimulation2]));
  });

  it('should return the original state for unknown action types', () => {
    const currentState: Simulation[] = [mockSimulation1, mockSimulation2];
    const action = { type: 'UNKNOWN_ACTION' } as any;

    const newState = simulationReducer(currentState, action);

    expect(newState).toBe(currentState);
    expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify(currentState));
  });
});
