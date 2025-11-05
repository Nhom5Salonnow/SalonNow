import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 font-semibold mb-2">{label}</Text>}
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base ${
          error ? 'border-red-500' : ''
        } ${className || ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
