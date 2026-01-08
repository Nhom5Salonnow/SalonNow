import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, CreditCard, Plus, Trash2, Check, Star, Shield } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { AuthGuard } from '@/components';
import { useAuth } from '@/contexts';
import { paymentApi } from '@/api';

interface PaymentMethod {
  id: string;
  cardBrand?: string;
  lastFourDigits: string;
  holderName?: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

function PaymentMethodsContent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const userId = user?.id || 'user-1';

  const loadPaymentMethods = useCallback(async (_uid: string) => {
    try {
      // Call real API
      const res = await paymentApi.getPaymentMethods();
      if (res.success && res.data) {
        // Map API response to local format
        const mapped = res.data.map((m: any) => ({
          id: m.id,
          cardBrand: m.brand || m.cardBrand || 'visa',
          lastFourDigits: m.last4 || m.lastFourDigits || '****',
          holderName: m.holderName || '',
          expiryMonth: m.expiryMonth || 12,
          expiryYear: m.expiryYear || 25,
          isDefault: m.isDefault || false,
        }));
        setPaymentMethods(mapped);
      } else {
        // API returned no data - show empty
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setPaymentMethods([]);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadPaymentMethods(userId);
      setIsLoading(false);
    };
    init();
  }, [loadPaymentMethods, userId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPaymentMethods(userId);
    setIsRefreshing(false);
  };

  const handleSetDefault = async (methodId: string) => {
    // Call real API
    const res = await paymentApi.setDefaultPaymentMethod(methodId);
    if (res.success) {
      await loadPaymentMethods(userId);
    } else {
      Alert.alert('Error', res.message || 'Failed to set default card');
    }
  };

  const handleRemoveCard = async (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method?.isDefault && paymentMethods.length > 1) {
      Alert.alert(
        'Cannot Remove',
        'Please set another card as default before removing this one.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            // Call real API
            const res = await paymentApi.deletePaymentMethod(methodId);
            if (res.success) {
              await loadPaymentMethods(userId);
            } else {
              Alert.alert('Error', res.message || 'Failed to remove card');
            }
          },
        },
      ]
    );
  };

  const getCardIcon = (brand?: string) => {
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

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{
        borderWidth: item.isDefault ? 2 : 1,
        borderColor: item.isDefault ? Colors.primary : Colors.gray[200],
      }}
    >
      <View className="flex-row items-center">
        {/* Card Logo */}
        <View
          className="rounded-xl items-center justify-center"
          style={{ width: wp(14), height: wp(10), backgroundColor: Colors.gray[100] }}
        >
          {getCardIcon(item.cardBrand)}
        </View>

        {/* Card Info */}
        <View style={{ flex: 1, marginLeft: wp(3) }}>
          <View className="flex-row items-center">
            <Text style={{ fontSize: rf(15), fontWeight: '600', color: '#000' }}>
              {(item.cardBrand || 'Card').charAt(0).toUpperCase() + (item.cardBrand || 'card').slice(1)} •••• {item.lastFourDigits}
            </Text>
            {item.isDefault && (
              <View
                className="flex-row items-center rounded-full px-2 py-0.5 ml-2"
                style={{ backgroundColor: Colors.salon.pinkBg }}
              >
                <Star size={rf(10)} color={Colors.primary} fill={Colors.primary} />
                <Text style={{ fontSize: rf(10), color: Colors.primary, fontWeight: '600', marginLeft: wp(0.5) }}>
                  Default
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginTop: hp(0.3) }}>
            {item.holderName} • Expires {item.expiryMonth}/{item.expiryYear}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View
        className="flex-row items-center justify-between pt-3 mt-3"
        style={{ borderTopWidth: 1, borderTopColor: Colors.gray[100] }}
      >
        {!item.isDefault ? (
          <TouchableOpacity
            onPress={() => handleSetDefault(item.id)}
            className="flex-row items-center"
          >
            <Check size={rf(14)} color={Colors.primary} />
            <Text style={{ fontSize: rf(13), color: Colors.primary, fontWeight: '500', marginLeft: wp(1) }}>
              Set as Default
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center">
            <Shield size={rf(14)} color="#10B981" />
            <Text style={{ fontSize: rf(13), color: '#10B981', fontWeight: '500', marginLeft: wp(1) }}>
              Primary Card
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleRemoveCard(item.id)}
          className="flex-row items-center"
        >
          <Trash2 size={rf(14)} color="#EF4444" />
          <Text style={{ fontSize: rf(13), color: '#EF4444', fontWeight: '500', marginLeft: wp(1) }}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white" style={{ paddingTop: hp(6), paddingBottom: hp(2), paddingHorizontal: wp(5) }}>
        <View className="flex-row items-center" style={{ gap: wp(3) }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full items-center justify-center"
            style={{ width: wp(10), height: wp(10), backgroundColor: Colors.gray[100] }}
          >
            <ChevronLeft size={rf(20)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>Payment Methods</Text>
        </View>
      </View>

      {/* Payment Methods List */}
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: wp(5),
          paddingBottom: hp(20),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center" style={{ paddingTop: hp(10) }}>
            <CreditCard size={rf(60)} color={Colors.gray[300]} />
            <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#000', marginTop: hp(2) }}>
              No Payment Methods
            </Text>
            <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(1), textAlign: 'center' }}>
              Add a card to make payments faster and easier.
            </Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => router.push('/add-card' as any)}
            className="flex-row items-center justify-center rounded-2xl p-4"
            style={{
              borderWidth: 1,
              borderColor: Colors.primary,
              borderStyle: 'dashed',
              marginTop: hp(1),
            }}
          >
            <Plus size={rf(18)} color={Colors.primary} />
            <Text style={{ fontSize: rf(15), color: Colors.primary, marginLeft: wp(2), fontWeight: '600' }}>
              Add New Card
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Security Note */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{ paddingBottom: hp(4), backgroundColor: 'white' }}
      >
        <View
          className="flex-row items-center rounded-xl p-3"
          style={{ backgroundColor: Colors.gray[50] }}
        >
          <Shield size={rf(18)} color={Colors.gray[500]} />
          <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(2), flex: 1 }}>
            Your payment information is encrypted and securely stored.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function PaymentMethodsScreen() {
  return (
    <AuthGuard message="Please login to manage your payment methods">
      <PaymentMethodsContent />
    </AuthGuard>
  );
}
