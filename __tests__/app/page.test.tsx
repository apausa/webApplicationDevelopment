import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../app/page';
import simulationActionCreators from '../../app/_private/lib/actions/simulationActions';
import { setupTestEnvironment } from '../mocks/dataMocks';

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock simulation action creators
jest.mock('../../app/_private/lib/actions/simulationActions', () => ({
  readAllSimulations: jest.fn(),
}));

// Mock components
jest.mock('../../app/_private/components/dashboard/dashboardMain/DashboardMain', () => function MockDashboardMain() {
  return <div data-testid="dashboard-main">Dashboard Main Content</div>;
});

jest.mock('../../app/_private/components/dashboard/DashboardHeader', () => function MockDashboardHeader() {
  return <div data-testid="dashboard-header">Dashboard Header</div>;
});

jest.mock('../../app/_private/components/dashboard/DashboardFooter', () => function MockDashboardFooter() {
  return <div data-testid="dashboard-footer">Dashboard Footer</div>;
});

describe('Dashboard Page Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('renders the dashboard components', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-main')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-footer')).toBeInTheDocument();
  });

  it('calls readAllSimulations when at root path', () => {
    render(<Dashboard />);

    expect(simulationActionCreators.readAllSimulations).toHaveBeenCalled();
  });
});
