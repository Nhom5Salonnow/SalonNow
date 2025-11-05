import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-white rounded-2xl p-4',
    outlined: 'bg-white rounded-2xl p-4 border border-gray-200',
    elevated: 'bg-white rounded-2xl p-4 shadow-lg',
  };

  return (
    <View className={`${variantStyles[variant]} ${className || ''}`} {...props}>
      {children}
    </View>
  );
}
