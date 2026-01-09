import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SalonCard } from '@/components/salon/SalonCard';

// Mock Card component
jest.mock('@/components/ui', () => ({
  Card: ({ children, variant, className }: any) => {
    const { View } = require('react-native');
    return <View testID="card">{children}</View>;
  },
}));

describe('SalonCard', () => {
  const mockSalon = {
    id: '1',
    name: 'Test Salon',
    address: '123 Test Street',
    rating: 4.5,
    distance: 2.3,
    imageUrl: 'https://example.com/image.jpg',
    services: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to verify it's called
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<SalonCard salon={mockSalon} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render salon name', () => {
      const { getByText } = render(<SalonCard salon={mockSalon} />);
      expect(getByText('Test Salon')).toBeTruthy();
    });

    it('should render salon address', () => {
      const { getByText } = render(<SalonCard salon={mockSalon} />);
      expect(getByText('123 Test Street')).toBeTruthy();
    });

    it('should render salon rating', () => {
      const { getByText } = render(<SalonCard salon={mockSalon} />);
      expect(getByText('⭐ 4.5')).toBeTruthy();
    });

    it('should render salon distance', () => {
      const { getByText } = render(<SalonCard salon={mockSalon} />);
      expect(getByText('2.3 km')).toBeTruthy();
    });

    it('should render availability indicator', () => {
      const { getByText } = render(<SalonCard salon={mockSalon} />);
      expect(getByText('Còn chỗ')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should log salon id when pressed', () => {
      const { UNSAFE_getAllByType } = render(<SalonCard salon={mockSalon} />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(console.log).toHaveBeenCalledWith('Navigate to salon:', '1');
    });
  });
});
