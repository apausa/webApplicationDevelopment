// Actions
import formActionCreators from '../../../../../app/_private/lib/actions/formActions';

// Constants
import INITIAL_FORM from '../../../../../app/_private/lib/constants/formConstants';

// Mocks
import {
  mockDispatch,
  mockForm,
  setupTestEnvironment,
} from '../../../../mocks/dataMocks';

beforeEach(() => {
  setupTestEnvironment();
});

describe('formActionCreators', () => {
  it('should create readForm action with data from localStorage', () => {
    const testForm = { ...mockForm, title: 'Test Form' };
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(testForm));

    formActionCreators.readForm(mockDispatch);

    expect(localStorage.getItem).toHaveBeenCalledWith('form');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'READ_FORM',
      form: testForm,
    });
  });

  it('should create readForm action with INITIAL_FORM when localStorage is empty', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    formActionCreators.readForm(mockDispatch);

    expect(localStorage.getItem).toHaveBeenCalledWith('form');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'READ_FORM',
      form: INITIAL_FORM,
    });
  });

  it('should create createForm action', () => {
    const testForm = { ...mockForm, title: 'New Form' };

    formActionCreators.createForm(mockDispatch, testForm);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_FORM',
      form: testForm,
    });
  });

  it('should create updateBuildCmdSelected action', () => {
    const values = ['--arg1', '--arg2'];

    formActionCreators.updateBuildCmdSelected(mockDispatch, values);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_BUILD_CMD_SELECTED',
      values,
    });
  });

  it('should create updateBuildCmdValue action', () => {
    const value = '100';
    const name = '--threads';

    formActionCreators.updateBuildCmdValue(mockDispatch, value, name);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_BUILD_CMD_VALUE',
      value,
      name,
    });
  });

  it('should create updateRunCmdSelected action', () => {
    const values = ['--run-arg1', '--run-arg2'];

    formActionCreators.updateRunCmdSelected(mockDispatch, values);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_RUN_CMD_SELECTED',
      values,
    });
  });

  it('should create updateRunCmdValue action', () => {
    const value = 'test-value';
    const name = '--config';

    formActionCreators.updateRunCmdValue(mockDispatch, value, name);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_RUN_CMD_VALUE',
      value,
      name,
    });
  });

  it('should create updateFormVersion action', () => {
    const version = '2.0.0';

    formActionCreators.updateFormVersion(mockDispatch, version);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORM_VERSION',
      version,
    });
  });

  it('should create updateFormTitle action', () => {
    const title = 'New Title';

    formActionCreators.updateFormTitle(mockDispatch, title);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORM_TITLE',
      title,
    });
  });

  it('should create updateFormSubjobs action', () => {
    const subjobs = '5';

    formActionCreators.updateFormSubjobs(mockDispatch, subjobs);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORM_SUBJOBS',
      subjobs,
    });
  });

  it('should create updateFormAdvanced action', () => {
    const advanced = true;

    formActionCreators.updateFormAdvanced(mockDispatch, advanced);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORM_ADVANCED',
      advanced,
    });
  });

  it('should create updateFormScript action', () => {
    const script = 'console.log("test")';

    formActionCreators.updateFormScript(mockDispatch, script);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORM_SCRIPT',
      script,
    });
  });
});
