import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, CreditCard, Lock } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { AuthGuard } from '@/components';
import { useAuth } from '@/contexts';
import { paymentService } from '@/api/paymentService';

function AddCardContent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const detectCardType = (number: string): string => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (['51', '52', '53', '54', '55'].some(p => cleaned.startsWith(p))) return 'mastercard';
    if (['34', '37'].some(p => cleaned.startsWith(p))) return 'amex';
    if (cleaned.startsWith('35')) return 'jcb';
    return 'unknown';
  };

  const getCardIcon = () => {
    const type = detectCardType(cardNumber);
    switch (type) {
      case 'visa':
        return (
          <View className="items-center justify-center" style={{ width: wp(10), height: wp(6) }}>
            <Text style={{ fontSize: rf(12), fontWeight: 'bold', color: '#1A1F71', fontStyle: 'italic' }}>VISA</Text>
          </View>
        );
      case 'mastercard':
        return (
          <View className="flex-row items-center">
            <View className="rounded-full" style={{ width: wp(5), height: wp(5), backgroundColor: '#EB001B' }} />
            <View className="rounded-full -ml-2" style={{ width: wp(5), height: wp(5), backgroundColor: '#F79E1B' }} />
          </View>
        );
      case 'amex':
        return (
          <View className="items-center justify-center rounded" style={{ width: wp(10), height: wp(6), backgroundColor: '#006FCF' }}>
            <Text style={{ fontSize: rf(8), fontWeight: 'bold', color: '#FFF' }}>AMEX</Text>
          </View>
        );
      case 'jcb':
        return (
          <View className="items-center justify-center rounded" style={{ width: wp(10), height: wp(6), backgroundColor: '#0E4C96' }}>
            <Text style={{ fontSize: rf(8), fontWeight: 'bold', color: '#FFF' }}>JCB</Text>
          </View>
        );
      default:
        return <CreditCard size={rf(20)} color={Colors.gray[400]} />;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    if (!cleanedNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanedNumber.length < 15 || cleanedNumber.length > 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Holder name validation
    if (!holderName.trim()) {
      newErrors.holderName = 'Cardholder name is required';
    }

    // Expiry validation
    const expiryParts = expiryDate.split('/');
    if (expiryParts.length !== 2) {
      newErrors.expiry = 'Invalid expiry date';
    } else {
      const month = parseInt(expiryParts[0], 10);
      const year = parseInt('20' + expiryParts[1], 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    // CVV validation
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userId = user?.id || 'user-1';

      const expiryParts = expiryDate.split('/');
      const cleanedNumber = cardNumber.replace(/\D/g, '');

      const res = await paymentService.addCard({
        userId,
        cardNumber: cleanedNumber,
        expiryMonth: parseInt(expiryParts[0], 10),
        expiryYear: parseInt('20' + expiryParts[1], 10),
        cvv,
        holderName,
        setAsDefault,
      });

      if (res.success) {
        Alert.alert('Success', 'Card added successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', res.error || 'Failed to add card');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
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
          style={{ paddingTop: hp(6), gap: wp(3) }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full items-center justify-center"
            style={{ width: wp(10), height: wp(10), backgroundColor: Colors.gray[100] }}
          >
            <ChevronLeft size={rf(20)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>Add New Card</Text>
        </View>

        {/* Card Preview */}
        <View
          className="mx-5 rounded-2xl p-5"
          style={{
            marginTop: hp(4),
            backgroundColor: Colors.primary,
            aspectRatio: 1.586,
          }}
        >
          <View className="flex-row justify-between items-start">
            <CreditCard size={rf(32)} color="#FFF" />
            <View className="items-center justify-center rounded px-2 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              {detectCardType(cardNumber) !== 'unknown' ? (
                <Text style={{ fontSize: rf(10), color: '#FFF', fontWeight: '600' }}>
                  {detectCardType(cardNumber).toUpperCase()}
                </Text>
              ) : (
                <Text style={{ fontSize: rf(10), color: 'rgba(255,255,255,0.7)' }}>CARD</Text>
              )}
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: rf(20), color: '#FFF', letterSpacing: 2, fontWeight: '500' }}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>

            <View className="flex-row justify-between items-end" style={{ marginTop: hp(2) }}>
              <View>
                <Text style={{ fontSize: rf(10), color: 'rgba(255,255,255,0.7)' }}>CARD HOLDER</Text>
                <Text style={{ fontSize: rf(14), color: '#FFF', fontWeight: '500', marginTop: hp(0.3) }}>
                  {holderName.toUpperCase() || 'YOUR NAME'}
                </Text>
              </View>
              <View className="items-end">
                <Text style={{ fontSize: rf(10), color: 'rgba(255,255,255,0.7)' }}>EXPIRES</Text>
                <Text style={{ fontSize: rf(14), color: '#FFF', fontWeight: '500', marginTop: hp(0.3) }}>
                  {expiryDate || 'MM/YY'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form */}
        <View className="px-5" style={{ marginTop: hp(4) }}>
          {/* Card Number */}
          <View style={{ marginBottom: hp(2.5) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Card Number
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.cardNumber ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <TextInput
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="numeric"
                maxLength={19}
                style={{ flex: 1, fontSize: rf(16), color: '#000' }}
              />
              {getCardIcon()}
            </View>
            {errors.cardNumber && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.cardNumber}</Text>
            )}
          </View>

          {/* Cardholder Name */}
          <View style={{ marginBottom: hp(2.5) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Cardholder Name
            </Text>
            <TextInput
              value={holderName}
              onChangeText={setHolderName}
              placeholder="John Doe"
              placeholderTextColor={Colors.gray[400]}
              autoCapitalize="characters"
              className="rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                fontSize: rf(16),
                color: '#000',
                borderWidth: errors.holderName ? 1 : 0,
                borderColor: '#EF4444',
              }}
            />
            {errors.holderName && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.holderName}</Text>
            )}
          </View>

          {/* Expiry and CVV */}
          <View className="flex-row" style={{ gap: wp(4), marginBottom: hp(2.5) }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
                Expiry Date
              </Text>
              <TextInput
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiry(text))}
                placeholder="MM/YY"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="numeric"
                maxLength={5}
                className="rounded-xl px-4"
                style={{
                  height: hp(6.5),
                  backgroundColor: Colors.gray[100],
                  fontSize: rf(16),
                  color: '#000',
                  borderWidth: errors.expiry ? 1 : 0,
                  borderColor: '#EF4444',
                }}
              />
              {errors.expiry && (
                <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.expiry}</Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
                CVV
              </Text>
              <View
                className="flex-row items-center rounded-xl px-4"
                style={{
                  height: hp(6.5),
                  backgroundColor: Colors.gray[100],
                  borderWidth: errors.cvv ? 1 : 0,
                  borderColor: '#EF4444',
                }}
              >
                <TextInput
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  placeholderTextColor={Colors.gray[400]}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  style={{ flex: 1, fontSize: rf(16), color: '#000' }}
                />
                <Lock size={rf(16)} color={Colors.gray[400]} />
              </View>
              {errors.cvv && (
                <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.cvv}</Text>
              )}
            </View>
          </View>

          {/* Set as Default */}
          <TouchableOpacity
            onPress={() => setSetAsDefault(!setAsDefault)}
            className="flex-row items-center"
            style={{ marginBottom: hp(4) }}
          >
            <View
              className="rounded items-center justify-center"
              style={{
                width: wp(6),
                height: wp(6),
                borderWidth: 2,
                borderColor: setAsDefault ? Colors.primary : Colors.gray[300],
                backgroundColor: setAsDefault ? Colors.primary : 'transparent',
              }}
            >
              {setAsDefault && (
                <Text style={{ fontSize: rf(12), color: '#FFF', fontWeight: 'bold' }}>✓</Text>
              )}
            </View>
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(3) }}>
              Set as default payment method
            </Text>
          </TouchableOpacity>

          {/* Security Note */}
          <View
            className="flex-row items-center rounded-xl p-4"
            style={{ backgroundColor: Colors.gray[50], marginBottom: hp(4) }}
          >
            <Lock size={rf(18)} color={Colors.gray[500]} />
            <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(2), flex: 1 }}>
              Your card information is securely encrypted and stored. We never share your payment details with third parties.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Card Button */}
      <View
        className="px-5"
        style={{ paddingBottom: hp(4), paddingTop: hp(2), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={handleAddCard}
          disabled={isLoading}
          className="rounded-full items-center justify-center"
          style={{
            backgroundColor: isLoading ? Colors.gray[300] : Colors.primary,
            paddingVertical: hp(2),
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
              Add Card
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function AddCardScreen() {
  return (
    <AuthGuard message="Please login to add a payment method">
      <AddCardContent />
    </AuthGuard>
  );
}
