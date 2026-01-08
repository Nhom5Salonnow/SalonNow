import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Receipt, CreditCard, Calendar, CheckCircle, XCircle, Clock, ArrowUpRight } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { AuthGuard } from '@/components';
import { useAuth } from '@/contexts';
import { paymentService } from '@/api/paymentService';
import { Payment } from '@/api/mockServer/types';

function PaymentHistoryContent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const userId = user?.id || 'user-1';

  const loadPayments = useCallback(async () => {
    try {
      const res = await paymentService.getPaymentHistory(userId);
      if (res.success && res.data) {
        setPayments(res.data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      await loadPayments();
      setIsLoading(false);
    };
    init();
  }, [loadPayments]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPayments();
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={rf(18)} color="#10B981" />;
      case 'refunded':
        return <ArrowUpRight size={rf(18)} color="#8B5CF6" />;
      case 'failed':
        return <XCircle size={rf(18)} color="#EF4444" />;
      case 'pending':
        return <Clock size={rf(18)} color="#F59E0B" />;
      default:
        return <Receipt size={rf(18)} color={Colors.gray[400]} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#ECFDF5', text: '#10B981' };
      case 'refunded':
        return { bg: '#F5F3FF', text: '#8B5CF6' };
      case 'failed':
        return { bg: '#FEF2F2', text: '#EF4444' };
      case 'pending':
        return { bg: '#FFFBEB', text: '#F59E0B' };
      default:
        return { bg: Colors.gray[100], text: Colors.gray[500] };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateTotalSpent = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.total, 0);
  };

  const renderPayment = ({ item }: { item: Payment }) => {
    const statusColors = getStatusColor(item.status);

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/payment-detail', params: { paymentId: item.id } } as any)}
        className="bg-white rounded-2xl p-4 mb-3"
        style={{ borderWidth: 1, borderColor: Colors.gray[200] }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className="rounded-xl items-center justify-center"
              style={{ width: wp(12), height: wp(12), backgroundColor: statusColors.bg }}
            >
              {getStatusIcon(item.status)}
            </View>

            <View style={{ marginLeft: wp(3), flex: 1 }}>
              <Text style={{ fontSize: rf(15), fontWeight: '600', color: '#000' }}>
                {item.receiptNumber || `#${item.id.slice(-6)}`}
              </Text>
              <View className="flex-row items-center" style={{ marginTop: hp(0.3) }}>
                <Calendar size={rf(12)} color={Colors.gray[400]} />
                <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(1) }}>
                  {formatDate(item.createdAt)} • {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end">
            <Text style={{ fontSize: rf(16), fontWeight: '700', color: '#000' }}>
              ${item.total.toFixed(2)}
            </Text>
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: statusColors.bg, marginTop: hp(0.5) }}
            >
              <Text style={{ fontSize: rf(10), fontWeight: '600', color: statusColors.text, textTransform: 'capitalize' }}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Row */}
        <View
          className="flex-row items-center justify-between pt-3 mt-3"
          style={{ borderTopWidth: 1, borderTopColor: Colors.gray[100] }}
        >
          <View className="flex-row items-center">
            <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Subtotal: </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[600], fontWeight: '500' }}>
              ${item.subtotal.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Tax: </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[600], fontWeight: '500' }}>
              ${item.tax.toFixed(2)}
            </Text>
          </View>
          {item.discount > 0 && (
            <View className="flex-row items-center">
              <Text style={{ fontSize: rf(12), color: '#10B981' }}>Discount: </Text>
              <Text style={{ fontSize: rf(12), color: '#10B981', fontWeight: '500' }}>
                -${item.discount.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>Payment History</Text>
        </View>

        {/* Summary */}
        {payments.length > 0 && (
          <View
            className="flex-row items-center justify-between rounded-2xl p-4"
            style={{ marginTop: hp(2), backgroundColor: Colors.salon.pinkBg }}
          >
            <View>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Total Spent</Text>
              <Text style={{ fontSize: rf(24), fontWeight: 'bold', color: Colors.primary }}>
                ${calculateTotalSpent().toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Transactions</Text>
              <Text style={{ fontSize: rf(20), fontWeight: '600', color: Colors.salon.dark }}>
                {payments.length}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Payment List */}
      <FlatList
        data={payments}
        renderItem={renderPayment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: wp(5),
          paddingBottom: hp(10),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center" style={{ paddingTop: hp(10) }}>
            <Receipt size={rf(60)} color={Colors.gray[300]} />
            <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#000', marginTop: hp(2) }}>
              No Payments Yet
            </Text>
            <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(1), textAlign: 'center' }}>
              Your payment history will appear here after you make your first booking.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/home' as any)}
              className="rounded-full px-6 py-3"
              style={{ backgroundColor: Colors.primary, marginTop: hp(3) }}
            >
              <Text style={{ fontSize: rf(14), color: '#FFF', fontWeight: '600' }}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

export default function PaymentHistoryScreen() {
  return (
    <AuthGuard message="Please login to view your payment history">
      <PaymentHistoryContent />
    </AuthGuard>
  );
}
