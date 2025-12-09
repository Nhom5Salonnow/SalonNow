import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { wp, hp, rf } from '@/utils/responsive';

interface FormFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  labelWidth?: number;
  variant?: 'inline' | 'stacked';
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  labelWidth = 25,
  variant = 'inline',
  error,
  ...textInputProps
}) => {
  if (variant === 'stacked') {
    return (
      <View style={{ marginBottom: hp(2) }}>
        <Text
          style={{
            fontSize: rf(14),
            color: '#6B7280',
            marginBottom: hp(0.5),
          }}
        >
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="rounded-xl bg-gray-50 px-4"
          style={{
            paddingVertical: hp(1.5),
            fontSize: rf(14),
            borderWidth: 1,
            borderColor: error ? '#EF4444' : '#E5E7EB',
          }}
          placeholderTextColor="#9CA3AF"
          {...textInputProps}
        />
        {error && (
          <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>
            {error}
          </Text>
        )}
      </View>
    );
  }

  // Inline variant (label on left, input on right)
  return (
    <View style={{ marginBottom: hp(3) }}>
      <View className="flex-row items-center">
        <Text
          style={{
            fontSize: rf(16),
            color: '#000',
            width: wp(labelWidth),
          }}
        >
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="flex-1 rounded-full bg-gray-50 px-4"
          style={{
            paddingVertical: hp(1.5),
            fontSize: rf(14),
            borderWidth: 1,
            borderColor: error ? '#EF4444' : '#E5E7EB',
          }}
          placeholderTextColor="#9CA3AF"
          {...textInputProps}
        />
      </View>
      {error && (
        <Text
          style={{
            fontSize: rf(12),
            color: '#EF4444',
            marginTop: hp(0.5),
            marginLeft: wp(labelWidth),
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
