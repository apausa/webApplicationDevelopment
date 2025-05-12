import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import TopContent from '../../../../../../../app/_private/components/dashboard/dashboardMain/content/TopContent';

// Actions
import tableActionCreators from '../../../../../../../app/_private/lib/actions/tableActions';

// Types
import { TableType } from '../../../../../../../app/_private/types/lib/tableTypes';

// Mocks
import {
  mockSelectedColumns,
  mockSortDescriptor,
  mockDispatch,
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,

} from '../../../../../../mocks/dataMocks';

// Mock table action creators
jest.mock('../../../../../../../app/_private/lib/actions/tableActions', () => ({
  updatePageRows: jest.fn(),
  updatePageCurrent: jest.fn(),
}));

describe('TopContent Component', () => {
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

  it('renders total jobs count correctly', () => {
    render(
      <TopContent
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    expect(screen.getByText('2 total jobs')).toBeInTheDocument();
  });

  it('renders jobs per page selector', () => {
    render(
      <TopContent
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    expect(screen.getByText('Jobs per page')).toBeInTheDocument();

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('calls updatePageRows and updatePageCurrent when select value changes', () => {
    render(
      <TopContent
        table={mockTable}
        dispatchTable={mockDispatch}
        allItems={mockItems}
      />,
    );

    const selectElement = screen.getByRole('combobox');

    // Change select value to 4
    fireEvent.change(selectElement, { target: { value: '4' } });

    expect(tableActionCreators.updatePageRows).toHaveBeenCalledWith(mockDispatch, 4);
    expect(tableActionCreators.updatePageCurrent).toHaveBeenCalledWith(mockDispatch, 1);
  });
});
