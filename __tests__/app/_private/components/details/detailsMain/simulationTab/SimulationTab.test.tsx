/* eslint-disable react/require-default-props */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import SimulationTab from '../../../../../../../app/_private/components/details/detailsMain/simulationTab/SimulationTab';

// Actions
import simulationActionCreators from '../../../../../../../app/_private/lib/actions/simulationActions';

// Mocks
import {
  mockDispatch,
  mockSimulation1,
  setupTestEnvironment,

} from '../../../../../../mocks/dataMocks';

// Mock Next.js Link component
jest.mock('next/link', () => function MockLink({ children, href }: { children: React.ReactNode, href: string }) {
  return (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  );
});

// Mock the output components
jest.mock(
  '../../../../../../../app/_private/components/details/detailsMain/simulationTab/outputs/StdoutData',
  () => function StdoutData({ stdoutData }: { stdoutData: string }) {
    return <div data-testid="stdout-data">{stdoutData}</div>;
  },
);

jest.mock(
  '../../../../../../../app/_private/components/details/detailsMain/simulationTab/outputs/StderrData',
  () => function StderrData({ stderrData }: { stderrData: string }) {
    return <div data-testid="stderr-data">{stderrData}</div>;
  },
);

// Mock simulation action creators
jest.mock('../../../../../../../app/_private/lib/actions/simulationActions', () => ({
  updateSimulationScriptStatus: jest.fn(),
  runSimulationScript: jest.fn(),
}));

// Mock some NextUI components
jest.mock('@nextui-org/react', () => ({
  Accordion: function MockAccordion({
    children,
    className,
  }: {
    children: React.ReactNode,
    className: string
  }) {
    return <div data-testid="accordion" className={className}>{children}</div>;
  },

  AccordionItem: function MockAccordionItem({
    children,
    title,
    isDisabled,
  }: {
    children: React.ReactNode,
    title: string,
    isDisabled: boolean
  }) {
    return (
      <div data-testid={`accordion-item-${title}`} data-disabled={isDisabled}>
        <div>{title}</div>
        {children}
      </div>
    );
  },

  Button: function MockButton({
    children,
    onClick,
    isDisabled,
    color,
    href,
  }: {
    children: React.ReactNode,
    onClick?: () => void,
    isDisabled?: boolean,
    color?: string,
    href?: string
  }) {
    return (
      <button
        data-testid="mock-button"
        onClick={onClick}
        disabled={isDisabled}
        data-color={color}
        data-href={href}
        type="button"
      >
        {children}
      </button>
    );
  },

  Input: function MockInput({
    value,
    label,
  }: {
    value: string,
    label: string
  }) {
    return <div data-testid={`input-${label}`}>{value}</div>;
  },

  Textarea: function MockTextarea({
    value,
    label,
  }: {
    value: string,
    label: string
  }) {
    return <div data-testid={`textarea-${label}`}>{value}</div>;
  },
}));

describe('SimulationTab Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the simulation tab with all fields', () => {
    render(
      <SimulationTab
        dispatchSimulation={mockDispatch}
        selectedSimulation={mockSimulation1}
        script="localRunWorkflow"
      />,
    );

    expect(screen.getByTestId('input-Status')).toBeInTheDocument();
    expect(screen.getByTestId('input-Status')).toHaveTextContent(mockSimulation1.scripts.localRunWorkflow.scriptStatus);

    expect(screen.getByText('Run script')).toBeInTheDocument();

    expect(screen.getByText('Open visualization')).toBeInTheDocument();

    expect(screen.getByTestId('input-Path')).toBeInTheDocument();
    expect(screen.getByTestId('input-Path')).toHaveTextContent(mockSimulation1.scripts.localRunWorkflow.scriptPath);

    expect(screen.getByTestId('textarea-Content')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-Content')).toHaveTextContent(mockSimulation1.scripts.localRunWorkflow.scriptBody);

    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item-Stdin output')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item-Stderr output')).toBeInTheDocument();
  });

  it('does not show visualization button for grid workflow', () => {
    render(
      <SimulationTab
        dispatchSimulation={mockDispatch}
        selectedSimulation={mockSimulation1}
        script="gridRunWorkflow"
      />,
    );

    expect(screen.queryByText('Open visualization')).not.toBeInTheDocument();
  });

  it('calls the appropriate actions when run script is clicked', () => {
    render(
      <SimulationTab
        dispatchSimulation={mockDispatch}
        selectedSimulation={mockSimulation1}
        script="localRunWorkflow"
      />,
    );

    const runButton = screen.getByText('Run script');
    fireEvent.click(runButton);

    expect(simulationActionCreators.updateSimulationScriptStatus)
      .toHaveBeenCalledWith(mockDispatch, mockSimulation1, 'localRunWorkflow');
    expect(simulationActionCreators.runSimulationScript)
      .toHaveBeenCalledWith(mockDispatch, mockSimulation1, 'localRunWorkflow');
  });
});
