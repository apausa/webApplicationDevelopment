/* eslint-disable react/require-default-props */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import RecreateButton from '../../../../../../app/_private/components/details/detailsFooter/RecreateButton';

// Actions
import formActionCreators from '../../../../../../app/_private/lib/actions/formActions';

// Mocks
import {
  mockSimulation1,
  mockSimulation2,
  setupTestEnvironment,
  mockOnClose,
} from '../../../../../mocks/dataMocks';

// Mock Next.js Link component
jest.mock('next/link', () => function MockLink({
  children,
  href,
  isDisabled,
  onClick,
}: {
  children: React.ReactNode,
  href: string,
  isDisabled?: boolean,
  onClick?: (e: React.MouseEvent) => void,
}) {
  return (
    <a
      href={href}
      aria-disabled={isDisabled}
      data-testid="mock-link"
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        if (onClick) onClick(e);
      }}
    >
      {children}
    </a>
  );
});

// Mock NextUI Button component
jest.mock('@nextui-org/react', () => ({
  Button: function MockButton({
    children,
    onClick,
    isDisabled,
    as: Component,
    href,
  }: {
    children: React.ReactNode,
    onClick?: () => void,
    isDisabled?: boolean,
    as?: React.ComponentType<any>,
    href?: string,
  }) {
    if (Component) {
      return (
        <Component href={href} isDisabled={isDisabled} onClick={onClick} data-testid="mock-link">
          {children}
        </Component>
      );
    }

    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        data-href={href}
        data-testid="mock-button"
        type="button"
      >
        {children}
      </button>
    );
  },
}));

// Mock form action creators
jest.mock('../../../../../../app/_private/lib/actions/formActions', () => ({
  createForm: jest.fn(),
}));

// Mock the useReducer hook
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useReducer: () => [null, jest.fn()],
  };
});

describe('RecreateButton Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the recreate button', () => {
    render(
      <RecreateButton
        selectedSimulation={mockSimulation1}
        isOpen={false}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText('Recreate')).toBeInTheDocument();
    expect(screen.getByTestId('mock-link')).toHaveAttribute('href', '/configuration');
  });

  it('calls createForm and onClose when clicked and modal is open', () => {
    render(
      <RecreateButton
        selectedSimulation={mockSimulation1}
        isOpen
        onClose={mockOnClose}
      />,
    );

    const recreateButton = screen.getByText('Recreate');
    fireEvent.click(recreateButton);

    expect(formActionCreators.createForm).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls createForm but not onClose when clicked and modal is closed', () => {
    render(
      <RecreateButton
        selectedSimulation={mockSimulation1}
        isOpen={false}
        onClose={mockOnClose}
      />,
    );

    const recreateButton = screen.getByText('Recreate');
    fireEvent.click(recreateButton);

    expect(formActionCreators.createForm).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('disables the button when the simulation form is advanced', () => {
    const advancedSimulation = {
      ...mockSimulation2,
      form: {
        ...mockSimulation2.form,
        advanced: true,
      },
    };

    render(
      <RecreateButton
        selectedSimulation={advancedSimulation}
        isOpen={false}
        onClose={mockOnClose}
      />,
    );

    const recreateButton = screen.getByTestId('mock-link');
    expect(recreateButton).toHaveAttribute('aria-disabled', 'true');
  });
});
