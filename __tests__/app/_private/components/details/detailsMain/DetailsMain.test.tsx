import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import DetailsMain from '../../../../../../app/_private/components/details/detailsMain/DetailsMain';

// Mocks
import {
  mockDispatch,
  mockSimulation1,
  setupTestEnvironment,

} from '../../../../../mocks/dataMocks';

// Mock the SimulationTab component
jest.mock(
  '../../../../../../app/_private/components/details/detailsMain/simulationTab/SimulationTab',
  () => function MockSimulationTab({ script }: { script: string }) {
    return (
      <div data-testid={`simulation-tab-${script}`}>
        Simulation Tab for
        {' '}
        {script}
      </div>
    );
  },
);

// Mock NextUI Tab component
jest.mock('@nextui-org/react', () => ({
  Tab: function MockTab({
    children,
    title,
  }: {
    children: React.ReactNode,
    title: string
  }) {
    return (
      <div data-testid={`tab-${title}`}>
        <div>
          Tab:
          {title}
        </div>
        {children}
      </div>
    );
  },

  Tabs: function MockTabs({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <div data-testid="tabs-container">{children}</div>;
  },
}));

describe('DetailsMain Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the tabs', () => {
    render(
      <DetailsMain
        selectedSimulation={mockSimulation1}
        dispatchSimulation={mockDispatch}
      />,
    );

    expect(screen.getByTestId('tabs-container')).toBeInTheDocument();
    expect(screen.getByTestId('tab-Local run')).toBeInTheDocument();
    expect(screen.getByTestId('tab-WLCG run')).toBeInTheDocument();
  });

  it('renders simulation tabs with correct props', () => {
    render(
      <DetailsMain
        selectedSimulation={mockSimulation1}
        dispatchSimulation={mockDispatch}
      />,
    );

    expect(screen.getByTestId('simulation-tab-localRunWorkflow')).toBeInTheDocument();
    expect(screen.getByTestId('simulation-tab-gridRunWorkflow')).toBeInTheDocument();

    expect(screen.getByText('Simulation Tab for localRunWorkflow')).toBeInTheDocument();
    expect(screen.getByText('Simulation Tab for gridRunWorkflow')).toBeInTheDocument();
  });
});
