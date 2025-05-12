import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import DashboardFooter from '../../../../../app/_private/components/dashboard/DashboardFooter';

// Types
import { TableType } from '../../../../../app/_private/types/lib/tableTypes';
import {
  mockSelectedColumns,
  mockSortDescriptor,
  mockDispatch,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,

} from '../../../../mocks/dataMocks';

// Mock the action creators
jest.mock('../../../../../app/_private/lib/actions/tableActions', () => ({
  updatePageCurrent: jest.fn(),
}));

describe('DashboardFooter Component', () => {
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

  it('renders the footer with pagination', () => {
    render(
      <DashboardFooter
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('disables Back button on first page', () => {
    render(
      <DashboardFooter
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    const backButton = screen.getByText('Back').closest('button');
    expect(backButton).toHaveAttribute('disabled');
  });

  it('enables Next button when not on last page', () => {
    const manyItems = Array(20).fill(mockSimulation1);

    render(
      <DashboardFooter
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={manyItems}
      />,
    );

    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).not.toHaveAttribute('disabled');
  });

  it('calls updatePageCurrent when changing page', () => {
    const manyItems = Array(20).fill(mockSimulation1);

    render(
      <DashboardFooter
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={manyItems}
      />,
    );

    const paginationItem = screen.getByRole('navigation');
    fireEvent.click(paginationItem);

    expect(paginationItem).toBeInTheDocument();
  });

  it('disables Next button on last page', () => {
    const lastPageTable = {
      ...mockTable,
      page: {
        ...mockTable.page,
        current: 1,
        rows: 2,
      },
    };

    render(
      <DashboardFooter
        table={lastPageTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).toHaveAttribute('disabled');
  });
});
