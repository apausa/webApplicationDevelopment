import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import StdoutData from '../../../../../../../../app/_private/components/details/detailsMain/simulationTab/outputs/StdoutData';

// Mocks
import {
  setupTestEnvironment,
  mockStdoutData,
} from '../../../../../../../mocks/dataMocks';

describe('StdoutData Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the stdout data', () => {
    const { getByText } = render(<StdoutData stdoutData={mockStdoutData} />);

    expect(getByText(mockStdoutData)).toBeInTheDocument();
  });

  it('renders empty stdout data', () => {
    const { container } = render(<StdoutData stdoutData="" />);

    expect(container).toBeInTheDocument();
  });
});
