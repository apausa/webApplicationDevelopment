/* eslint-disable no-template-curly-in-string */

import { SortDescriptor } from '@nextui-org/react';

// Types
import { Form } from '../app/_private/types/lib/formTypes';
import { Script, Simulation } from '../app/_private/types/lib/simulationTypes';
import { Column, ColumnKey } from '../app/_private/types/lib/tableTypes';
import { Status } from '../app/_private/types/utils';

// Mock dispatch function
export const mockDispatch = jest.fn();

// Test constants that appear across multiple test files
export const TEST_VERSION = 'v20250524-1';
export const TEST_DATE_STRING = '24/05/2025';
export const TEST_DATE_ISO = '2025-05-24';
export const TEST_TIME_STRING = '14:30';
export const TEST_SCRIPT_CONTENT = 'test script';
export const TEST_UUID = 'test-uuid';
export const TEST_PATH = '/test/path';

// Mock workflow for testing form utilities
export const mockWorkflow = {
  name: 'test_command.py',
  args: [
    {
      name: '--arg1',
      value: 'value1',
      selected: true,
      description: 'Test arg',
      disabled: false,
      input: { type: 'string' },
    },
    {
      name: '--arg2',
      value: '42',
      selected: false,
      description: 'Disabled arg',
      disabled: false,
      input: { type: 'string' },
    },
  ],
};

// Mock script with more detailed properties for API testing
export const mockApiScript = {
  scriptPath: '/test/script.sh',
  scriptBody: '#!/bin/bash\necho "test"',
  scriptStatus: 'Staged' as const,
  stderrData: null,
  stdoutData: null,
};

// Create a mock Form for testing
export const mockForm: Form = {
  title: 'Test Form',
  version: '1.0.0',
  subjobs: '1',
  script: 'test script',
  advanced: false,
  createWorkflow: {
    name: '${O2DPG_ROOT}/MC/bin/o2dpg_sim_workflow.py' as const,
    args: [
      {
        name: '--arg1',
        input: { type: 'string' },
        description: 'Argument 1',
        value: 'value1',
        selected: true,
        disabled: false,
      },
      {
        name: '--arg2',
        input: { type: 'number' },
        description: 'Argument 2',
        value: '42',
        selected: false,
        disabled: false,
      },
      {
        name: '--arg3',
        input: { type: 'boolean' },
        description: 'Argument 3',
        value: null,
        selected: false,
        disabled: false,
      },
    ],
  },
  runWorkflow: {
    // eslint-disable-next-line no-template-curly-in-string
    name: '${O2DPG_ROOT}/MC/bin/o2_dpg_workflow_runner.py' as const,
    args: [
      {
        name: '--run-arg1',
        input: { type: 'string' },
        description: 'Run Argument 1',
        value: 'run1',
        selected: true,
        disabled: false,
      },
      {
        name: '--run-arg2',
        input: { type: 'number' },
        description: 'Run Argument 2',
        value: '10',
        selected: false,
        disabled: false,
      },
    ],
  },
};

// Create a mock Script for testing
export const mockScript: Script = {
  scriptPath: 'test/path',
  scriptBody: 'test body',
  scriptStatus: 'Staged' as Status,
  stderrData: '',
  stdoutData: '',
};

// Create mock simulations for testing
export const mockSimulation1: Simulation = {
  id: '1',
  date: '12/05/2025',
  form: mockForm,
  scripts: {
    localRunWorkflow: { ...mockScript, graphvizData: null },
    gridRunWorkflow: { ...mockScript },
  },
};

export const mockSimulation2: Simulation = {
  id: '2',
  date: '12/05/2025',
  form: { ...mockForm, title: 'Another Test' },
  scripts: {
    localRunWorkflow: { ...mockScript, graphvizData: null },
    gridRunWorkflow: { ...mockScript },
  },
};

// Table related mocks
export const mockSelectedColumns: Column[] = [
  { key: 'Title' as ColumnKey, allowSorting: true },
  { key: 'Sub-jobs number' as ColumnKey, allowSorting: true },
  { key: 'Local status' as ColumnKey, allowSorting: true },
  { key: 'WLCG status' as ColumnKey, allowSorting: true },
  { key: 'Creation date' as ColumnKey, allowSorting: true },
  { key: 'Options' as ColumnKey, allowSorting: false },
];

export const mockSortDescriptor: SortDescriptor = {
  column: 'name',
  direction: 'ascending',
};

// Additional mocks for details components
export const mockStdoutData = 'Sample stdout output';
export const mockStderrData = 'Sample stderr output';
export const mockSetDeleted = jest.fn();
export const mockOnClose = jest.fn();

// Mock dates for consistent testing
export const mockDate = new Date('2025-05-24T10:30:00Z');
export const mockDateForTime = new Date('2025-05-24T14:30:00Z');

// Mock API Request/Response objects for API route testing
export const mockNextRequest = {
  json: jest.fn(),
};

export const mockNextResponse = {
  json: jest.fn().mockImplementation((data) => global.Response.json(data)),
};

// Setup and clean test environment
export const setupTestEnvironment = (): void => {
  // Clear all mocks at the start of each test
  jest.clearAllMocks();

  // Setup localStorage mock
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();

  // Setup fetch mock
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    headers: new Map(),
  });
};
