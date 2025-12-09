import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<Button title="Test Button" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with title prop', () => {
      const { getByText } = render(<Button title="Click Me" />);
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should render with children instead of title', () => {
      const { getByText } = render(
        <Button>
          <Text>Custom Child</Text>
        </Button>
      );
      expect(getByText('Custom Child')).toBeTruthy();
    });

    it('should prefer children over title when both provided', () => {
      const { getByText, queryByText } = render(
        <Button title="Title Text">
          <Text>Child Text</Text>
        </Button>
      );
      expect(getByText('Child Text')).toBeTruthy();
      expect(queryByText('Title Text')).toBeNull();
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      const { getByText } = render(<Button title="Primary" />);
      // Button renders with primary styling by default
      expect(getByText('Primary')).toBeTruthy();
    });

    it('should render secondary variant', () => {
      const { getByText } = render(<Button title="Secondary" variant="secondary" />);
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('should render danger variant', () => {
      const { getByText } = render(<Button title="Danger" variant="danger" />);
      expect(getByText('Danger')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Press Me" onPress={onPressMock} />);

      fireEvent.press(getByText('Press Me'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is not provided', () => {
      const { getByText } = render(<Button title="No Handler" />);

      // Should not throw
      expect(() => fireEvent.press(getByText('No Handler'))).not.toThrow();
    });

    it('should handle multiple presses', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Multi Press" onPress={onPressMock} />);

      fireEvent.press(getByText('Multi Press'));
      fireEvent.press(getByText('Multi Press'));
      fireEvent.press(getByText('Multi Press'));

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Props Forwarding', () => {
    it('should accept and apply className prop', () => {
      const { getByText } = render(
        <Button title="Styled" className="custom-class" />
      );
      expect(getByText('Styled')).toBeTruthy();
    });

    it('should accept disabled prop', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Disabled" onPress={onPressMock} disabled />
      );

      const button = getByText('Disabled');
      expect(button).toBeTruthy();
    });

    it('should accept testID prop', () => {
      const { getByTestId } = render(
        <Button title="Test" testID="test-button" />
      );
      expect(getByTestId('test-button')).toBeTruthy();
    });
  });
});
