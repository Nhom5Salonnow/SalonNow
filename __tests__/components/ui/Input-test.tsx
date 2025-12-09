import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Enter text" />
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should render with label', () => {
      const { getByText, getByPlaceholderText } = render(
        <Input label="Email" placeholder="Enter email" />
      );
      expect(getByText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
    });

    it('should render without label when not provided', () => {
      const { queryByText, getByPlaceholderText } = render(
        <Input placeholder="Enter text" />
      );
      expect(queryByText('Email')).toBeNull();
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should render error message when provided', () => {
      const { getByText } = render(
        <Input placeholder="Enter text" error="This field is required" />
      );
      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should not render error message when not provided', () => {
      const { queryByText } = render(
        <Input placeholder="Enter text" />
      );
      expect(queryByText('This field is required')).toBeNull();
    });

    it('should render both label and error', () => {
      const { getByText } = render(
        <Input
          label="Password"
          placeholder="Enter password"
          error="Password is too short"
        />
      );
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Password is too short')).toBeTruthy();
    });
  });

  describe('Text Input', () => {
    it('should accept text input', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(
        <Input
          placeholder="Enter text"
          onChangeText={onChangeTextMock}
        />
      );

      fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello World');

      expect(onChangeTextMock).toHaveBeenCalledWith('Hello World');
    });

    it('should display value prop', () => {
      const { getByDisplayValue } = render(
        <Input placeholder="Enter text" value="Test Value" />
      );
      expect(getByDisplayValue('Test Value')).toBeTruthy();
    });

    it('should update displayed value when typing', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(
        <Input
          placeholder="Enter text"
          value=""
          onChangeText={onChangeTextMock}
        />
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent.changeText(input, 'New Text');

      expect(onChangeTextMock).toHaveBeenCalledWith('New Text');
    });
  });

  describe('Props Forwarding', () => {
    it('should accept secureTextEntry prop', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Password" secureTextEntry />
      );
      const input = getByPlaceholderText('Password');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should accept keyboardType prop', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Email" keyboardType="email-address" />
      );
      const input = getByPlaceholderText('Email');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should accept autoCapitalize prop', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Username" autoCapitalize="none" />
      );
      const input = getByPlaceholderText('Username');
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('should accept maxLength prop', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Code" maxLength={6} />
      );
      const input = getByPlaceholderText('Code');
      expect(input.props.maxLength).toBe(6);
    });

    it('should accept editable prop', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Read only" editable={false} />
      );
      const input = getByPlaceholderText('Read only');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should accept className prop', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Styled" className="custom-input" />
      );
      expect(getByPlaceholderText('Styled')).toBeTruthy();
    });
  });
});
