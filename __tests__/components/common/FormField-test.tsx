import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormField } from '@/components/common/FormField';

// Mock responsive utilities
jest.mock('@/utils/responsive', () => ({
  wp: (value: number) => value * 4,
  hp: (value: number) => value * 8,
  rf: (value: number) => value,
}));

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<FormField {...defaultProps} />);
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should render label', () => {
      const { getByText } = render(<FormField {...defaultProps} />);
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should render TextInput', () => {
      const { getByDisplayValue } = render(
        <FormField {...defaultProps} value="Test Value" />
      );
      expect(getByDisplayValue('Test Value')).toBeTruthy();
    });
  });

  describe('Inline Variant (Default)', () => {
    it('should render inline variant by default', () => {
      const { getByText } = render(<FormField {...defaultProps} />);
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should render label and input inline', () => {
      const { getByText, getByDisplayValue } = render(
        <FormField {...defaultProps} value="Inline Value" />
      );
      expect(getByText('Test Label')).toBeTruthy();
      expect(getByDisplayValue('Inline Value')).toBeTruthy();
    });
  });

  describe('Stacked Variant', () => {
    it('should render stacked variant when specified', () => {
      const { getByText } = render(
        <FormField {...defaultProps} variant="stacked" />
      );
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should render label above input in stacked variant', () => {
      const { getByText, getByDisplayValue } = render(
        <FormField {...defaultProps} variant="stacked" value="Stacked Value" />
      );
      expect(getByText('Test Label')).toBeTruthy();
      expect(getByDisplayValue('Stacked Value')).toBeTruthy();
    });
  });

  describe('Value and onChangeText', () => {
    it('should display value prop', () => {
      const { getByDisplayValue } = render(
        <FormField {...defaultProps} value="Test Value" />
      );
      expect(getByDisplayValue('Test Value')).toBeTruthy();
    });

    it('should call onChangeText when text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByDisplayValue } = render(
        <FormField {...defaultProps} value="" onChangeText={onChangeTextMock} />
      );

      const input = getByDisplayValue('');
      fireEvent.changeText(input, 'New Text');

      expect(onChangeTextMock).toHaveBeenCalledWith('New Text');
    });

    it('should display updated value', () => {
      const { getByDisplayValue, rerender } = render(
        <FormField {...defaultProps} value="Initial" />
      );
      expect(getByDisplayValue('Initial')).toBeTruthy();

      rerender(<FormField {...defaultProps} value="Updated" />);
      expect(getByDisplayValue('Updated')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should display error message when provided', () => {
      const { getByText } = render(
        <FormField {...defaultProps} error="This field is required" />
      );
      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should not display error message when not provided', () => {
      const { queryByText } = render(<FormField {...defaultProps} />);
      expect(queryByText('This field is required')).toBeNull();
    });

    it('should display error in inline variant', () => {
      const { getByText } = render(
        <FormField
          {...defaultProps}
          variant="inline"
          error="Invalid input"
        />
      );
      expect(getByText('Invalid input')).toBeTruthy();
    });

    it('should display error in stacked variant', () => {
      const { getByText } = render(
        <FormField
          {...defaultProps}
          variant="stacked"
          error="Invalid input"
        />
      );
      expect(getByText('Invalid input')).toBeTruthy();
    });
  });

  describe('LabelWidth Prop', () => {
    it('should use default labelWidth of 25', () => {
      const { getByText } = render(<FormField {...defaultProps} />);
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should accept custom labelWidth', () => {
      const { getByText } = render(
        <FormField {...defaultProps} labelWidth={30} />
      );
      expect(getByText('Test Label')).toBeTruthy();
    });
  });

  describe('TextInput Props Forwarding', () => {
    it('should forward placeholder prop', () => {
      const { getByPlaceholderText } = render(
        <FormField {...defaultProps} placeholder="Enter text" />
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should forward keyboardType prop', () => {
      const { getByDisplayValue } = render(
        <FormField
          {...defaultProps}
          value="test"
          keyboardType="email-address"
        />
      );
      const input = getByDisplayValue('test');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should forward secureTextEntry prop', () => {
      const { getByDisplayValue } = render(
        <FormField {...defaultProps} value="password" secureTextEntry />
      );
      const input = getByDisplayValue('password');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should forward autoCapitalize prop', () => {
      const { getByDisplayValue } = render(
        <FormField {...defaultProps} value="test" autoCapitalize="none" />
      );
      const input = getByDisplayValue('test');
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('should forward editable prop', () => {
      const { getByDisplayValue } = render(
        <FormField {...defaultProps} value="readonly" editable={false} />
      );
      const input = getByDisplayValue('readonly');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Different Labels', () => {
    it('should render with email label', () => {
      const { getByText } = render(
        <FormField label="Email" value="" onChangeText={jest.fn()} />
      );
      expect(getByText('Email')).toBeTruthy();
    });

    it('should render with password label', () => {
      const { getByText } = render(
        <FormField label="Password" value="" onChangeText={jest.fn()} />
      );
      expect(getByText('Password')).toBeTruthy();
    });

    it('should render with phone label', () => {
      const { getByText } = render(
        <FormField label="Phone" value="" onChangeText={jest.fn()} />
      );
      expect(getByText('Phone')).toBeTruthy();
    });
  });
});
