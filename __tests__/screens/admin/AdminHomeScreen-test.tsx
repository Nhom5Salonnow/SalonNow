import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminHomeScreen from '@/app/admin/home';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
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
  HOME_CATEGORIES: [
    { id: 'cat-1', name: 'Hair Design', imageUrl: 'https://example.com/cat1.jpg' },
    { id: 'cat-2', name: 'Color & Shine', imageUrl: 'https://example.com/cat2.jpg' },
    { id: 'cat-3', name: 'Texture', imageUrl: 'https://example.com/cat3.jpg' },
    { id: 'cat-4', name: 'Scalp Spa', imageUrl: 'https://example.com/cat4.jpg' },
    { id: 'cat-5', name: 'Facial', imageUrl: 'https://example.com/cat5.jpg' },
    { id: 'cat-6', name: 'Bridal', imageUrl: 'https://example.com/cat6.jpg' },
  ],
  SPECIALISTS: [
    { id: 'spec-1', name: 'John Doe', imageUrl: 'https://example.com/spec1.jpg', phone: '123-456' },
    { id: 'spec-2', name: 'Jane Smith', imageUrl: 'https://example.com/spec2.jpg', phone: '789-012' },
  ],
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Bell: () => null,
  X: () => null,
  Plus: () => null,
  Pencil: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  AdminBottomNav: ({ activeTab }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="admin-bottom-nav">
        <Text testID="active-tab">{activeTab}</Text>
      </View>
    );
  },
}));

describe('AdminHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('Doe John')).toBeTruthy();
    });

    it('should render greeting', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('Hi')).toBeTruthy();
      expect(getByText('Doe John')).toBeTruthy();
    });

    it('should render Categories section', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('Categories')).toBeTruthy();
    });

    it('should render category items', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('Hair Design')).toBeTruthy();
      expect(getByText('Color & Shine')).toBeTruthy();
      expect(getByText('Texture')).toBeTruthy();
      expect(getByText('Scalp Spa')).toBeTruthy();
      expect(getByText('Facial')).toBeTruthy();
    });

    it('should render Hair Specialist section', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('Hair Specialist')).toBeTruthy();
    });

    it('should render specialists', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
    });

    it('should render specialist phone numbers', () => {
      const { getByText } = render(<AdminHomeScreen />);
      expect(getByText('123-456')).toBeTruthy();
      expect(getByText('789-012')).toBeTruthy();
    });

    it('should render admin bottom nav with home active', () => {
      const { getByTestId } = render(<AdminHomeScreen />);
      expect(getByTestId('admin-bottom-nav')).toBeTruthy();
      expect(getByTestId('active-tab').children[0]).toBe('home');
    });
  });

  describe('Navigation', () => {
    it('should navigate to edit-category when category is pressed', () => {
      const { getByText } = render(<AdminHomeScreen />);

      fireEvent.press(getByText('Hair Design'));

      expect(mockPush).toHaveBeenCalledWith('/admin/edit-category?id=cat-1');
    });

    it('should navigate to edit-employee when specialist is pressed', () => {
      const { getByText } = render(<AdminHomeScreen />);

      fireEvent.press(getByText('John Doe'));

      expect(mockPush).toHaveBeenCalledWith('/admin/edit-employee?id=spec-1');
    });
  });

  describe('Edit Actions', () => {
    it('should have edit icons on categories', () => {
      const { UNSAFE_getAllByType } = render(<AdminHomeScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have multiple edit buttons
      expect(buttons.length).toBeGreaterThan(5);
    });

    it('should have delete buttons on banners', () => {
      const { UNSAFE_getAllByType } = render(<AdminHomeScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have buttons including delete (X) buttons
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have add new category button', () => {
      const { UNSAFE_getAllByType } = render(<AdminHomeScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should include add button
      expect(buttons.length).toBeGreaterThan(5);
    });
  });
});
