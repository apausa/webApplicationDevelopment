import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import DashboardHeader from '../../../../../app/_private/components/dashboard/DashboardHeader';

// Actions
import tableActionCreators from '../../../../../app/_private/lib/actions/tableActions';

// Types
import { TableType } from '../../../../../app/_private/types/lib/tableTypes';

// Mocks
import {
  mockSelectedColumns,
  mockSortDescriptor,
  mockDispatch,
  setupTestEnvironment,
} from '../../../../mocks/dataMocks';

// Mock table action creators
jest.mock('../../../../../app/_private/lib/actions/tableActions', () => ({
  updateFilterQuery: jest.fn(),
  updatePageCurrent: jest.fn(),
  updateFilterStatus: jest.fn(),
}));

describe('DashboardHeader Component', () => {
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

  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the header with title and buttons', () => {
    render(<DashboardHeader table={mockTable} dispatchTable={mockDispatch} />);

    expect(screen.getByText('Monte Carlo Simulations Dashboard')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search name')).toBeInTheDocument();
    expect(screen.getByText('Filter status')).toBeInTheDocument();
    expect(screen.getByText('Configure')).toBeInTheDocument();
  });

  it('calls correct actions when search input changes', () => {
    render(<DashboardHeader table={mockTable} dispatchTable={mockDispatch} />);

    const searchInput = screen.getByPlaceholderText('Search name');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    expect(tableActionCreators.updateFilterQuery).toHaveBeenCalledWith(mockDispatch, 'test query');
    expect(tableActionCreators.updatePageCurrent).toHaveBeenCalledWith(mockDispatch, 1);
  });

  it('clears search when clear button is clicked', () => {
    const tableWithQuery = {
      ...mockTable,
      filter: {
        ...mockTable.filter,
        query: 'existing query',
      },
    };

    render(<DashboardHeader table={tableWithQuery} dispatchTable={mockDispatch} />);

    const searchInput = screen.getByPlaceholderText('Search name');

    fireEvent.input(searchInput, { target: { value: '' } });

    expect(tableActionCreators.updateFilterQuery).toHaveBeenCalledWith(mockDispatch, '');
    expect(tableActionCreators.updatePageCurrent).toHaveBeenCalledWith(mockDispatch, 1);
  });
});
