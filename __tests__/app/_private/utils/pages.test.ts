/* eslint-disable no-template-curly-in-string */

// Mocks
import {
  setupTestEnvironment,
  mockWorkflow,
  mockDate,
  mockDateForTime,
  TEST_VERSION,
  TEST_DATE_STRING,
  TEST_DATE_ISO,
} from '../../../mocks';

// Types
import type { CreateWorkflow, RunWorkflow } from '../../../../app/_private/types/lib/formTypes';

// Import the actual functions
import {
  getScript,
  getStatusColor,
  getSelectedVersion,
  getLatestVersion,
  formatCurrentDate,
  formatCurrentTime,
} from '../../../../app/_private/utils/pages';

describe('Pages Utils - Essential Functions', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  describe('getScript', () => {
    it('should generate script from workflow commands', () => {
      const result = getScript(mockWorkflow as CreateWorkflow);

      expect(result).toContain('test_command.py');
      expect(result).toContain('--arg1 value1');
    });

    it('should handle multiple workflows', () => {
      const workflow1 = {
        name: 'setup.py',
        args: [
          {
            name: '--config',
            value: 'prod',
            selected: true,
            description: 'Config',
            disabled: false,
            input: { type: 'string' },
          },
        ],
      };

      const workflow2 = {
        name: 'run.py',
        args: [
          {
            name: '--verbose',
            value: 'true',
            selected: true,
            description: 'Verbose',
            disabled: false,
            input: { type: 'string' },
          },
        ],
      };

      const result = getScript(workflow1 as CreateWorkflow, workflow2 as RunWorkflow);

      expect(result).toContain('setup.py --config prod');
      expect(result).toContain('run.py --verbose true');
      expect(result).toMatch(/setup\.py.*\n\n.*run\.py/);
    });
  });

  describe('getStatusColor', () => {
    it('should return correct colors for different statuses', () => {
      expect(getStatusColor('Running')).toBe('warning');
      expect(getStatusColor('Completed')).toBe('success');
      expect(getStatusColor('Error')).toBe('danger');
      expect(getStatusColor('Staged')).toBe('primary');
    });
  });

  describe('getSelectedVersion', () => {
    it('should convert date string to version format', () => {
      const result = getSelectedVersion(TEST_DATE_ISO);
      expect(result).toBe(TEST_VERSION);
    });
  });

  describe('getLatestVersion', () => {
    it('should return current date in YYYY-MM-DD format', () => {
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = getLatestVersion();
      expect(result).toBe(TEST_DATE_ISO);

      jest.restoreAllMocks();
    });
  });

  describe('formatCurrentDate', () => {
    it('should format date in DD/MM/YYYY format', () => {
      const testDate = new Date('2025-05-24T10:30:00Z');
      const result = formatCurrentDate(testDate);
      expect(result).toBe(TEST_DATE_STRING);
    });
  });

  describe('formatCurrentTime', () => {
    it('should format time in HH:MM format', () => {
      const result = formatCurrentTime(mockDateForTime);
      expect(result).toBe('14:30');
    });
  });
});
