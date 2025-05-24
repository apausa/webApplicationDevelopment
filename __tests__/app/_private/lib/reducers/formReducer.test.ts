// This test file is kept as it tests core form state management functionality
// without any NextUI component mocking - it focuses on the reducer logic

// Reducer
import formReducer from '../../../../../app/_private/lib/reducers/formReducer';

// Types
import { Form, FormAction } from '../../../../../app/_private/types/lib/formTypes';

// Mocks
import {
  mockForm,
  setupTestEnvironment,
} from '../../../../mocks/dataMocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('Form Reducer', () => {
  describe('CRUD Operations', () => {
    it('should handle reading form data', () => {
      const currentState: Form = { ...mockForm, title: 'Old Title' };
      const newForm: Form = { ...mockForm, title: 'New Title' };
      const action: FormAction = {
        type: 'READ_FORM',
        form: newForm,
      };

      const newState = formReducer(currentState, action);

      expect(newState).toEqual(newForm);
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newForm));
    });

    it('should handle creating new form', () => {
      const currentState: Form = { ...mockForm, title: 'Old Title' };
      const newForm: Form = { ...mockForm, title: 'New Title' };
      const action: FormAction = {
        type: 'CREATE_FORM',
        form: newForm,
      };

      const newState = formReducer(currentState, action);

      expect(newState).toEqual(newForm);
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newForm));
    });
  });

  describe('Build Command Management', () => {
    it('should update build command selected arguments', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_BUILD_CMD_SELECTED',
        values: ['--arg1', '--arg3'],
      };

      const newState = formReducer(currentState, action);

      expect(newState.createWorkflow.args[0].selected).toBe(true); // --arg1
      expect(newState.createWorkflow.args[1].selected).toBe(false); // --arg2
      expect(newState.createWorkflow.args[2].selected).toBe(true); // --arg3
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });

    it('should update build command argument values', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_BUILD_CMD_VALUE',
        name: '--arg2',
        value: '100',
      };

      const newState = formReducer(currentState, action);

      expect(newState.createWorkflow.args[1].value).toBe('100');
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });
  });

  describe('Run Command Management', () => {
    it('should update run command selected arguments', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_RUN_CMD_SELECTED',
        values: ['--run-arg2'],
      };

      const newState = formReducer(currentState, action);

      expect(newState.runWorkflow.args[0].selected).toBe(false); // --run-arg1
      expect(newState.runWorkflow.args[1].selected).toBe(true); // --run-arg2
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });

    it('should update run command argument values', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_RUN_CMD_VALUE',
        name: '--run-arg1',
        value: 'new-value',
      };

      const newState = formReducer(currentState, action);

      expect(newState.runWorkflow.args[0].value).toBe('new-value');
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });
  });

  describe('Form Field Updates', () => {
    it('should update form version', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_FORM_VERSION',
        version: '2.0.0',
      };

      const newState = formReducer(currentState, action);

      expect(newState.version).toBe('2.0.0');
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });

    it('should update form title', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_FORM_TITLE',
        title: 'New Form Title',
      };

      const newState = formReducer(currentState, action);

      expect(newState.title).toBe('New Form Title');
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });

    it('should update form subjobs count', () => {
      const currentState: Form = { ...mockForm };
      const action: FormAction = {
        type: 'UPDATE_FORM_SUBJOBS',
        subjobs: '5',
      };

      const newState = formReducer(currentState, action);

      expect(newState.subjobs).toBe('5');
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });

    it('should update form advanced mode', () => {
      const currentState: Form = { ...mockForm, advanced: false };
      const action: FormAction = {
        type: 'UPDATE_FORM_ADVANCED',
        advanced: true,
      };

      const newState = formReducer(currentState, action);

      expect(newState.advanced).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });

    it('should update form script content', () => {
      const currentState: Form = { ...mockForm };
      const newScript = 'console.log("new script")';
      const action: FormAction = {
        type: 'UPDATE_FORM_SCRIPT',
        script: newScript,
      };

      const newState = formReducer(currentState, action);

      expect(newState.script).toBe(newScript);
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(newState));
    });
  });

  describe('Unknown Actions', () => {
    it('should return the original state for unknown action types', () => {
      const currentState: Form = { ...mockForm };
      const action = { type: 'UNKNOWN_ACTION' } as any;

      const newState = formReducer(currentState, action);

      expect(newState).toBe(currentState);
      expect(localStorage.setItem).toHaveBeenCalledWith('form', JSON.stringify(currentState));
    });
  });
});
