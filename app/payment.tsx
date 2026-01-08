import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CreditCard, Plus, Trash2, Tag, Check, X } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { AuthGuard } from '@/components';
import { useAuth } from '@/contexts';
import { paymentService, PaymentSummary } from '@/api/paymentService';
import { PaymentMethod } from '@/api/mockServer/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PaymentParams {
  appointmentId?: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: string;
  salonName?: string;
  date?: string;
  time?: string;
  staffName?: string;
}

function PaymentContent() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams() as PaymentParams;
  const { user } = useAuth();
  const userId = user?.id || 'user-1';
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoDescription, setPromoDescription] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Tip state
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const tipOptions = [0, 5, 10, 15, 20];

  // Service details from params or defaults
  const serviceName = params.serviceName || 'Hair Spa';
  const servicePrice = parseFloat(params.servicePrice || '40');

  const loadPaymentMethods = useCallback(async (uid: string) => {
    try {
      const res = await paymentService.getPaymentMethods(uid);
      if (res.success && res.data) {
        setPaymentMethods(res.data);
        // Select default method
        const defaultMethod = res.data.find(m => m.isDefault);
        if (defaultMethod) {
          setSelectedMethodId(defaultMethod.id);
        } else if (res.data.length > 0) {
          setSelectedMethodId(res.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  }, []);

  const calculateSummary = useCallback(async () => {
    try {
      const discount = promoDiscount > 0 ? (servicePrice * promoDiscount / 100) : 0;
      const res = await paymentService.calculateSummary(servicePrice, discount, selectedTip);
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (error) {
      console.error('Error calculating summary:', error);
    }
  }, [servicePrice, promoDiscount, selectedTip]);

  useEffect(() => {
    const init = async () => {
      await loadPaymentMethods(userId);
      setIsLoading(false);
    };
    init();
  }, [userId, loadPaymentMethods]);

  useEffect(() => {
    calculateSummary();
  }, [calculateSummary]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidatingPromo(true);
    setPromoError('');

    try {
      const res = await paymentService.validatePromoCode(promoCode);
      if (res.success && res.data.valid) {
        setPromoDiscount(res.data.discount);
        setPromoDescription(res.data.description);
      } else {
        setPromoError('Invalid promo code');
        setPromoDiscount(0);
        setPromoDescription('');
      }
    } catch (error) {
      setPromoError('Error validating code');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoDescription('');
    setPromoError('');
  };

  const handleRemoveCard = async (methodId: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const res = await paymentService.removePaymentMethod(methodId, userId);
            if (res.success) {
              await loadPaymentMethods(userId);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (methodId: string) => {
    const res = await paymentService.setDefaultPaymentMethod(methodId, userId);
    if (res.success) {
      await loadPaymentMethods(userId);
    }
  };

  const handleBookNow = async () => {
    if (!selectedMethodId) {
      Alert.alert('Payment Method Required', 'Please select or add a payment method to continue.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await paymentService.processPayment({
        appointmentId: params.appointmentId || 'apt-temp',
        userId,
        paymentMethodId: selectedMethodId,
        amount: servicePrice,
        tip: selectedTip,
      });

      if (res.success) {
        // Navigate to feedback with payment details
        router.push({
          pathname: '/feedback',
          params: {
            paymentId: res.data.id,
            receiptNumber: res.data.receiptNumber,
            total: res.data.total.toString(),
          },
        } as any);
      } else {
        Alert.alert('Payment Failed', res.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Payment Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return (
          <View className="items-center justify-center" style={{ width: wp(12), height: wp(8) }}>
            <Text style={{ fontSize: rf(14), fontWeight: 'bold', color: '#1A1F71', fontStyle: 'italic' }}>VISA</Text>
          </View>
        );
      case 'mastercard':
        return (
          <View className="flex-row items-center">
            <View className="rounded-full" style={{ width: wp(6), height: wp(6), backgroundColor: '#EB001B' }} />
            <View className="rounded-full -ml-2" style={{ width: wp(6), height: wp(6), backgroundColor: '#F79E1B' }} />
          </View>
        );
      case 'amex':
        return (
          <View className="items-center justify-center rounded" style={{ width: wp(12), height: wp(8), backgroundColor: '#006FCF' }}>
            <Text style={{ fontSize: rf(10), fontWeight: 'bold', color: '#FFF' }}>AMEX</Text>
          </View>
        );
      case 'jcb':
        return (
          <View className="items-center justify-center rounded" style={{ width: wp(12), height: wp(8), backgroundColor: '#0E4C96' }}>
            <Text style={{ fontSize: rf(10), fontWeight: 'bold', color: '#FFF' }}>JCB</Text>
          </View>
        );
      default:
        return <CreditCard size={rf(24)} color={Colors.gray[400]} />;
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Pink decorative background */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(20),
          top: -hp(10),
          width: wp(80),
          height: wp(80),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.4,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center px-5"
          style={{ paddingTop: insets.top + hp(1), gap: wp(3) }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full items-center justify-center"
            style={{ width: wp(10), height: wp(10), backgroundColor: Colors.gray[100] }}
          >
            <ChevronLeft size={rf(20)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>Payment</Text>
        </View>

        {/* Service Summary */}
        {params.serviceName && (
          <View
            className="mx-5 rounded-2xl p-4"
            style={{ marginTop: hp(3), backgroundColor: Colors.salon.pinkBg }}
          >
            <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>{serviceName}</Text>
            {params.salonName && (
              <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.5) }}>
                at {params.salonName}
              </Text>
            )}
            {params.date && params.time && (
              <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.3) }}>
                {params.date} • {params.time}
              </Text>
            )}
            {params.staffName && (
              <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.3) }}>
                with {params.staffName}
              </Text>
            )}
          </View>
        )}

        {/* Promo Code Section */}
        <View className="px-5" style={{ marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000', marginBottom: hp(1.5) }}>
            Promo Code
          </Text>

          {promoDiscount > 0 ? (
            <View
              className="flex-row items-center justify-between rounded-xl p-3"
              style={{ backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#10B981' }}
            >
              <View className="flex-row items-center">
                <Tag size={rf(16)} color="#10B981" />
                <View style={{ marginLeft: wp(2) }}>
                  <Text style={{ fontSize: rf(14), fontWeight: '600', color: '#10B981' }}>
                    {promoCode.toUpperCase()} - {promoDiscount}% OFF
                  </Text>
                  <Text style={{ fontSize: rf(12), color: '#059669' }}>{promoDescription}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleRemovePromo}>
                <X size={rf(18)} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center" style={{ gap: wp(2) }}>
              <TextInput
                value={promoCode}
                onChangeText={(text) => {
                  setPromoCode(text);
                  setPromoError('');
                }}
                placeholder="Enter promo code"
                placeholderTextColor={Colors.gray[400]}
                className="flex-1 rounded-xl px-4"
                style={{
                  height: hp(6),
                  fontSize: rf(14),
                  backgroundColor: Colors.gray[100],
                  color: '#000',
                }}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                onPress={handleApplyPromo}
                disabled={isValidatingPromo || !promoCode.trim()}
                className="rounded-xl items-center justify-center"
                style={{
                  height: hp(6),
                  paddingHorizontal: wp(4),
                  backgroundColor: promoCode.trim() ? Colors.primary : Colors.gray[300],
                }}
              >
                {isValidatingPromo ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={{ fontSize: rf(14), fontWeight: '600', color: '#FFF' }}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {promoError ? (
            <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{promoError}</Text>
          ) : null}
        </View>

        {/* Tip Section */}
        <View className="px-5" style={{ marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000', marginBottom: hp(1.5) }}>
            Add a Tip
          </Text>
          <View className="flex-row" style={{ gap: wp(2) }}>
            {tipOptions.map((tip) => (
              <TouchableOpacity
                key={tip}
                onPress={() => setSelectedTip(tip)}
                className="flex-1 rounded-xl items-center justify-center"
                style={{
                  paddingVertical: hp(1.5),
                  backgroundColor: selectedTip === tip ? Colors.primary : Colors.gray[100],
                  borderWidth: selectedTip === tip ? 0 : 1,
                  borderColor: Colors.gray[200],
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    fontWeight: '600',
                    color: selectedTip === tip ? '#FFF' : Colors.gray[600],
                  }}
                >
                  {tip === 0 ? 'No Tip' : `$${tip}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="px-5" style={{ marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000', marginBottom: hp(1.5) }}>
            Order Summary
          </Text>

          <View className="rounded-2xl p-4" style={{ backgroundColor: Colors.gray[50] }}>
            <View className="flex-row justify-between mb-2">
              <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>{serviceName}</Text>
              <Text style={{ fontSize: rf(14), fontWeight: '500', color: '#000' }}>
                ${servicePrice.toFixed(2)}
              </Text>
            </View>

            {selectedTip > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>Tip</Text>
                <Text style={{ fontSize: rf(14), fontWeight: '500', color: '#000' }}>
                  ${selectedTip.toFixed(2)}
                </Text>
              </View>
            )}

            {promoDiscount > 0 && summary && (
              <View className="flex-row justify-between mb-2">
                <Text style={{ fontSize: rf(14), color: '#10B981' }}>Discount ({promoDiscount}%)</Text>
                <Text style={{ fontSize: rf(14), fontWeight: '500', color: '#10B981' }}>
                  -${summary.discount.toFixed(2)}
                </Text>
              </View>
            )}

            {summary && (
              <View className="flex-row justify-between mb-2">
                <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>Tax (10%)</Text>
                <Text style={{ fontSize: rf(14), fontWeight: '500', color: '#000' }}>
                  ${summary.tax.toFixed(2)}
                </Text>
              </View>
            )}

            <View
              className="flex-row justify-between pt-3 mt-2"
              style={{ borderTopWidth: 1, borderTopColor: Colors.gray[200] }}
            >
              <Text style={{ fontSize: rf(16), fontWeight: '700', color: '#000' }}>Total</Text>
              <Text style={{ fontSize: rf(16), fontWeight: '700', color: Colors.primary }}>
                ${summary?.total.toFixed(2) || '0.00'}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View className="px-5" style={{ marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000', marginBottom: hp(1.5) }}>
            Payment Method
          </Text>

          {/* Payment Method Cards */}
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethodId(method.id)}
              className="flex-row items-center rounded-2xl p-4 mb-3"
              style={{
                borderWidth: selectedMethodId === method.id ? 2 : 1,
                borderColor: selectedMethodId === method.id ? Colors.primary : Colors.gray[200],
                backgroundColor: '#FFF',
              }}
            >
              {/* Selection indicator */}
              <View
                className="rounded-full items-center justify-center"
                style={{
                  width: wp(5),
                  height: wp(5),
                  borderWidth: 2,
                  borderColor: selectedMethodId === method.id ? Colors.primary : Colors.gray[300],
                  backgroundColor: selectedMethodId === method.id ? Colors.primary : 'transparent',
                }}
              >
                {selectedMethodId === method.id && (
                  <Check size={rf(12)} color="#FFF" />
                )}
              </View>

              {/* Card Logo */}
              <View
                className="rounded-lg overflow-hidden items-center justify-center"
                style={{ width: wp(14), height: wp(9), marginLeft: wp(3), backgroundColor: Colors.gray[100] }}
              >
                {getCardIcon(method.cardBrand || 'visa')}
              </View>

              {/* Card Info */}
              <View style={{ flex: 1, marginLeft: wp(3) }}>
                <Text style={{ fontSize: rf(14), fontWeight: '600', color: '#000' }}>
                  {(method.cardBrand || 'Card').charAt(0).toUpperCase() + (method.cardBrand || 'card').slice(1)} •••• {method.lastFourDigits}
                </Text>
                <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>
                  Expires {method.expiryMonth}/{method.expiryYear}
                </Text>
              </View>

              {/* Default badge or actions */}
              {method.isDefault ? (
                <View
                  className="rounded-full px-2 py-1"
                  style={{ backgroundColor: Colors.salon.pinkBg }}
                >
                  <Text style={{ fontSize: rf(10), color: Colors.primary, fontWeight: '600' }}>Default</Text>
                </View>
              ) : (
                <View className="flex-row items-center" style={{ gap: wp(2) }}>
                  <TouchableOpacity onPress={() => handleSetDefault(method.id)}>
                    <Text style={{ fontSize: rf(12), color: Colors.primary }}>Set Default</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveCard(method.id)}>
                    <Trash2 size={rf(16)} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Add New Card */}
          <TouchableOpacity
            onPress={() => router.push('/add-card' as any)}
            className="flex-row items-center justify-center rounded-2xl p-4"
            style={{ borderWidth: 1, borderColor: Colors.gray[300], borderStyle: 'dashed' }}
          >
            <Plus size={rf(18)} color={Colors.primary} />
            <Text style={{ fontSize: rf(14), color: Colors.primary, marginLeft: wp(2), fontWeight: '500' }}>
              Add New Card
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(20) }} />
      </ScrollView>

      {/* Book Now Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{ paddingBottom: hp(4), paddingTop: hp(2), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={handleBookNow}
          disabled={isProcessing || !selectedMethodId}
          className="rounded-full items-center justify-center"
          style={{
            backgroundColor: isProcessing || !selectedMethodId ? Colors.gray[300] : Colors.primary,
            paddingVertical: hp(2),
          }}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
              Pay ${summary?.total.toFixed(2) || '0.00'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PaymentScreen() {
  return (
    <AuthGuard message="Please login to proceed with payment">
      <PaymentContent />
    </AuthGuard>
  );
}
