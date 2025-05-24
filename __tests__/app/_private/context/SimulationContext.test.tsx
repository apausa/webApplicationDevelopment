import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the actual context
import { SimulationProvider, useSimulation } from '../../../../app/_private/context/SimulationContext';

// Reducer
import simulationReducer from '../../../../app/_private/lib/reducers/simulationReducer';

// Actions
import simulationActionCreators from '../../../../app/_private/lib/actions/simulationActions';

// Mocks
import {
  mockDispatch,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../mocks';

// Mock dependencies
jest.mock('../../../../app/_private/lib/reducers/simulationReducer');
jest.mock('../../../../app/_private/lib/actions/simulationActions');

// Mock hooks
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
});
