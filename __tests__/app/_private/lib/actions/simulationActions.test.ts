// Actions
import simulationActionCreators, {
  API_GRID_RUN_WORKFLOW,
  API_LOCAL_CREATE_WORKFLOW,
  API_LOCAL_RUN_WORKFLOW,
} from '../../../../../app/_private/lib/actions/simulationActions';

// Mocks
import {
  mockDispatch,
  mockForm,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../../mocks/dataMocks';

// Mock the fetch API
global.fetch = jest.fn();

beforeEach(() => {
  setupTestEnvironment();
});

describe('simulationActionCreators', () => {
  it('should create readAllSimulations action with data from localStorage', () => {
    const mockSimulations = [mockSimulation1, mockSimulation2];
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockSimulations));

    simulationActionCreators.readAllSimulations(mockDispatch);

    expect(localStorage.getItem).toHaveBeenCalledWith('simulations');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'READ_ALL_SIMULATIONS',
      simulations: mockSimulations,
    });
  });

  it('should create readAllSimulations action with empty array when localStorage is empty', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    simulationActionCreators.readAllSimulations(mockDispatch);

    expect(localStorage.getItem).toHaveBeenCalledWith('simulations');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'READ_ALL_SIMULATIONS',
      simulations: [],
    });
  });

  it('should create createSimulation action after API call', async () => {
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

  it('should not dispatch if createSimulation API returns null', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(null),
    });

    await simulationActionCreators.createSimulation(mockDispatch, mockForm);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/simulation',
      { method: 'POST', body: JSON.stringify(mockForm) },
    );
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should create deleteSimulation action after API call', async () => {
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

  it('should create updateSimulationScriptStatus action with Running status', () => {
    simulationActionCreators.updateSimulationScriptStatus(mockDispatch, mockSimulation1, 'localRunWorkflow');

    const expectedUpdatedSimulation = {
      ...mockSimulation1,
      scripts: {
        ...mockSimulation1.scripts,
        localRunWorkflow: { ...mockSimulation1.scripts.localRunWorkflow, scriptStatus: 'Running' },
      },
    };

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SIMULATION',
      simulation: expectedUpdatedSimulation,
    });
  });

  it('should run localRunWorkflow and update simulation', async () => {
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

  it('should run localCreateWorkflow and update simulation', async () => {
    const updatedSimulation = { ...mockSimulation1 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(updatedSimulation),
    });

    await simulationActionCreators.runSimulationScript(mockDispatch, mockSimulation1, 'localCreateWorkflow');

    expect(global.fetch).toHaveBeenCalledWith(
      API_LOCAL_CREATE_WORKFLOW,
      { method: 'PUT', body: JSON.stringify(mockSimulation1) },
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SIMULATION',
      simulation: updatedSimulation,
    });
  });

  it('should run gridRunWorkflow and update simulation', async () => {
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

  it('should handle invalid script type gracefully', async () => {
    const updatedSimulation = { ...mockSimulation1 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(updatedSimulation),
    });

    // @ts-expect-error - Testing invalid script type
    await simulationActionCreators.runSimulationScript(mockDispatch, mockSimulation1, 'invalidScript');

    expect(global.fetch).toHaveBeenCalledWith(
      '',
      { method: 'PUT', body: JSON.stringify(mockSimulation1) },
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SIMULATION',
      simulation: updatedSimulation,
    });
  });
});
