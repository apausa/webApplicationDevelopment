import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import StringInput from '../../../../../../../../../app/_private/components/configuration/configurationMain/tabs/defaultTab/inputs/StringInput';

// Mocks
import { mockDispatch } from '../../../../../../../../mocks/dataMocks';

// Types
import { StringArg } from '../../../../../../../../../app/_private/types/lib/formTypes';

describe('StringInput Component', () => {
  const mockArg: StringArg = {
    name: '--arg1',
    input: { type: 'string' as const },
    description: 'String Argument',
    value: 'test value',
    selected: true,
    disabled: false,
  };

  const mockFormAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct props', () => {
    render(
      <StringInput
        arg={mockArg}
        formAction={mockFormAction}
        dispatchForm={mockDispatch}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test value');
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute('placeholder', 'String Argument');
  });

  it('calls formAction when value changes', () => {
    render(
      <StringInput
        arg={mockArg}
        formAction={mockFormAction}
        dispatchForm={mockDispatch}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockFormAction).toHaveBeenCalledWith(mockDispatch, 'new value', '--arg1');
  });

  it('disables input when arg is disabled', () => {
    const disabledArg: StringArg = { ...mockArg, disabled: true };

    render(
      <StringInput
        arg={disabledArg}
        formAction={mockFormAction}
        dispatchForm={mockDispatch}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
