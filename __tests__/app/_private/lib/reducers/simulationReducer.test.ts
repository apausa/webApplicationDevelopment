// Reducer
import simulationReducer from '../../../../../app/_private/lib/reducers/simulationReducer';

// Types
import { SimulationAction, Simulation } from '../../../../../app/_private/types/lib/simulationTypes';

// Mocks
import {
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../../mocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('Simulation Reducer', () => {
  describe('Reading Simulations', () => {
    it('should handle reading all simulations from storage', () => {
      const currentState: Simulation[] = [];
      const action: SimulationAction = {
        type: 'READ_ALL_SIMULATIONS',
        simulations: [mockSimulation1, mockSimulation2],
      };

      const newState = simulationReducer(currentState, action);

      expect(newState).toEqual([mockSimulation1, mockSimulation2]);
      expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([mockSimulation1, mockSimulation2]));
    });
  });

  describe('Creating Simulations', () => {
    it('should handle creating a new simulation (prepended to list)', () => {
      const currentState: Simulation[] = [mockSimulation1];
      const action: SimulationAction = {
        type: 'CREATE_SIMULATION',
        simulation: mockSimulation2,
      };

      const newState = simulationReducer(currentState, action);

      expect(newState).toEqual([mockSimulation2, mockSimulation1]);
      expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([mockSimulation2, mockSimulation1]));
    });
  });

  describe('Deleting Simulations', () => {
    it('should handle deleting a simulation by ID', () => {
      const currentState: Simulation[] = [mockSimulation1, mockSimulation2];
      const action: SimulationAction = {
        type: 'DELETE_SIMULATION',
        id: '1',
      };

      const newState = simulationReducer(currentState, action);

      expect(newState).toEqual([mockSimulation2]);
      expect(localStorage.setItem).toHaveBeenCalledWith('simulations', JSON.stringify([mockSimulation2]));
    });
  });

  describe('Updating Simulations', () => {
    it('should handle updating an existing simulation', () => {
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
  });
});
