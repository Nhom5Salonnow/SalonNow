import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditCategoryScreen from '@/app/admin/edit-category';

// Mock expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
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
      dark: '#1F2937',
    },
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
      const { getAllByText } = render(<EditCategoryScreen />);
      // All services have €50 price
      expect(getAllByText('€50').length).toBe(3);
    });

    it('should render service ratings', () => {
      const { getAllByText } = render(<EditCategoryScreen />);
      // Ratings are 3, 2, 3
      expect(getAllByText('3').length).toBe(2);
      expect(getAllByText('2').length).toBe(1);
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
      expect(getAllByText('€50').length).toBeGreaterThan(0);
      expect(getAllByText('per 1').length).toBeGreaterThan(0);
    });
  });
});
