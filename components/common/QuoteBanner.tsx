import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

interface QuoteBannerProps {
  quote: string;
  imageUrl: string;
  backgroundColor?: string;
  height?: number;
  editable?: boolean;
  onEditPress?: () => void;
}

const DEFAULT_IMAGE = 'https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298';

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  quote,
  imageUrl = DEFAULT_IMAGE,
  backgroundColor = Colors.primary,
  height = 20,
  editable = false,
  onEditPress,
}) => {
  return (
    <View className="relative" style={{ marginHorizontal: wp(4) }}>
      <View
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor, height: hp(height) }}
      >
        <View className="flex-row h-full">
          <View className="flex-1 justify-center" style={{ paddingLeft: wp(5) }}>
            <Text
              style={{
                fontSize: rf(16),
                fontStyle: 'italic',
                color: '#000',
                lineHeight: rf(24),
              }}
            >
              {quote}
            </Text>
          </View>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: wp(40), height: '100%' }}
            resizeMode="cover"
          />
        </View>
      </View>

      {editable && (
        <TouchableOpacity
          onPress={onEditPress}
          className="absolute rounded-full items-center justify-center bg-white"
          style={{
            top: -wp(2),
            right: wp(2),
            width: wp(8),
            height: wp(8),
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          <Pencil size={rf(14)} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};
