import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

// Using relative paths that Jest can properly resolve
import { SimulationProvider, useSimulation } from '../../../../app/_private/context/SimulationContext';
import simulationReducer from '../../../../app/_private/lib/reducers/simulationReducer';
import simulationActionCreators from '../../../../app/_private/lib/actions/simulationActions';

import {
  mockDispatch,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../mocks/dataMocks';

// Mock the dependencies
jest.mock('../../../../app/_private/lib/reducers/simulationReducer');
jest.mock('../../../../app/_private/lib/actions/simulationActions');

// Mock React hooks
const mockUseReducer = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useReducer: (...args: any[]) => mockUseReducer(...args),
}));

// Test component that uses the context
function TestComponent() {
  const [simulations, dispatch] = useSimulation();

  return (
    <div>
      <div data-testid="simulation-count">{simulations.length}</div>
      <div data-testid="dispatch-available">{typeof dispatch === 'function' ? 'true' : 'false'}</div>
      {simulations.map((sim: any) => (
        <div key={sim.id} data-testid={`simulation-${sim.id}`}>
          {sim.form.title}
        </div>
      ))}
    </div>
  );
}

// Test component without provider to test error handling
function TestComponentWithoutProvider() {
  const simulation = useSimulation();
  return <div data-testid="error">{String(simulation)}</div>;
}

describe('SimulationContext', () => {
  beforeEach(() => {
    setupTestEnvironment();

    // Reset mocks
    jest.clearAllMocks();
    mockUseReducer.mockImplementation(() => [[mockSimulation1, mockSimulation2], mockDispatch]);

    // Mock the action creators
    (simulationActionCreators.readAllSimulations as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SimulationProvider', () => {
    it('should render children and provide context value', () => {
      render(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      expect(screen.getByTestId('simulation-count')).toHaveTextContent('2');
      expect(screen.getByTestId('dispatch-available')).toHaveTextContent('true');
      expect(screen.getByTestId('simulation-1')).toHaveTextContent('Test Form');
      expect(screen.getByTestId('simulation-2')).toHaveTextContent('Another Test');
    });

    it('should initialize with empty state and call reducer correctly', () => {
      mockUseReducer.mockImplementation((reducer, initialState) => {
        expect(reducer).toBe(simulationReducer);
        expect(initialState).toEqual([]);
        return [[], mockDispatch];
      });

      render(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      expect(mockUseReducer).toHaveBeenCalledWith(simulationReducer, []);
    });

    it('should call readAllSimulations action on mount', async () => {
      render(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      await waitFor(() => {
        expect(simulationActionCreators.readAllSimulations).toHaveBeenCalledWith(mockDispatch);
      });
    });

    it('should re-render when simulations state changes', () => {
      const { rerender } = render(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      expect(screen.getByTestId('simulation-count')).toHaveTextContent('2');

      // Change the mock to return different state
      mockUseReducer.mockImplementation(() => [[mockSimulation1], mockDispatch]);

      rerender(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      expect(screen.getByTestId('simulation-count')).toHaveTextContent('1');
    });
  });

  describe('useSimulation hook', () => {
    it('should return simulation state and dispatch when used within provider', () => {
      render(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      expect(screen.getByTestId('simulation-count')).toHaveTextContent('2');
      expect(screen.getByTestId('dispatch-available')).toHaveTextContent('true');
    });

    it('should throw error when used outside of provider', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useSimulation must be used within a SimulationProvider');

      consoleSpy.mockRestore();
    });

    it('should return correct useReducer tuple format', () => {
      let contextValue: any;

      function TestHookComponent() {
        contextValue = useSimulation();
        return <div>Test</div>;
      }

      render(
        <SimulationProvider>
          <TestHookComponent />
        </SimulationProvider>,
      );

      expect(Array.isArray(contextValue)).toBe(true);
      expect(contextValue).toHaveLength(2);
      expect(Array.isArray(contextValue[0])).toBe(true);
      expect(typeof contextValue[1]).toBe('function');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete provider lifecycle with actions', async () => {
      render(
        <SimulationProvider>
          <TestComponent />
        </SimulationProvider>,
      );

      // Verify initial render
      expect(screen.getByTestId('simulation-count')).toHaveTextContent('2');
      expect(screen.getByTestId('dispatch-available')).toHaveTextContent('true');

      // Verify action was called
      await waitFor(() => {
        expect(simulationActionCreators.readAllSimulations).toHaveBeenCalledWith(mockDispatch);
      });

      // Verify reducer was initialized correctly
      expect(mockUseReducer).toHaveBeenCalledWith(simulationReducer, []);
    });
  });
});
