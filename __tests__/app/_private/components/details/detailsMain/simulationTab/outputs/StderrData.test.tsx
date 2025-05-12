import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Component
import StderrData from '../../../../../../../../app/_private/components/details/detailsMain/simulationTab/outputs/StderrData';

// Mocks
import {
  setupTestEnvironment,
  mockStderrData,
} from '../../../../../../../mocks/dataMocks';

describe('StderrData Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the stderr data', () => {
    const { getByText } = render(<StderrData stderrData={mockStderrData} />);

    expect(getByText(mockStderrData)).toBeInTheDocument();
  });

  it('renders empty stderr data', () => {
    const { container } = render(<StderrData stderrData="" />);

    expect(container).toBeInTheDocument();
  });
});
