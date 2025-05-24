import * as fs from 'node:fs/promises';
import path from 'node:path';

// Mocks
import { setupTestEnvironment, mockApiScript, TEST_VERSION } from '../../../mocks';

// Import the actual functions
import {
  getSegment,
  readFile,
  createFile,
  getLocalArgs,
  getGridBodyOriginal,
  getLocalBodyCommented,
} from '../../../../app/_private/utils/api';

// Mock the external dependencies
jest.mock('node:fs/promises');
jest.mock('node:path');

// Mock implementations
const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('API Utils', () => {
  beforeEach(() => {
    setupTestEnvironment();

    jest.clearAllMocks();

    mockPath.join.mockImplementation((...paths: string[]) => paths.join('/'));
    mockFs.readFile.mockResolvedValue('mock file content');
    mockFs.access.mockResolvedValue(undefined);
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.chmod.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSegment', () => {
    it('should join two path segments correctly', () => {
      const result = getSegment('path1', 'path2');

      expect(mockPath.join).toHaveBeenCalledWith('path1', 'path2');
      expect(result).toBe('path1/path2');
    });
  });

  describe('readFile', () => {
    it('should read file with utf-8 encoding', async () => {
      const filePath = '/test/path/file.txt';
      mockFs.readFile.mockResolvedValue('file content');

      const result = await readFile(filePath);

      expect(mockFs.readFile).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
      expect(result).toBe('file content');
    });
  });

  describe('createFile', () => {
    it('should create directory and file when needed', async () => {
      const segment = '/test/directory';

      await createFile(segment, mockApiScript);

      expect(mockFs.access).toHaveBeenCalledWith(segment);
      // eslint-disable-next-line max-len
      expect(mockFs.writeFile).toHaveBeenCalledWith(mockApiScript.scriptPath, mockApiScript.scriptBody);
      expect(mockFs.chmod).toHaveBeenCalledWith(mockApiScript.scriptPath, '755');
    });
  });

  describe('getLocalArgs', () => {
    it('should return correct arguments array for local execution', () => {
      const segment = '/test/segment';
      const scriptPath = '/test/script.sh';

      const result = getLocalArgs(segment, scriptPath);

      expect(result).toEqual(['/bin/bash', scriptPath]);
    });
  });

  describe('getGridBodyOriginal', () => {
    it('should generate correct grid script content', () => {
      const script = 'python test_script.py';

      const result = getGridBodyOriginal(TEST_VERSION, script);

      expect(result).toContain(`#JDL_PACKAGE=O2sim::${TEST_VERSION}`);
      expect(result).toContain('#JDL_OUTPUT=*.root@disk=1,*.log@disk=1');
      expect(result).toContain(script);
    });
  });

  describe('getLocalBodyCommented', () => {
    it('should generate commented local script content', () => {
      const script = 'python test_script.py';

      const result = getLocalBodyCommented(TEST_VERSION, script);

      expect(result).toContain('#!/bin/bash');
      expect(result).toContain('# ORIGINAL CONTENT (COMMENTED OUT FOR DEMONSTRATION):');
      expect(result).toContain('sleep 10');
      expect(result).toContain('digraph mygraph');
    });
  });
});
