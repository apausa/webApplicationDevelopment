import * as fs from 'node:fs/promises';
import path from 'node:path';

// Mocks
import {
  mockForm,
  setupTestEnvironment,
  mockNextRequest,
  TEST_UUID,
  TEST_SCRIPT_CONTENT,
  TEST_VERSION,
  TEST_DATE_STRING,
  TEST_TIME_STRING,
  TEST_PATH,
} from '../../../mocks';

// Import the actual handlers
import { POST, DELETE } from '../../../../app/api/simulation/route';

// Mock the external dependencies
jest.mock('node:fs/promises');
jest.mock('node:path');
jest.mock('uuid');
jest.mock('../../../../app/_private/utils/pages');
jest.mock('../../../../app/_private/utils/api');
jest.mock('uuid', () => ({ v4: jest.fn() }));

// Mock response
const mockLocalNextResponse = {
  json: jest.fn().mockImplementation((data) => global.Response.json(data)),
};

// Mock modules
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation(() => mockNextRequest),
  NextResponse: {
    json: mockLocalNextResponse.json,
  },
}));

// Mock implementations
const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

// Mock utils
jest.mock('../../../../app/_private/utils/pages', () => ({
  formatCurrentDate: jest.fn(),
  formatCurrentTime: jest.fn(),
  getScript: jest.fn(),
  getSelectedVersion: jest.fn(),
}));

jest.mock('../../../../app/_private/utils/api', () => ({
  getLocalBodyCommented: jest.fn(),
  getGridBodyOriginal: jest.fn(),
  getSegment: jest.fn(),
  createFile: jest.fn(),
}));

// Mock constants
jest.mock('../../../../app/_private/lib/constants/apiConstants', () => ({
  SCRIPTS_PATH: 'configuredMethods',
}));

const { v4: uuidv4 } = require('uuid');
const pagesUtils = require('../../../../app/_private/utils/pages');
const apiUtils = require('../../../../app/_private/utils/api');

describe('API Route: /api/simulation', () => {
  beforeEach(() => {
    setupTestEnvironment();
    jest.clearAllMocks();

    // Setup mocks
    uuidv4.mockReturnValue(TEST_UUID);
    pagesUtils.getScript.mockReturnValue(TEST_SCRIPT_CONTENT);
    pagesUtils.getSelectedVersion.mockReturnValue(TEST_VERSION);
    pagesUtils.formatCurrentDate.mockReturnValue(TEST_DATE_STRING);
    pagesUtils.formatCurrentTime.mockReturnValue(TEST_TIME_STRING);
    apiUtils.getSegment.mockReturnValue(TEST_PATH);
    apiUtils.getLocalBodyCommented.mockReturnValue('local body');
    apiUtils.getGridBodyOriginal.mockReturnValue('grid body');

    // Mock operations
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.chmod.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue(undefined);
    mockFs.access.mockResolvedValue(undefined);
    mockFs.rm.mockResolvedValue(undefined);

    mockPath.join.mockImplementation((...args: string[]) => args.join('/'));
  });

  describe('POST', () => {
    it('should create simulation successfully', async () => {
      const request = {
        json: jest.fn().mockResolvedValue(mockForm),
      } as unknown as Request;

      const response = await POST(request);

      expect(response).toBeDefined();
      expect(uuidv4).toHaveBeenCalled();
      expect(mockFs.mkdir).toHaveBeenCalled();
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should handle file system errors', async () => {
      const request = {
        json: jest.fn().mockResolvedValue(mockForm),
      } as unknown as Request;
      mockFs.mkdir.mockRejectedValue(new Error('File system error'));

      const response = await POST(request);

      expect(response).toBeDefined();
      expect(mockFs.mkdir).toHaveBeenCalled();
    });
  });

  describe('DELETE', () => {
    it('should delete simulation successfully', async () => {
      const request = {
        json: jest.fn().mockResolvedValue('test-id'),
      } as unknown as Request;

      const response = await DELETE(request);

      expect(response).toBeDefined();
      expect(mockFs.access).toHaveBeenCalled();
      expect(mockFs.rm).toHaveBeenCalled();
    });

    it('should handle non-existent directory', async () => {
      const request = {
        json: jest.fn().mockResolvedValue('non-existent-id'),
      } as unknown as Request;
      mockFs.access.mockRejectedValue(new Error('Not found'));

      const response = await DELETE(request);

      expect(response).toBeDefined();
    });
  });
});
