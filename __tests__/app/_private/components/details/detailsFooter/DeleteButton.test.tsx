import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import DeleteButton from '../../../../../../app/_private/components/details/detailsFooter/DeleteButton';

// Actions
import simulationActionCreators from '../../../../../../app/_private/lib/actions/simulationActions';

// Mocks
import {
  mockDispatch,
  mockSimulation1,
  setupTestEnvironment,
  mockSetDeleted,
} from '../../../../../mocks/dataMocks';

// Mock simulation action creators
jest.mock('../../../../../../app/_private/lib/actions/simulationActions', () => ({
  deleteSimulation: jest.fn(),
}));

describe('DeleteButton Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the delete button', () => {
    render(
      <DeleteButton
        dispatchSimulation={mockDispatch}
        setDeleted={mockSetDeleted}
        selectedSimulation={mockSimulation1}
      />,
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls deleteSimulation and setDeleted when clicked', () => {
    render(
      <DeleteButton
        dispatchSimulation={mockDispatch}
        setDeleted={mockSetDeleted}
        selectedSimulation={mockSimulation1}
      />,
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // eslint-disable-next-line max-len
    expect(simulationActionCreators.deleteSimulation).toHaveBeenCalledWith(mockDispatch, mockSimulation1.id);
    expect(mockSetDeleted).toHaveBeenCalledWith(true);
  });
});
