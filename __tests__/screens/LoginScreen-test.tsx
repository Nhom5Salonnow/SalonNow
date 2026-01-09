import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/auth/login';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    replace: (path: string) => mockReplace(path),
    push: (path: string) => mockPush(path),
    back: () => mockBack(),
  },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AuthContext
const mockLoginWithCredentials = jest.fn();
const mockContextLogin = jest.fn();
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    login: mockContextLogin,
    loginWithCredentials: mockLoginWithCredentials,
    user: null,
    isLoggedIn: false,
    isLoading: false,
  }),
}));

// Mock responsive utilities
jest.mock('@/utils/responsive', () => ({
  wp: (value: number) => value * 4,
  hp: (value: number) => value * 8,
  rf: (value: number) => value,
}));

// Mock constants
jest.mock('@/constants', () => ({
  Colors: {
    primary: '#FE697D',
    salon: {
      pinkLight: '#FFCCD3',
      pinkBg: '#FFF5F5',
      dark: '#1F2937',
      coral: '#FF7F7F',
    },
    gray: {
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Eye: () => null,
  EyeOff: () => null,
  Mail: () => null,
  Lock: () => null,
  ChevronLeft: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginWithCredentials.mockResolvedValue({ success: true });
    mockContextLogin.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getAllByText } = render(<LoginScreen />);
      // Login appears in tab and button
      expect(getAllByText('Login').length).toBeGreaterThan(0);
    });

    it('should render email input', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      expect(getByPlaceholderText('Email')).toBeTruthy();
    });

    it('should render password input', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('should render login button', () => {
      const { getAllByText } = render(<LoginScreen />);
      // Login appears in tab and button
      const loginTexts = getAllByText('Login');
      expect(loginTexts.length).toBeGreaterThanOrEqual(2);
    });

    it('should render register link', () => {
      const { getByText } = render(<LoginScreen />);
      // The screen shows "Register" tab option
      expect(getByText('Register')).toBeTruthy();
    });
  });

  describe('Form Input', () => {
    it('should update email field when typing', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const emailInput = getByPlaceholderText('Email');

      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should update password field when typing', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const passwordInput = getByPlaceholderText('Password');

      fireEvent.changeText(passwordInput, 'password123');

      expect(passwordInput.props.value).toBe('password123');
    });
  });

  describe('Form Submission', () => {
    it('should call loginWithCredentials with email and password', async () => {
      const { getByPlaceholderText, getAllByText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

      // There might be multiple "Login" texts (title and button)
      const loginButtons = getAllByText('Login');
      fireEvent.press(loginButtons[loginButtons.length - 1]);

      await waitFor(() => {
        expect(mockLoginWithCredentials).toHaveBeenCalledWith(
          'test@example.com',
          'password123'
        );
      });
    });

    it('should navigate to home on successful login', async () => {
      const { getByPlaceholderText, getAllByText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

      const loginButtons = getAllByText('Login');
      fireEvent.press(loginButtons[loginButtons.length - 1]);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/home');
      });
    });

    it('should show error message on failed login', async () => {
      mockLoginWithCredentials.mockResolvedValue({
        success: false,
        message: 'Invalid email or password'
      });

      const { getByPlaceholderText, getAllByText, findByText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');

      const loginButtons = getAllByText('Login');
      fireEvent.press(loginButtons[loginButtons.length - 1]);

      expect(await findByText('Invalid email or password')).toBeTruthy();
    });

    it('should show error when email or password is empty', async () => {
      const { getAllByText, findByText } = render(<LoginScreen />);

      const loginButtons = getAllByText('Login');
      fireEvent.press(loginButtons[loginButtons.length - 1]);

      expect(await findByText('Please enter email and password')).toBeTruthy();
    });
  });

  describe('Tab Navigation', () => {
    it('should navigate to signup when Register tab is pressed', () => {
      const { getByText } = render(<LoginScreen />);

      fireEvent.press(getByText('Register'));

      expect(mockReplace).toHaveBeenCalledWith('/auth/signup');
    });

    it('should show Forget Password link', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('Forget Password?')).toBeTruthy();
    });
  });
});
