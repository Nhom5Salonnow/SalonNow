import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SpecialistCard } from '@/components/salon/SpecialistCard';

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Phone: ({ size, color }: any) => {
    const { View } = require('react-native');
    return <View testID="phone-icon" />;
  },
  Star: ({ size, color, fill }: any) => {
    const { View } = require('react-native');
    return <View testID="star-icon" />;
  },
}));

describe('SpecialistCard Component', () => {
  const defaultProps = {
    name: 'John Doe',
    imageUrl: 'https://example.com/john.jpg',
    phone: '+1234567890',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<SpecialistCard {...defaultProps} />);
      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should render specialist name', () => {
      const { getByText } = render(<SpecialistCard {...defaultProps} />);
      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should render phone number', () => {
      const { getByText } = render(<SpecialistCard {...defaultProps} />);
      expect(getByText('+1234567890')).toBeTruthy();
    });

    it('should render Image component', () => {
      const { UNSAFE_getByType } = render(<SpecialistCard {...defaultProps} />);
      const Image = require('react-native').Image;
      expect(UNSAFE_getByType(Image)).toBeTruthy();
    });

    it('should render phone icon', () => {
      const { getByTestId } = render(<SpecialistCard {...defaultProps} />);
      expect(getByTestId('phone-icon')).toBeTruthy();
    });
  });

  describe('Rating', () => {
    it('should not render stars when rating is 0', () => {
      const { queryAllByTestId } = render(
        <SpecialistCard {...defaultProps} rating={0} />
      );
      // When rating is 0, stars should not be rendered
      const stars = queryAllByTestId('star-icon');
      expect(stars.length).toBe(0);
    });

    it('should render stars when rating is greater than 0', () => {
      const { getAllByTestId } = render(
        <SpecialistCard {...defaultProps} rating={2} />
      );
      const stars = getAllByTestId('star-icon');
      expect(stars.length).toBe(3); // Always renders 3 stars
    });

    it('should render 3 stars for any positive rating', () => {
      const { getAllByTestId } = render(
        <SpecialistCard {...defaultProps} rating={1} />
      );
      const stars = getAllByTestId('star-icon');
      expect(stars.length).toBe(3);
    });

    it('should use default rating of 0 when not provided', () => {
      const { queryAllByTestId } = render(
        <SpecialistCard {...defaultProps} />
      );
      const stars = queryAllByTestId('star-icon');
      expect(stars.length).toBe(0);
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <SpecialistCard {...defaultProps} onPress={onPressMock} />
      );

      fireEvent.press(getByText('John Doe'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is not provided', () => {
      const { getByText } = render(<SpecialistCard {...defaultProps} />);

      expect(() => fireEvent.press(getByText('John Doe'))).not.toThrow();
    });
  });

  describe('Different Props', () => {
    it('should render different specialist name', () => {
      const { getByText } = render(
        <SpecialistCard {...defaultProps} name="Jane Smith" />
      );
      expect(getByText('Jane Smith')).toBeTruthy();
    });

    it('should render different phone number', () => {
      const { getByText } = render(
        <SpecialistCard {...defaultProps} phone="+9876543210" />
      );
      expect(getByText('+9876543210')).toBeTruthy();
    });

    it('should render with different image URL', () => {
      const { UNSAFE_getByType } = render(
        <SpecialistCard {...defaultProps} imageUrl="https://new-url.com/image.png" />
      );
      const Image = require('react-native').Image;
      const image = UNSAFE_getByType(Image);
      expect(image.props.source.uri).toBe('https://new-url.com/image.png');
    });
  });
});
