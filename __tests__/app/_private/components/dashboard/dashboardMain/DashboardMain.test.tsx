import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import DashboardMain from '../../../../../../app/_private/components/dashboard/dashboardMain/DashboardMain';

// Types
import { TableType } from '../../../../../../app/_private/types/lib/tableTypes';

// Mocks
import {
  mockSelectedColumns,
  mockSortDescriptor,
  mockDispatch,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
} from '../../../../../mocks/dataMocks';

// Mock NextJS Link component
jest.mock('next/link', () => function MockLink({ children, href }: { children: React.ReactNode, href: string }) {
  return (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  );
});

// Mock the actual modules imported in the component
jest.mock('../../../../../../app/_private/components/dashboard/dashboardMain/content/TopContent', () => function MockTopContent() {
  return <div data-testid="top-content">Top Content</div>;
});

// Mock the actual modules imported in the component
jest.mock('../../../../../../app/_private/components/dashboard/dashboardMain/content/CellContent', () => function MockCellContent({ simulation, columnKey }: any) {
  return <div data-testid={`cell-${columnKey}`}>{simulation.form.title}</div>;
});

// Mock table action creators
jest.mock('../../../../../../app/_private/lib/actions/tableActions', () => ({
  updateSortDescriptor: jest.fn(),
  updateSelectedKey: jest.fn(),
}));

describe('DashboardMain Component', () => {
  const mockTable: TableType = {
    selectedColumns: mockSelectedColumns,
    selectedKey: 'Title',
    filter: {
      query: '',
      status: new Set(['all']),
    },
    page: {
      rows: 10,
      current: 1,
    },
    sortDescriptor: mockSortDescriptor,
  };

  const mockItems = [mockSimulation1, mockSimulation2];

  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the table with headers', () => {
    render(
      <DashboardMain
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    mockSelectedColumns.forEach((column) => {
      expect(screen.getByText(column.key)).toBeInTheDocument();
    });

    expect(screen.getByTestId('top-content')).toBeInTheDocument();
  });

  it('renders empty state when no items', () => {
    render(
      <DashboardMain
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={[]}
      />,
    );

    expect(screen.getByText("Click on 'Configure' to create a simulation")).toBeInTheDocument();
  });

  it('renders links for each simulation in the table', () => {
    const { container } = render(
      <DashboardMain
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    const sim1TitleElements = screen.getAllByText(mockSimulation1.form.title);
    const sim2TitleElements = screen.getAllByText(mockSimulation2.form.title);

    expect(sim1TitleElements.length).toBeGreaterThan(0);
    expect(sim2TitleElements.length).toBeGreaterThan(0);

    expect(container).toBeInTheDocument();
  });
});
