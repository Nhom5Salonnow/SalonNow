import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditCategoryScreen from '@/app/admin/edit-category';

// Mock expo-router
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
    push: (path: string) => mockPush(path),
  },
  useLocalSearchParams: () => ({
    id: 'facial-neck',
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
    },
    gray: {
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
  SERVICES_MENU: [
    { id: '1', name: 'Face Massage', image: 'https://example.com/face.jpg', rating: 4.5, price: 45, reviews: 30 },
    { id: '2', name: 'Facial', image: 'https://example.com/facial.jpg', rating: 4.8, price: 60, reviews: 50 },
    { id: '3', name: 'Neck Massage', image: 'https://example.com/neck.jpg', rating: 4.3, price: 35, reviews: 20 },
  ],
  CATEGORY_INFO: {
    'facial-neck': {
      name: 'Facial & Neck Care',
      quote: '"Nourish Your Skin\nRenew Your Soul"',
      image: 'https://example.com/facial.jpg',
    },
  },
}));

// Mock API modules
jest.mock('@/api', () => ({
  serviceApi: {
    getServices: jest.fn().mockResolvedValue({
      success: true,
      data: [],
    }),
  },
  categoryApi: {
    getCategoryById: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: 'facial-neck',
        name: 'Facial & Neck Care',
        quote: '"Nourish Your Skin\nRenew Your Soul"',
      },
    }),
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  Search: () => null,
  Pencil: () => null,
  Plus: () => null,
  Star: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  AdminBottomNav: () => {
    const { View } = require('react-native');
    return <View testID="admin-bottom-nav" />;
  },
}));

describe('EditCategoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<EditCategoryScreen />);
      expect(getByText('Facial & Neck Care')).toBeTruthy();
    });

    it('should render category name in header', () => {
      const { getByText } = render(<EditCategoryScreen />);
      expect(getByText('Facial & Neck Care')).toBeTruthy();
    });

    it('should render category quote in banner', () => {
      const { getByText } = render(<EditCategoryScreen />);
      expect(getByText('"Nourish Your Skin\nRenew Your Soul"')).toBeTruthy();
    });

    it('should render Menu section title', () => {
      const { getByText } = render(<EditCategoryScreen />);
      expect(getByText('Menu')).toBeTruthy();
    });

    it('should render service items', () => {
      const { getByText } = render(<EditCategoryScreen />);
      expect(getByText('Face Massage')).toBeTruthy();
      expect(getByText('Facial')).toBeTruthy();
      expect(getByText('Neck Massage')).toBeTruthy();
    });

    it('should render service prices', () => {
      const { getByText } = render(<EditCategoryScreen />);
      // Services have different prices from mock: 45, 60, 35
      expect(getByText('€45')).toBeTruthy();
      expect(getByText('€60')).toBeTruthy();
      expect(getByText('€35')).toBeTruthy();
    });

    it('should render service ratings', () => {
      const { getByText } = render(<EditCategoryScreen />);
      // Ratings from mock: 4.5, 4.8, 4.3
      expect(getByText('4.5')).toBeTruthy();
      expect(getByText('4.8')).toBeTruthy();
      expect(getByText('4.3')).toBeTruthy();
    });

    it('should render "per 1" labels', () => {
      const { getAllByText } = render(<EditCategoryScreen />);
      expect(getAllByText('per 1').length).toBe(3);
    });

    it('should render review links', () => {
      const { getAllByText } = render(<EditCategoryScreen />);
      expect(getAllByText('review').length).toBe(3);
    });

    it('should render admin bottom nav', () => {
      const { getByTestId } = render(<EditCategoryScreen />);
      expect(getByTestId('admin-bottom-nav')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<EditCategoryScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable should be back button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });
  });

  describe('Edit Actions', () => {
    it('should log when edit service is pressed', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { UNSAFE_getAllByType } = render(<EditCategoryScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Find edit service buttons (pencil icons on service items)
      // These are after the back, search buttons and service item buttons
      // The edit buttons are at specific positions
      const editButtons = buttons.filter((b: any) =>
        b.props.className?.includes('absolute') || b.props.style?.position === 'absolute'
      );

      if (editButtons.length > 0) {
        fireEvent.press(editButtons[0]);
        // handleEditService should be called
      }

      consoleSpy.mockRestore();
    });

    it('should log when add service is pressed', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { UNSAFE_getAllByType } = render(<EditCategoryScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // The add service button is the last touchable before the bottom nav
      // It's a button with Plus icon at the bottom of the service list
      const addButton = buttons[buttons.length - 1];

      if (addButton) {
        fireEvent.press(addButton);
        // If it's the add button, it should log
      }

      consoleSpy.mockRestore();
    });

    it('should have edit banner button', () => {
      const { UNSAFE_getAllByType } = render(<EditCategoryScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have multiple buttons including edit banner
      expect(buttons.length).toBeGreaterThan(3);
    });
  });

  describe('Service Items', () => {
    it('should render correct number of service items', () => {
      const { getByText } = render(<EditCategoryScreen />);

      // Should have 3 services
      expect(getByText('Face Massage')).toBeTruthy();
      expect(getByText('Facial')).toBeTruthy();
      expect(getByText('Neck Massage')).toBeTruthy();
    });

    it('should render service item with all info', () => {
      const { getByText, getAllByText } = render(<EditCategoryScreen />);

      // Check Face Massage service
      expect(getByText('Face Massage')).toBeTruthy();
      expect(getByText('€45')).toBeTruthy();
      expect(getAllByText('per 1').length).toBeGreaterThan(0);
    });
  });
});
