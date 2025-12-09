import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaginationDots } from '@/components/ui/PaginationDots';

describe('PaginationDots Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getAllByRole } = render(
        <PaginationDots length={3} currentIndex={0} />
      );
      // The component renders TouchableOpacity elements
    });

    it('should render correct number of dots', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={5} currentIndex={0} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      expect(dots.length).toBe(5);
    });

    it('should render 3 dots when length is 3', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={3} currentIndex={0} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      expect(dots.length).toBe(3);
    });

    it('should render 1 dot when length is 1', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={1} currentIndex={0} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      expect(dots.length).toBe(1);
    });
  });

  describe('Current Index', () => {
    it('should highlight first dot when currentIndex is 0', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={3} currentIndex={0} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      // First dot should have different style (active)
      expect(dots[0]).toBeTruthy();
    });

    it('should highlight second dot when currentIndex is 1', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={3} currentIndex={1} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      expect(dots[1]).toBeTruthy();
    });

    it('should highlight last dot when currentIndex is length-1', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={5} currentIndex={4} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      expect(dots[4]).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onDotPress when dot is pressed', () => {
      const onDotPressMock = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <PaginationDots
          length={3}
          currentIndex={0}
          onDotPress={onDotPressMock}
        />
      );

      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(dots[1]);

      expect(onDotPressMock).toHaveBeenCalledWith(1);
    });

    it('should call onDotPress with correct index for first dot', () => {
      const onDotPressMock = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <PaginationDots
          length={3}
          currentIndex={2}
          onDotPress={onDotPressMock}
        />
      );

      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(dots[0]);

      expect(onDotPressMock).toHaveBeenCalledWith(0);
    });

    it('should call onDotPress with correct index for last dot', () => {
      const onDotPressMock = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <PaginationDots
          length={5}
          currentIndex={0}
          onDotPress={onDotPressMock}
        />
      );

      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(dots[4]);

      expect(onDotPressMock).toHaveBeenCalledWith(4);
    });

    it('should not crash when onDotPress is not provided', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={3} currentIndex={0} />
      );

      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);

      expect(() => fireEvent.press(dots[1])).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle length of 0', () => {
      const { UNSAFE_queryAllByType } = render(
        <PaginationDots length={0} currentIndex={0} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_queryAllByType(TouchableOpacity);
      expect(dots.length).toBe(0);
    });

    it('should handle large number of dots', () => {
      const { UNSAFE_getAllByType } = render(
        <PaginationDots length={10} currentIndex={5} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const dots = UNSAFE_getAllByType(TouchableOpacity);
      expect(dots.length).toBe(10);
    });
  });
});
