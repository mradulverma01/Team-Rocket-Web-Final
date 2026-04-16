import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import AppNavigator from '../AppNavigator';

const mockUseAuth = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../../screens/LoginScreen', () => 'LoginScreen');
jest.mock('../../screens/HomeScreen', () => 'HomeScreen');
jest.mock('../../screens/AppointmentsScreen', () => 'AppointmentsScreen');
jest.mock('../../screens/PaymentsScreen', () => 'PaymentsScreen');
jest.mock('../../screens/ProfileScreen', () => 'ProfileScreen');
jest.mock('../../screens/ReportsScreen', () => 'ReportsScreen');

describe('AppNavigator', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      userId: 'test-user-id',
      signOut: jest.fn(),
    });
  });

  it('renders correctly when authenticated', () => {
    expect(() => render(<AppNavigator />)).not.toThrow();
  });

  it('renders loading state when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      userId: null,
      signOut: jest.fn(),
    });

    const { UNSAFE_getByType } = render(<AppNavigator />);

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
