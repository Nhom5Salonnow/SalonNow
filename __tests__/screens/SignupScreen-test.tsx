import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '@/app/auth/signup';

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

// Mock asyncStorage utilities
const mockStoreData = jest.fn().mockResolvedValue(undefined);
jest.mock('@/utils/asyncStorage', () => ({
  storeData: (...args: any[]) => mockStoreData(...args),
  getData: jest.fn(),
  removeData: jest.fn(),
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    HAS_COMPLETED_ONBOARDING: 'has_completed_onboarding',
  },
}));

// Mock AuthContext
const mockContextLogin = jest.fn();
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    login: mockContextLogin,
    user: null,
    isLoggedIn: false,
    isLoading: false,
  }),
}));

// Mock authService
const mockSignup = jest.fn();
jest.mock('@/api/authService', () => ({
  authService: {
    signup: (input: any) => mockSignup(input),
  },
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
  User: () => null,
  ChevronLeft: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignup.mockResolvedValue({
      user: { id: '1', email: 'test@example.com', name: 'John Doe', phone: '+1234567890', avatar: 'https://example.com/avatar.jpg' },
      token: 'mock_token',
    });
    mockContextLogin.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getAllByText } = render(<SignupScreen />);
      // Register appears in tab and button
      expect(getAllByText('Register').length).toBeGreaterThan(0);
    });

    it('should render name input', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      expect(getByPlaceholderText('Full Name')).toBeTruthy();
    });

    it('should render email input', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      expect(getByPlaceholderText('Email')).toBeTruthy();
    });

    it('should render phone input', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    });

    it('should render password input', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('should render confirm password input', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    });

    it('should render register button', () => {
      const { getAllByText } = render(<SignupScreen />);
      // Get all "Register" texts - there are tab and button
      const registerTexts = getAllByText('Register');
      expect(registerTexts.length).toBeGreaterThan(0);
    });

    it('should render login tab', () => {
      const { getByText } = render(<SignupScreen />);
      expect(getByText('Login')).toBeTruthy();
    });

    it('should render remember me checkbox', () => {
      const { getByText } = render(<SignupScreen />);
      expect(getByText('Remember Me ?')).toBeTruthy();
    });
  });

  describe('Form Input', () => {
    it('should update name field when typing', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      const nameInput = getByPlaceholderText('Full Name');

      fireEvent.changeText(nameInput, 'John Doe');

      expect(nameInput.props.value).toBe('John Doe');
    });

    it('should update email field when typing', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      const emailInput = getByPlaceholderText('Email');

      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should update phone field when typing', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      const phoneInput = getByPlaceholderText('Phone Number');

      fireEvent.changeText(phoneInput, '+1234567890');

      expect(phoneInput.props.value).toBe('+1234567890');
    });

    it('should update password field when typing', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      const passwordInput = getByPlaceholderText('Password');

      fireEvent.changeText(passwordInput, 'password123');

      expect(passwordInput.props.value).toBe('password123');
    });

    it('should update confirm password field when typing', () => {
      const { getByPlaceholderText } = render(<SignupScreen />);
      const confirmInput = getByPlaceholderText('Confirm Password');

      fireEvent.changeText(confirmInput, 'password123');

      expect(confirmInput.props.value).toBe('password123');
    });
  });

  describe('Form Submission', () => {
    it('should call authService.signup when form is submitted', async () => {
      const { getByPlaceholderText, getAllByText } = render(<SignupScreen />);

      fireEvent.changeText(getByPlaceholderText('Full Name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Phone Number'), '+1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

      // Get the button (there might be multiple "Register" texts)
      const buttons = getAllByText('Register');
      fireEvent.press(buttons[buttons.length - 1]); // Press the button one

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
          phone: '+1234567890',
        });
      });
    });

    it('should navigate to home on successful signup', async () => {
      const { getByPlaceholderText, getAllByText } = render(<SignupScreen />);

      fireEvent.changeText(getByPlaceholderText('Full Name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Phone Number'), '+1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

      const buttons = getAllByText('Register');
      fireEvent.press(buttons[buttons.length - 1]);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/home');
      });
    });
  });

  describe('Tab Navigation', () => {
    it('should navigate to login when Login tab is pressed', () => {
      const { getByText } = render(<SignupScreen />);

      fireEvent.press(getByText('Login'));

      expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });
  });
});
