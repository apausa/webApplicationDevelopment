import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import CellContent from '../../../../../../../app/_private/components/dashboard/dashboardMain/content/CellContent';

// Mocks
import {
  mockSimulation1,
  setupTestEnvironment,
} from '../../../../../../mocks/dataMocks';

describe('CellContent Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders title correctly', () => {
    render(<CellContent simulation={mockSimulation1} columnKey="Title" />);
    expect(screen.getByText(mockSimulation1.form.title)).toBeInTheDocument();
  });

  it('renders subjobs number correctly', () => {
    render(<CellContent simulation={mockSimulation1} columnKey="Sub-jobs number" />);
    expect(screen.getByText(mockSimulation1.form.subjobs)).toBeInTheDocument();
  });

  it('renders local status correctly', () => {
    render(<CellContent simulation={mockSimulation1} columnKey="Local status" />);
    // eslint-disable-next-line max-len
    expect(screen.getByText(mockSimulation1.scripts.localRunWorkflow.scriptStatus)).toBeInTheDocument();
  });

  it('renders WLCG status correctly', () => {
    render(<CellContent simulation={mockSimulation1} columnKey="WLCG status" />);
    // eslint-disable-next-line max-len
    expect(screen.getByText(mockSimulation1.scripts.gridRunWorkflow.scriptStatus)).toBeInTheDocument();
  });

  it('renders creation date correctly', () => {
    render(<CellContent simulation={mockSimulation1} columnKey="Creation date" />);
    expect(screen.getByText(mockSimulation1.date)).toBeInTheDocument();
  });

  it('returns null for unknown column key', () => {
    const { container } = render(<CellContent simulation={mockSimulation1} columnKey="Unknown" />);
    expect(container.firstChild).toBeNull();
  });
});
