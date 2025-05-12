// Actions
import tableActionCreators from '../../../../../app/_private/lib/actions/tableActions';

// Mocks
import {
  mockDispatch,
  mockSortDescriptor,
  setupTestEnvironment,
} from '../../../../mocks/dataMocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('tableActionCreators', () => {
  it('should create updateSelectedKey action', () => {
    const key = 'Title';
    tableActionCreators.updateSelectedKey(mockDispatch, key);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SELECTED_KEY',
      key,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should create updateSortDescriptor action', () => {
    tableActionCreators.updateSortDescriptor(mockDispatch, mockSortDescriptor);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SORT_DESCRIPTOR',
      sortDescriptor: mockSortDescriptor,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should create updateFilterQuery action', () => {
    const query = 'search query';
    tableActionCreators.updateFilterQuery(mockDispatch, query);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FILTER_QUERY',
      query,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should create updateFilterStatus action', () => {
    const status = new Set(['Running', 'Completed']);
    tableActionCreators.updateFilterStatus(mockDispatch, status);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FILTER_STATUS',
      status,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should create updatePageRows action', () => {
    const rows = 20;
    tableActionCreators.updatePageRows(mockDispatch, rows);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PAGE_ROWS',
      rows,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should create updatePageCurrent action', () => {
    const page = 2;
    tableActionCreators.updatePageCurrent(mockDispatch, page);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PAGE_CURRENT',
      page,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
