import { SortDescriptor } from '@nextui-org/react';

// Reducer
import tableReducer from '../../../../../app/_private/lib/reducers/tableReducer';

// Types
import { TableType } from '../../../../../app/_private/types/lib/tableTypes';

// Mocks
import {
  mockSelectedColumns,
  mockSortDescriptor,
  setupTestEnvironment,
} from '../../../../mocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('Table Reducer', () => {
  const initialState: TableType = {
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

  describe('Table Configuration Updates', () => {
    it('should update selected key for column selection', () => {
      const action = { type: 'UPDATE_SELECTED_KEY', key: 'Options' } as const;
      const newState = tableReducer(initialState, action);

      expect(newState.selectedKey).toBe('Options');
      expect(newState).not.toBe(initialState);
    });

    it('should update sort descriptor for table ordering', () => {
      const newSortDescriptor: SortDescriptor = {
        column: 'date',
        direction: 'descending',
      };
      const action = { type: 'UPDATE_SORT_DESCRIPTOR', sortDescriptor: newSortDescriptor } as const;
      const newState = tableReducer(initialState, action);

      expect(newState.sortDescriptor).toBe(newSortDescriptor);
      expect(newState).not.toBe(initialState);
    });
  });

  describe('Table Filtering', () => {
    it('should update filter query for search functionality', () => {
      const action = { type: 'UPDATE_FILTER_QUERY', query: 'test query' } as const;
      const newState = tableReducer(initialState, action);

      expect(newState.filter.query).toBe('test query');
      expect(newState.filter).not.toBe(initialState.filter);
      expect(newState).not.toBe(initialState);
    });

    it('should update filter status for status-based filtering', () => {
      const newStatus = new Set(['completed', 'running']);
      const action = { type: 'UPDATE_FILTER_STATUS', status: newStatus } as const;
      const newState = tableReducer(initialState, action);

      expect(newState.filter.status).toBe(newStatus);
      expect(newState.filter).not.toBe(initialState.filter);
      expect(newState).not.toBe(initialState);
    });
  });

  describe('Table Pagination', () => {
    it('should update page rows for pagination size', () => {
      const action = { type: 'UPDATE_PAGE_ROWS', rows: 20 } as const;
      const newState = tableReducer(initialState, action);

      expect(newState.page.rows).toBe(20);
      expect(newState.page).not.toBe(initialState.page);
      expect(newState).not.toBe(initialState);
    });

    it('should update current page for pagination navigation', () => {
      const action = { type: 'UPDATE_PAGE_CURRENT', page: 2 } as const;
      const newState = tableReducer(initialState, action);

      expect(newState.page.current).toBe(2);
      expect(newState.page).not.toBe(initialState.page);
      expect(newState).not.toBe(initialState);
    });
  });
});
