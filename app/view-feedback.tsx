import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Menu, ChevronLeft, Star, Home, Grid, MessageSquare, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

interface RatingCategory {
  id: string;
  label: string;
  rating: number;
}

export default function ViewFeedbackScreen() {
  const [ratings] = useState<RatingCategory[]>([
    { id: 'experience', label: 'Rate your Experience', rating: 5 },
    { id: 'service', label: 'Rate Service', rating: 4 },
    { id: 'space', label: 'Rate space', rating: 4 },
    { id: 'stylist', label: 'Rate Stylist', rating: 3 },
  ]);
  const [comment] = useState('I have wonderful experience here.');

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={rf(20)}
            color="#F59E0B"
            fill={star <= rating ? '#F59E0B' : 'transparent'}
            style={{ marginRight: wp(1) }}
          />
        ))}
      </View>
    );
  };

  const handleChangeFeedback = () => {
    router.push('/feedback' as any);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circle */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(30),
          bottom: hp(5),
          width: wp(70),
          height: wp(70),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.3,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: wp(6), paddingTop: hp(6) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Menu size={rf(28)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}>
            Feedback
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={rf(24)} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Feedback Card */}
        <View
          className="mx-6 mt-8 rounded-3xl bg-white p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>
            Your Feedback
          </Text>

          {/* Rating Categories - Read Only */}
          {ratings.map((category) => (
            <View
              key={category.id}
              className="flex-row items-center justify-between"
              style={{ marginTop: hp(3) }}
            >
              <Text style={{ fontSize: rf(14), color: '#6B7280' }}>
                {category.label}
              </Text>
              {renderStars(category.rating)}
            </View>
          ))}

          {/* Comment Section - Read Only */}
          <View style={{ marginTop: hp(4) }}>
            <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
              Your Comment
            </Text>

            <View
              className="mt-3 p-4 rounded-xl"
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                minHeight: hp(12),
              }}
            >
              <Text style={{ fontSize: rf(14), color: '#000' }}>
                {comment}
              </Text>
            </View>
          </View>

          {/* Change Feedback Button */}
          <TouchableOpacity
            onPress={handleChangeFeedback}
            className="mt-6 rounded-full items-center justify-center"
            style={{ backgroundColor: '#0EA5E9', paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
              Change Feedback
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around"
        style={{
          paddingVertical: hp(2),
          paddingBottom: hp(3),
          backgroundColor: Colors.salon.pinkBg,
          borderTopLeftRadius: wp(6),
          borderTopRightRadius: wp(6),
        }}
      >
        <TouchableOpacity
          onPress={() => router.push('/home' as any)}
          className="items-center"
        >
          <Home size={rf(24)} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Grid size={rf(24)} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MessageSquare size={rf(24)} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <User size={rf(24)} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
