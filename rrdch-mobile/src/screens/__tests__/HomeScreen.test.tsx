import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

jest.mock('../../config/convex', () => ({
  convex: {
    query: jest.fn(),
  },
}));

jest.mock('../../config/convex-api', () => ({
  convexApi: {
    users: {
      viewerProfile: 'viewerProfile',
    },
    appointments: {
      listForViewer: 'listForViewer',
    },
  },
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signOut: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  const queryMock = require('../../config/convex').convex.query as jest.Mock;

  beforeEach(() => {
    queryMock.mockReset();
    queryMock.mockResolvedValueOnce({ name: 'Patient' }).mockResolvedValueOnce([]);
  });

  it('renders the dashboard sections', async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => expect(queryMock).toHaveBeenCalledTimes(2));

    expect(getByText('Welcome,')).toBeTruthy();
    expect(getByText('Upcoming')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Book Appointment')).toBeTruthy();
    expect(getByText('My Appointments')).toBeTruthy();
    expect(getByText('Payments')).toBeTruthy();
    expect(getByText('Reports')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Quick Actions')).toBeTruthy();
    expect(getByText('Recent Activity')).toBeTruthy();
  });

  it('displays the fetched patient name', async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => expect(queryMock).toHaveBeenCalledTimes(2));

    expect(getByText('Patient')).toBeTruthy();
  });
});
