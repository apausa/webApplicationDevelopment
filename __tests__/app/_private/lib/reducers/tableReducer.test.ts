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
} from '../../../../mocks/dataMocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('tableReducer', () => {
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

  it('should update selected key', () => {
    const action = { type: 'UPDATE_SELECTED_KEY', key: 'Options' } as const;
    const newState = tableReducer(initialState, action);

    expect(newState.selectedKey).toBe('Options');
    expect(newState).not.toBe(initialState);
  });

  it('should update sort descriptor', () => {
    const newSortDescriptor: SortDescriptor = {
      column: 'date',
      direction: 'descending',
    };
    const action = { type: 'UPDATE_SORT_DESCRIPTOR', sortDescriptor: newSortDescriptor } as const;
    const newState = tableReducer(initialState, action);

    expect(newState.sortDescriptor).toBe(newSortDescriptor);
    expect(newState).not.toBe(initialState);
  });

  it('should update filter query', () => {
    const action = { type: 'UPDATE_FILTER_QUERY', query: 'test query' } as const;
    const newState = tableReducer(initialState, action);

    expect(newState.filter.query).toBe('test query');
    expect(newState.filter).not.toBe(initialState.filter);
    expect(newState).not.toBe(initialState);
  });

  it('should update filter status', () => {
    const newStatus = new Set(['completed', 'running']);
    const action = { type: 'UPDATE_FILTER_STATUS', status: newStatus } as const;
    const newState = tableReducer(initialState, action);

    expect(newState.filter.status).toBe(newStatus);
    expect(newState.filter).not.toBe(initialState.filter);
    expect(newState).not.toBe(initialState);
  });

  it('should update page rows', () => {
    const action = { type: 'UPDATE_PAGE_ROWS', rows: 20 } as const;
    const newState = tableReducer(initialState, action);

    expect(newState.page.rows).toBe(20);
    expect(newState.page).not.toBe(initialState.page);
    expect(newState).not.toBe(initialState);
  });

  it('should update page current', () => {
    const action = { type: 'UPDATE_PAGE_CURRENT', page: 2 } as const;
    const newState = tableReducer(initialState, action);

    expect(newState.page.current).toBe(2);
    expect(newState.page).not.toBe(initialState.page);
    expect(newState).not.toBe(initialState);
  });

  it('should return the original state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;
    const newState = tableReducer(initialState, action);

    expect(newState).toBe(initialState);
  });
});
