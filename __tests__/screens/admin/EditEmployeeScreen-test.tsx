import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditEmployeeScreen from '@/app/admin/edit-employee';

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
  Pencil: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock components
jest.mock('@/components', () => ({
  FormField: ({ label, value, onChangeText, keyboardType, autoCapitalize }: any) => {
    const { View, Text, TextInput } = require('react-native');
    return (
      <View testID={`form-field-${label.toLowerCase().replace(' ', '-')}`}>
        <Text>{label}</Text>
        <TextInput
          testID={`input-${label.toLowerCase().replace(' ', '-')}`}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    );
  },
  AdminBottomNav: () => {
    const { View } = require('react-native');
    return <View testID="admin-bottom-nav" />;
  },
}));

describe('EditEmployeeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<EditEmployeeScreen />);
      expect(getByText('Doe John')).toBeTruthy();
    });

    it('should render employee name in header', () => {
      const { getByText } = render(<EditEmployeeScreen />);
      expect(getByText('Doe John')).toBeTruthy();
    });

    it('should render Full Name field', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      expect(getByTestId('form-field-full-name')).toBeTruthy();
    });

    it('should render Age field', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      expect(getByTestId('form-field-age')).toBeTruthy();
    });

    it('should render Phone field', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      expect(getByTestId('form-field-phone')).toBeTruthy();
    });

    it('should render Email field', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      expect(getByTestId('form-field-email')).toBeTruthy();
    });

    it('should render Delete button', () => {
      const { getByText } = render(<EditEmployeeScreen />);
      expect(getByText('Delete')).toBeTruthy();
    });

    it('should render Save button', () => {
      const { getByText } = render(<EditEmployeeScreen />);
      expect(getByText('Save')).toBeTruthy();
    });

    it('should render admin bottom nav', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      expect(getByTestId('admin-bottom-nav')).toBeTruthy();
    });

    it('should show default values in form fields', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);

      const nameInput = getByTestId('input-full-name');
      const ageInput = getByTestId('input-age');
      const phoneInput = getByTestId('input-phone');
      const emailInput = getByTestId('input-email');

      expect(nameInput.props.value).toBe('Doe John');
      expect(ageInput.props.value).toBe('22');
      expect(phoneInput.props.value).toBe('11111.99999');
      expect(emailInput.props.value).toBe('Do22@gmail.com');
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<EditEmployeeScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable should be back button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });
  });

  describe('Form Input', () => {
    it('should update Full Name when typing', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      const input = getByTestId('input-full-name');

      fireEvent.changeText(input, 'John Smith');

      expect(input.props.value).toBe('John Smith');
    });

    it('should update Age when typing', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      const input = getByTestId('input-age');

      fireEvent.changeText(input, '25');

      expect(input.props.value).toBe('25');
    });

    it('should update Phone when typing', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      const input = getByTestId('input-phone');

      fireEvent.changeText(input, '1234567890');

      expect(input.props.value).toBe('1234567890');
    });

    it('should update Email when typing', () => {
      const { getByTestId } = render(<EditEmployeeScreen />);
      const input = getByTestId('input-email');

      fireEvent.changeText(input, 'new@email.com');

      expect(input.props.value).toBe('new@email.com');
    });
  });

  describe('Actions', () => {
    it('should call handleSave and go back when Save is pressed', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { getByText } = render(<EditEmployeeScreen />);

      fireEvent.press(getByText('Save'));

      expect(consoleSpy).toHaveBeenCalledWith('Saving employee:', {
        fullName: 'Doe John',
        age: '22',
        phone: '11111.99999',
        email: 'Do22@gmail.com',
      });
      expect(mockBack).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should call handleDelete and go back when Delete is pressed', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { getByText } = render(<EditEmployeeScreen />);

      fireEvent.press(getByText('Delete'));

      expect(consoleSpy).toHaveBeenCalledWith('Deleting employee');
      expect(mockBack).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should save updated values when Save is pressed after editing', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { getByText, getByTestId } = render(<EditEmployeeScreen />);

      // Update fields
      fireEvent.changeText(getByTestId('input-full-name'), 'Jane Doe');
      fireEvent.changeText(getByTestId('input-age'), '30');

      // Save
      fireEvent.press(getByText('Save'));

      expect(consoleSpy).toHaveBeenCalledWith('Saving employee:', {
        fullName: 'Jane Doe',
        age: '30',
        phone: '11111.99999',
        email: 'Do22@gmail.com',
      });

      consoleSpy.mockRestore();
    });
  });
});
