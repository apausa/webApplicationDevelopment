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

describe('Table Actions', () => {
  describe('Table Updates', () => {
    it('should update selected key for table columns', () => {
      const key = 'Title';
      tableActionCreators.updateSelectedKey(mockDispatch, key);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_SELECTED_KEY',
        key,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should update sort descriptor for table ordering', () => {
      tableActionCreators.updateSortDescriptor(mockDispatch, mockSortDescriptor);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_SORT_DESCRIPTOR',
        sortDescriptor: mockSortDescriptor,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Table Filtering', () => {
    it('should update filter query for search functionality', () => {
      const query = 'search query';
      tableActionCreators.updateFilterQuery(mockDispatch, query);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_FILTER_QUERY',
        query,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should update filter status for status-based filtering', () => {
      const status = new Set(['Running', 'Completed']);
      tableActionCreators.updateFilterStatus(mockDispatch, status);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_FILTER_STATUS',
        status,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Table Pagination', () => {
    it('should update page rows for pagination size', () => {
      const rows = 20;
      tableActionCreators.updatePageRows(mockDispatch, rows);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_PAGE_ROWS',
        rows,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should update current page for pagination navigation', () => {
      const page = 2;
      tableActionCreators.updatePageCurrent(mockDispatch, page);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_PAGE_CURRENT',
        page,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
