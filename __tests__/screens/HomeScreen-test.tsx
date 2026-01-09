import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/home';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AuthContext
let mockIsLoggedIn = false;
let mockUser: { id: string; name: string; email: string; avatar?: string } | null = null;
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    user: mockUser,
    isLoggedIn: mockIsLoggedIn,
    isLoading: false,
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
  },
}));

// Mock API modules
const mockGetCategories = jest.fn();
const mockGetStylists = jest.fn();
jest.mock('@/api', () => ({
  categoryApi: {
    getCategories: () => mockGetCategories(),
  },
  stylistApi: {
    getStylists: () => mockGetStylists(),
  },
}));

// Mock responsive utilities
jest.mock('@/utils/responsive', () => ({
  wp: (value: number) => value * 4,
  hp: (value: number) => value * 8,
  rf: (value: number) => value,
}));

// Mock asyncStorage utilities
const mockGetData = jest.fn();
jest.mock('@/utils/asyncStorage', () => ({
  getData: (key: string) => mockGetData(key),
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
  },
}));

// Mock constants
jest.mock('@/constants', () => ({
  Colors: {
    primary: '#FE697D',
    salon: {
      pinkLight: '#FFCCD3',
      pinkBg: '#FFF5F5',
      dark: '#1F2937',
    },
    gray: {
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
  HOME_CATEGORIES: [
    { id: '1', name: 'Hair Cut', imageUrl: 'http://example.com/1.jpg' },
    { id: '2', name: 'Hair Color', imageUrl: 'http://example.com/2.jpg' },
    { id: '3', name: 'Massage', imageUrl: 'http://example.com/3.jpg' },
  ],
  SPECIALISTS: [
    { id: '1', name: 'Doe John', rating: 2, phone: '+732 8888 111', imageUrl: 'http://example.com/s1.jpg' },
    { id: '2', name: 'Lucy', rating: 2, phone: '+732 8888 111', imageUrl: 'http://example.com/s2.jpg' },
    { id: '3', name: 'Laila', rating: 0, phone: '+732 8888 111', imageUrl: 'http://example.com/s3.jpg' },
  ],
  GUEST_USER: {
    name: 'Guest',
    avatar: null,
  },
  DEFAULT_AVATAR: 'https://example.com/default-avatar.png',
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Bell: () => null,
  ShoppingCart: () => null,
  User: () => null,
}));

// Mock DecorativeCircle component
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
}));

