// Actions
import simulationActionCreators, {
  API_GRID_RUN_WORKFLOW,
  API_LOCAL_RUN_WORKFLOW,
} from '../../../../../app/_private/lib/actions/simulationActions';

// Mocks
import {
  mockDispatch,
  mockForm,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../../mocks';

// Types
import { Status } from '../../../../../app/_private/types/utils';

// Mock the fetch API
global.fetch = jest.fn();

beforeEach(() => {
  setupTestEnvironment();
});

describe('Simulation Actions', () => {
  describe('CRUD Operations', () => {
    it('should read all simulations from localStorage', () => {
      const mockSimulations = [mockSimulation1, mockSimulation2];
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockSimulations));

      simulationActionCreators.readAllSimulations(mockDispatch);

      expect(localStorage.getItem).toHaveBeenCalledWith('simulations');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'READ_ALL_SIMULATIONS',
        simulations: mockSimulations,
      });
    });

    it('should handle empty localStorage when reading simulations', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      simulationActionCreators.readAllSimulations(mockDispatch);

      expect(localStorage.getItem).toHaveBeenCalledWith('simulations');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'READ_ALL_SIMULATIONS',
        simulations: [],
      });
    });

    it('should create a new simulation via API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockSimulation1),
      });

      await simulationActionCreators.createSimulation(mockDispatch, mockForm);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/simulation',
        { method: 'POST', body: JSON.stringify(mockForm) },
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CREATE_SIMULATION',
        simulation: mockSimulation1,
      });
    });

    it('should delete a simulation via API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({});

      await simulationActionCreators.deleteSimulation(mockDispatch, '1');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/simulation',
        { method: 'DELETE', body: JSON.stringify('1') },
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'DELETE_SIMULATION',
        id: '1',
      });
    });

    it('should update an existing simulation', () => {
      const updatedSimulation = {
        ...mockSimulation1,
        scripts: {
          ...mockSimulation1.scripts,
          localRunWorkflow: { ...mockSimulation1.scripts.localRunWorkflow, scriptStatus: 'Running' as Status },
        },
      };

      simulationActionCreators.updateSimulation(mockDispatch, updatedSimulation);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_SIMULATION',
        simulation: updatedSimulation,
      });
    });
  });

  describe('Script Execution', () => {
    it('should execute local workflow and update simulation', async () => {
      const updatedSimulation = { ...mockSimulation1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(updatedSimulation),
      });

      await simulationActionCreators.runSimulationScript(mockDispatch, mockSimulation1, 'localRunWorkflow');

      expect(global.fetch).toHaveBeenCalledWith(
        API_LOCAL_RUN_WORKFLOW,
        { method: 'PUT', body: JSON.stringify(mockSimulation1) },
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_SIMULATION',
        simulation: updatedSimulation,
      });
    });

    it('should execute grid workflow and update simulation', async () => {
      const updatedSimulation = { ...mockSimulation1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(updatedSimulation),
      });

      await simulationActionCreators.runSimulationScript(mockDispatch, mockSimulation1, 'gridRunWorkflow');

      expect(global.fetch).toHaveBeenCalledWith(
        API_GRID_RUN_WORKFLOW,
        { method: 'PUT', body: JSON.stringify(mockSimulation1) },
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_SIMULATION',
        simulation: updatedSimulation,
      });
    });
  });
});
