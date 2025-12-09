import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '@/components/ui/Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should render children correctly', () => {
      const { getByText } = render(
        <Card>
          <Text>Title</Text>
          <Text>Description</Text>
        </Card>
      );
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
    });

    it('should render multiple children', () => {
      const { getByText } = render(
        <Card>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
          <Text>Item 3</Text>
        </Card>
      );
      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
      expect(getByText('Item 3')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      const { getByText } = render(
        <Card>
          <Text>Default Card</Text>
        </Card>
      );
      expect(getByText('Default Card')).toBeTruthy();
    });

    it('should render outlined variant', () => {
      const { getByText } = render(
        <Card variant="outlined">
          <Text>Outlined Card</Text>
        </Card>
      );
      expect(getByText('Outlined Card')).toBeTruthy();
    });

    it('should render elevated variant', () => {
      const { getByText } = render(
        <Card variant="elevated">
          <Text>Elevated Card</Text>
        </Card>
      );
      expect(getByText('Elevated Card')).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should accept className prop', () => {
      const { getByText } = render(
        <Card className="custom-class">
          <Text>Styled Card</Text>
        </Card>
      );
      expect(getByText('Styled Card')).toBeTruthy();
    });

    it('should accept testID prop', () => {
      const { getByTestId } = render(
        <Card testID="test-card">
          <Text>Test Card</Text>
        </Card>
      );
      expect(getByTestId('test-card')).toBeTruthy();
    });

    it('should forward additional ViewProps', () => {
      const onLayoutMock = jest.fn();
      const { getByText } = render(
        <Card onLayout={onLayoutMock}>
          <Text>Card with Layout</Text>
        </Card>
      );
      expect(getByText('Card with Layout')).toBeTruthy();
    });
  });

  describe('Nested Content', () => {
    it('should render nested components', () => {
      const { getByText } = render(
        <Card>
          <Card variant="outlined">
            <Text>Nested Card</Text>
          </Card>
        </Card>
      );
      expect(getByText('Nested Card')).toBeTruthy();
    });
  });
});
