import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';

jest.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: jest.fn(),
  }),
}));

jest.mock('../../components/GoogleSignIn', () => ({
  GoogleSignIn: () => null,
}));

describe('LoginScreen', () => {
  it('renders correctly in sign-in mode', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={{}} />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in with your email or Google account')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('renders correctly in sign-up mode', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={{}} />);
    
    const switchButton = getByText("Don't have an account? Sign Up");
    fireEvent.press(switchButton);
    
    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Sign up to get started')).toBeTruthy();
    expect(getByPlaceholderText('Dr. Jane Smith')).toBeTruthy();
  });

  it('toggles between sign-in and sign-up mode', () => {
    const { getByText } = render(<LoginScreen navigation={{}} />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    
    fireEvent.press(getByText("Don't have an account? Sign Up"));
    expect(getByText('Create Account')).toBeTruthy();
    
    fireEvent.press(getByText('Already have an account? Sign In'));
    expect(getByText('Welcome Back')).toBeTruthy();
  });

  it('shows alert when email or password is empty', async () => {
    const { getByText } = render(<LoginScreen navigation={{}} />);
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter email and password');
    });
    
    alertSpy.mockRestore();
  });

  it('shows alert when name is empty in sign-up mode', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={{}} />);
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    // Switch to sign-up mode
    fireEvent.press(getByText("Don't have an account? Sign Up"));
    
    // Enter email and password but not name
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('••••••••');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter your name');
    });
    
    alertSpy.mockRestore();
  });

  it('updates email and password input values', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={{}} />);
    
    const emailInput = getByPlaceholderText('your@email.com');
    const passwordInput = getByPlaceholderText('••••••••');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('displays RRDCH logo and subtitle', () => {
    const { getByText } = render(<LoginScreen navigation={{}} />);
    
    expect(getByText('RRDCH')).toBeTruthy();
    expect(getByText('Rajarajeshwari Dental College & Hospital')).toBeTruthy();
  });
});