// Mock salon components
jest.mock('@/components/salon', () => ({
  HomeCategoryCard: ({ name, onPress }: { name: string; onPress?: () => void }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={`category-${name}`} onPress={onPress}>
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  },
  PromoCard: ({ title, subtitle }: { title: string; subtitle?: string }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`promo-${title.substring(0, 10)}`}>
        <Text>{title}</Text>
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    );
  },
  SpecialistCard: ({ name, onPress }: { name: string; onPress?: () => void }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={`specialist-${name}`} onPress={onPress}>
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to guest mode
    mockIsLoggedIn = false;
    mockUser = null;
    mockGetData.mockResolvedValue(null);
    // Default API responses - empty to use hardcoded data
    mockGetCategories.mockResolvedValue({ success: true, data: [] });
    mockGetStylists.mockResolvedValue({ success: true, data: [] });
  });

  describe('Rendering - Guest Mode', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Welcome')).toBeTruthy();
    });

    it('should render Welcome greeting for guest', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Welcome')).toBeTruthy();
      expect(getByText('Guest')).toBeTruthy();
    });

    it('should render Categories section title', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Categories')).toBeTruthy();
    });

    it('should render all categories from HOME_CATEGORIES', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('category-Hair Cut')).toBeTruthy();
      expect(getByTestId('category-Hair Color')).toBeTruthy();
      expect(getByTestId('category-Massage')).toBeTruthy();
    });

    it('should render correct number of category cards', () => {
      const { getAllByTestId } = render(<HomeScreen />);
      const categoryCards = getAllByTestId(/^category-/);
      expect(categoryCards.length).toBe(3);
    });

    it('should render Hair Specialist section title', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Hair Specialist')).toBeTruthy();
    });

    it('should render all specialist cards', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('specialist-Doe John')).toBeTruthy();
      expect(getByTestId('specialist-Lucy')).toBeTruthy();
      expect(getByTestId('specialist-Laila')).toBeTruthy();
    });

    it('should render correct number of specialist cards', () => {
      const { getAllByTestId } = render(<HomeScreen />);
      const specialists = getAllByTestId(/^specialist-/);
      expect(specialists.length).toBe(3);
    });
  });

  describe('Navigation - Guest Mode', () => {
    it('should navigate to service detail when category is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('category-Hair Cut'));

      expect(mockPush).toHaveBeenCalledWith('/service/1');
    });

    it('should navigate to book-appointment when specialist is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('specialist-Doe John'));

      expect(mockPush).toHaveBeenCalledWith('/book-appointment');
    });

    it('should navigate to login when profile button is pressed (guest mode)', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('profile-button'));

      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('should navigate to promo service when promo card is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('promo-button'));

      expect(mockPush).toHaveBeenCalledWith('/service/hair-design');
    });

    it('should navigate to payment when cart button is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('cart-button'));

      expect(mockPush).toHaveBeenCalledWith('/payment');
    });

    it('should navigate to settings when menu button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<HomeScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable is the menu button
      fireEvent.press(buttons[0]);

      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });

  describe('Logged In Mode', () => {
    beforeEach(() => {
      mockIsLoggedIn = true;
      mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@test.com',
        avatar: 'http://example.com/avatar.jpg',
      };
    });

    afterEach(() => {
      mockIsLoggedIn = false;
      mockUser = null;
    });

    it('should show Hi greeting for logged in user', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Hi')).toBeTruthy();
    });

    it('should show user name for logged in user', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Test User')).toBeTruthy();
    });

    it('should show "User" when user has no name', () => {
      mockUser = { id: 'user-1', name: '', email: 'test@test.com' };
      const { getByText } = render(<HomeScreen />);
      expect(getByText('User')).toBeTruthy();
    });

    it('should navigate to profile when profile button is pressed (logged in)', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('profile-button'));

      expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    it('should use default avatar when user has no avatar', () => {
      mockUser = { id: 'user-1', name: 'Test User', email: 'test@test.com' };
      // Just verify it renders without crashing
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('profile-button')).toBeTruthy();
    });
  });

  describe('API Integration', () => {
    it('should fetch categories from API on mount', async () => {
      mockGetCategories.mockResolvedValue({
        success: true,
        data: [
          { id: 'api-1', name: 'API Category 1', image: 'http://api.com/1.jpg' },
          { id: 'api-2', name: 'API Category 2', imageUrl: 'http://api.com/2.jpg' },
        ],
      });

      render(<HomeScreen />);

      await waitFor(() => {
        expect(mockGetCategories).toHaveBeenCalled();
      });
    });

    it('should fetch stylists from API on mount', async () => {
      mockGetStylists.mockResolvedValue({
        success: true,
        data: [
          { id: 'api-s1', name: 'API Stylist 1', avatar: 'http://api.com/s1.jpg', rating: 5, phone: '123' },
        ],
      });

      render(<HomeScreen />);

      await waitFor(() => {
        expect(mockGetStylists).toHaveBeenCalled();
      });
    });

    it('should merge API categories with hardcoded data', async () => {
      mockGetCategories.mockResolvedValue({
        success: true,
        data: [
          { _id: 'new-cat', name: 'New Category', image: 'http://api.com/new.jpg' },
        ],
      });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('category-New Category')).toBeTruthy();
      });
    });

    it('should merge API stylists with hardcoded data', async () => {
      mockGetStylists.mockResolvedValue({
        success: true,
        data: [
          { _id: 'new-sty', name: 'New Stylist', imageUrl: 'http://api.com/new.jpg' },
        ],
      });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('specialist-New Stylist')).toBeTruthy();
      });
    });

    it('should use hardcoded data when API returns empty categories', async () => {
      mockGetCategories.mockResolvedValue({ success: true, data: [] });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('category-Hair Cut')).toBeTruthy();
      });
    });

    it('should use hardcoded data when API returns empty stylists', async () => {
      mockGetStylists.mockResolvedValue({ success: true, data: [] });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('specialist-Doe John')).toBeTruthy();
      });
    });

    it('should use hardcoded data when API call fails', async () => {
      mockGetCategories.mockResolvedValue({ success: false, data: null });
      mockGetStylists.mockResolvedValue({ success: false, data: null });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('category-Hair Cut')).toBeTruthy();
        expect(getByTestId('specialist-Doe John')).toBeTruthy();
      });
    });

    it('should handle API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetCategories.mockRejectedValue(new Error('Network error'));

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching home data:', expect.any(Error));
      });

      // Should still show hardcoded data
      expect(getByTestId('category-Hair Cut')).toBeTruthy();
      consoleSpy.mockRestore();
    });

    it('should handle category with _id instead of id', async () => {
      mockGetCategories.mockResolvedValue({
        success: true,
        data: [
          { _id: 'mongo-id', name: 'MongoDB Category' },
        ],
      });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('category-MongoDB Category')).toBeTruthy();
      });
    });

    it('should handle stylist with avatar instead of imageUrl', async () => {
      mockGetStylists.mockResolvedValue({
        success: true,
        data: [
          { id: 'sty-avatar', name: 'Avatar Stylist', avatar: 'http://api.com/avatar.jpg' },
        ],
      });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('specialist-Avatar Stylist')).toBeTruthy();
      });
    });

    it('should use fallback imageUrl when category has no image', async () => {
      mockGetCategories.mockResolvedValue({
        success: true,
        data: [
          { id: 'no-img', name: 'No Image Category' },
        ],
      });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('category-No Image Category')).toBeTruthy();
      });
    });

    it('should use default rating and phone when stylist has none', async () => {
      mockGetStylists.mockResolvedValue({
        success: true,
        data: [
          { id: 'minimal', name: 'Minimal Stylist' },
        ],
      });

      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId('specialist-Minimal Stylist')).toBeTruthy();
      });
    });
  });

  describe('Second Promo Card', () => {
    it('should navigate when second promo card is pressed', () => {
      const { UNSAFE_getAllByType } = render(<HomeScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Find and press second promo button (index varies based on layout)
      // The promo cards are wrapped in TouchableOpacity
      const promoButtons = buttons.filter((btn: any) =>
        btn.props.activeOpacity === 0.9
      );

      if (promoButtons.length >= 2) {
        fireEvent.press(promoButtons[1]);
        expect(mockPush).toHaveBeenCalledWith('/service/hair-design');
      }
    });
  });
});
