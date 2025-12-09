import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '@/components/ui/Loading';

// Mock constants
jest.mock('@/constants', () => ({
  Colors: {
    primary: '#FE697D',
  },
}));

describe('Loading Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_getByType } = render(<Loading />);
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should render ActivityIndicator', () => {
      const { UNSAFE_getByType } = render(<Loading />);
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe('Message Prop', () => {
    it('should display message when provided', () => {
      const { getByText } = render(<Loading message="Loading data..." />);
      expect(getByText('Loading data...')).toBeTruthy();
    });

    it('should not display message when not provided', () => {
      const { queryByText } = render(<Loading />);
      expect(queryByText('Loading data...')).toBeNull();
    });

    it('should display custom message', () => {
      const { getByText } = render(<Loading message="Please wait..." />);
      expect(getByText('Please wait...')).toBeTruthy();
    });
  });

  describe('FullScreen Prop', () => {
    it('should render fullScreen by default', () => {
      const { UNSAFE_getByType } = render(<Loading />);
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should render fullScreen when fullScreen={true}', () => {
      const { UNSAFE_getByType } = render(<Loading fullScreen={true} />);
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should render inline when fullScreen={false}', () => {
      const { UNSAFE_getByType } = render(<Loading fullScreen={false} />);
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe('Combinations', () => {
    it('should render fullScreen with message', () => {
      const { getByText, UNSAFE_getByType } = render(
        <Loading fullScreen={true} message="Loading..." />
      );
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      expect(getByText('Loading...')).toBeTruthy();
    });

    it('should render inline with message', () => {
      const { getByText, UNSAFE_getByType } = render(
        <Loading fullScreen={false} message="Processing..." />
      );
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      expect(getByText('Processing...')).toBeTruthy();
    });
  });
});
