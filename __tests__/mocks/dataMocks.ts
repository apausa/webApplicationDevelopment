import { SortDescriptor } from '@nextui-org/react';
import { Form } from '../../app/_private/types/lib/formTypes';
import { Script, Simulation } from '../../app/_private/types/lib/simulationTypes';
import { Column, ColumnKey } from '../../app/_private/types/lib/tableTypes';
import { Status } from '../../app/_private/types/utils';

// Mock dispatch function
export const mockDispatch = jest.fn();

// Create a mock Form for testing
export const mockForm: Form = {
  title: 'Test Form',
  version: '1.0.0',
  subjobs: '1',
  script: 'test script',
  advanced: false,
  // eslint-disable-next-line no-template-curly-in-string
  createWorkflow: {
    // eslint-disable-next-line no-template-curly-in-string
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
    localRunWorkflow: { ...mockScript },
    localCreateWorkflow: { ...mockScript, graphvizData: null },
    gridRunWorkflow: { ...mockScript },
  },
};

export const mockSimulation2: Simulation = {
  id: '2',
  date: '12/05/2025',
  form: { ...mockForm, title: 'Another Test' },
  scripts: {
    localRunWorkflow: { ...mockScript },
    localCreateWorkflow: { ...mockScript, graphvizData: null },
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
