import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import NumberInput from '../../../../../../../../../app/_private/components/configuration/configurationMain/tabs/defaultTab/inputs/NumberInput';

// Mocks
import { mockDispatch } from '../../../../../../../../mocks/dataMocks';

// Types
import { NumberArg } from '../../../../../../../../../app/_private/types/lib/formTypes';

describe('NumberInput Component', () => {
  const mockArg: NumberArg = {
    name: '--arg2',
    input: { type: 'number' as const },
    description: 'Number Argument',
    value: '42',
    selected: true,
    disabled: false,
  };

  const mockFormAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct props', () => {
    render(
      <NumberInput
        arg={mockArg}
        formAction={mockFormAction}
        dispatchForm={mockDispatch}
      />,
    );

    const input = screen.getByLabelText('Number input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(42);
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute('placeholder', 'Number Argument');
    expect(input).toHaveAttribute('min', '0');
  });

  it('calls formAction when value changes', () => {
    render(
      <NumberInput
        arg={mockArg}
        formAction={mockFormAction}
        dispatchForm={mockDispatch}
      />,
    );

    const input = screen.getByLabelText('Number input');
    fireEvent.change(input, { target: { value: '100' } });

    expect(mockFormAction).toHaveBeenCalledWith(mockDispatch, '100', '--arg2');
  });

  it('disables input when arg is disabled', () => {
    const disabledArg: NumberArg = {
      ...mockArg,
      disabled: true,
    };

    render(
      <NumberInput
        arg={disabledArg}
        formAction={mockFormAction}
        dispatchForm={mockDispatch}
      />,
    );

    const input = screen.getByLabelText('Number input');
    expect(input).toBeDisabled();
  });
});
