import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Menu, ChevronLeft, Star, CheckCircle } from 'lucide-react-native';
import { hp, rf, wp } from '@/utils/responsive';
import { Colors } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts';
import { reviewApi, feedbackApi } from '@/api/reviewApi';

interface FeedbackParams {
  bookingId?: string;
  appointmentId?: string;
  paymentId?: string;
  receiptNumber?: string;
  total?: string;
  salonId?: string;
  serviceId?: string;
  stylistId?: string;
}

interface RatingCategory {
  id: string;
  label: string;
  rating: number;
}

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams() as FeedbackParams;
  const { user } = useAuth();

  const [ratings, setRatings] = useState<RatingCategory[]>([
    { id: 'experience', label: 'Rate your Experience', rating: 4 },
    { id: 'service', label: 'Rate Service', rating: 5 },
    { id: 'space', label: 'Rate space', rating: 5 },
    { id: 'stylist', label: 'Rate Stylist', rating: 3 },
  ]);
  const [comment, setComment] = useState('');
  const [needSupport, setNeedSupport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRating = (categoryId: string, newRating: number) => {
    setRatings(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, rating: newRating } : cat
      )
    );
  };

  const renderStars = (category: RatingCategory) => {
    return (
      <View className="flex-row" style={{ marginTop: hp(1) }}>
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

  const calculateOverallRating = () => {
    const totalRating = ratings.reduce((sum, cat) => sum + cat.rating, 0);
    return Math.round(totalRating / ratings.length);
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to submit feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = params.bookingId || params.appointmentId;

      if (bookingId) {
        const overallRating = calculateOverallRating();
        const serviceRating = ratings.find(r => r.id === 'service')?.rating || overallRating;
        const stylistRating = ratings.find(r => r.id === 'stylist')?.rating || overallRating;

        const apiResponse = await reviewApi.createReview({
          bookingId: bookingId,
          overallRating: overallRating,
          serviceRating: serviceRating,
          stylistRating: stylistRating,
          comment: comment || undefined,
        });

        if (apiResponse.success && apiResponse.data && apiResponse.data.id) {
          Alert.alert(
            'Thank You!',
            'Your review has been submitted successfully.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }

                Alert.alert('Submission Failed', apiResponse.message || 'Please try again later.');
        return;
      }

      if (needSupport || comment.trim()) {
        const apiResponse = await feedbackApi.createFeedback({
          type: needSupport ? 'complaint' : 'suggestion',
          subject: 'App Feedback',
          message: comment || 'General feedback submission',
        });

        if (apiResponse.success && apiResponse.data && apiResponse.data.id) {
          Alert.alert(
            'Thank You!',
            needSupport
              ? 'Our support team will contact you soon.'
              : 'Your feedback has been submitted successfully.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }

        Alert.alert('Submission Failed', apiResponse.message || 'Please try again later.');
        return;
      }

      Alert.alert('No Feedback', 'Please provide a comment or rating before submitting.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: insets.top + hp(1) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}>
            Feedback
          </Text>
          <View style={{ width: wp(7) }} />
        </View>

        {params.receiptNumber && (
          <View
            className="mx-6 mt-4 p-4 rounded-xl"
            style={{ backgroundColor: '#ECFDF5' }}
          >
            <View className="flex-row items-center">
              <CheckCircle size={rf(20)} color="#10B981" />
              <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#10B981', marginLeft: wp(2) }}>
                Payment Successful
              </Text>
            </View>
            <Text style={{ fontSize: rf(13), color: '#059669', marginTop: hp(0.5) }}>
              Receipt: {params.receiptNumber}
            </Text>
            {params.total && (
              <Text style={{ fontSize: rf(13), color: '#059669' }}>
                Total: ${params.total}
              </Text>
            )}
          </View>
        )}

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

          {ratings.map((category) => (
            <View key={category.id} style={{ marginTop: hp(3) }}>
              <Text style={{ fontSize: rf(14), color: '#6B7280' }}>
                {category.label}
              </Text>
              {renderStars(category)}
            </View>
          ))}

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
                color: '#000',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 rounded-full items-center justify-center"
            style={{
              backgroundColor: isSubmitting ? Colors.gray[300] : Colors.primary,
              paddingVertical: hp(1.5),
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
                Submit Feedback
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}
