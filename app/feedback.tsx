import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Menu, ChevronLeft, Star, CheckCircle } from 'lucide-react-native';
import { hp, rf, wp } from '@/utils/responsive';

interface RatingCategory {
  id: string;
  label: string;
  rating: number;
}

export default function FeedbackScreen() {
  const [ratings, setRatings] = useState<RatingCategory[]>([
    { id: 'experience', label: 'Rate your Experience', rating: 4 },
    { id: 'service', label: 'Rate Service', rating: 5 },
    { id: 'space', label: 'Rate space', rating: 5 },
    { id: 'stylist', label: 'Rate Stylist', rating: 3 },
  ]);
  const [comment, setComment] = useState('');
  const [needSupport, setNeedSupport] = useState(true);

  const updateRating = (categoryId: string, newRating: number) => {
    setRatings(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, rating: newRating } : cat
      )
    );
  };

  const renderStars = (category: RatingCategory) => {
    return (
      <View className="flex-row mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => updateRating(category.id, star)}
            className="mr-1"
          >
            <Star
              size={24}
              color="#F59E0B"
              fill={star <= category.rating ? '#F59E0B' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSubmit = () => {
    // Submit feedback
    console.log('Feedback submitted:', { ratings, comment, needSupport });
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: hp(6) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Menu size={28} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}>
            Feedback
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Feedback Form */}
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
            Share Your Feedback
          </Text>

          {/* Rating Categories */}
          {ratings.map((category) => (
            <View key={category.id} style={{ marginTop: hp(3) }}>
              <Text style={{ fontSize: rf(14), color: '#6B7280' }}>
                {category.label}
              </Text>
              {renderStars(category)}
            </View>
          ))}

          {/* Comment Section */}
          <View style={{ marginTop: hp(3) }}>
            <View className="flex-row items-center justify-between">
              <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
                Your Comment
              </Text>
              <TouchableOpacity
                onPress={() => setNeedSupport(!needSupport)}
                className="flex-row items-center"
              >
                <View
                  className="rounded-full mr-2 items-center justify-center"
                  style={{
                    width: wp(5),
                    height: wp(5),
                    backgroundColor: needSupport ? '#22C55E' : '#E5E7EB',
                  }}
                >
                  {needSupport && <CheckCircle size={rf(14)} color="#fff" />}
                </View>
                <Text style={{ fontSize: rf(12), color: '#6B7280' }}>
                  Need Quick{'\n'}Support
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Describe your experience here"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              className="mt-3 p-4 rounded-xl"
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                fontSize: rf(14),
                textAlignVertical: 'top',
                minHeight: hp(12),
              }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="mt-6 rounded-full items-center justify-center"
            style={{ backgroundColor: '#0EA5E9', paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
              Submit Feedback
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}
