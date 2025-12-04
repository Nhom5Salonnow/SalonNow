import React from 'react';
import { View, ViewStyle } from 'react-native';
import { wp, hp } from '@/utils/responsive';
import { Colors } from '@/constants';

type Position = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'custom';
type Size = 'small' | 'medium' | 'large' | 'xlarge';

interface DecorativeCircleProps {
  position?: Position;
  size?: Size;
  opacity?: number;
  color?: string;
  customStyle?: ViewStyle;
}

const SIZE_MAP: Record<Size, number> = {
  small: 50,
  medium: 65,
  large: 80,
  xlarge: 110,
};

const POSITION_MAP: Record<Exclude<Position, 'custom'>, ViewStyle> = {
  topLeft: { left: -wp(30), top: -hp(10) },
  topRight: { right: -wp(20), top: -hp(5) },
  bottomLeft: { left: -wp(30), bottom: hp(5) },
  bottomRight: { right: -wp(20), bottom: hp(10) },
};

export const DecorativeCircle: React.FC<DecorativeCircleProps> = ({
  position = 'topLeft',
  size = 'large',
  opacity = 0.4,
  color = Colors.salon.pinkLight,
  customStyle,
}) => {
  const sizeValue = SIZE_MAP[size];
  const positionStyle = position === 'custom' ? {} : POSITION_MAP[position];

  return (
    <View
      className="absolute rounded-full"
      style={[
        {
          width: wp(sizeValue),
          height: wp(sizeValue),
          backgroundColor: color,
          opacity,
        },
        positionStyle,
        customStyle,
      ]}
    />
  );
};
