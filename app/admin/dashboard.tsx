import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Home, Grid, MessageSquare, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

type ReportPeriod = 'Daily' | 'Weekly' | 'Monthly';

const OVERVIEW_DATA = [
  { label: 'Total Revenue', value: '$25,450' },
  { label: 'Appointments', value: '320' },
  { label: 'Customer\nRetention', value: '75%' },
  { label: 'Avg. Spend', value: '$80' },
];

const REVENUE_DATA = [
  { day: 'Mon', value: 60 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 80 },
  { day: 'Thu', value: 70 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 85 },
  { day: 'Sun', value: 55 },
];

export default function AdminDashboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('Weekly');

  const periods: ReportPeriod[] = ['Daily', 'Weekly', 'Monthly'];

  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink background */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(30),
          top: -hp(10),
          width: wp(80),
          height: wp(80),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.4,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: hp(6), paddingHorizontal: wp(6) }}>
          <Text
            className="text-center"
            style={{ fontSize: rf(22), fontWeight: '600', color: '#000' }}
          >
            Dashboard
          </Text>
        </View>

        {/* Overview Section */}
        <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>
            Overview
          </Text>

          <View
            className="flex-row flex-wrap justify-between"
            style={{ marginTop: hp(2) }}
          >
            {OVERVIEW_DATA.map((item, index) => (
              <View
                key={index}
                className="rounded-2xl"
                style={{
                  width: '48%',
                  backgroundColor: Colors.salon.pinkLight,
                  padding: wp(4),
                  marginBottom: hp(1.5),
                }}
              >
                <Text style={{ fontSize: rf(14), color: '#000' }}>
                  {item.label}
                </Text>
                <Text
                  style={{
                    fontSize: rf(24),
                    fontWeight: '700',
                    color: '#000',
                    marginTop: hp(0.5),
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Reports */}
        <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>
            Detailed Reports
          </Text>

          {/* Period Tabs */}
          <View
            className="flex-row rounded-full"
            style={{
              marginTop: hp(2),
              backgroundColor: '#F3F4F6',
              padding: wp(1),
            }}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                className="flex-1 items-center justify-center rounded-full"
                style={{
                  paddingVertical: hp(1.2),
                  backgroundColor:
                    selectedPeriod === period ? Colors.salon.pinkLight : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    color: selectedPeriod === period ? Colors.primary : '#6B7280',
                    fontWeight: selectedPeriod === period ? '600' : '400',
                  }}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Revenue Trend Chart */}
          <View style={{ marginTop: hp(3) }}>
            <Text style={{ fontSize: rf(16), fontWeight: '500', color: '#000' }}>
              Revenue Trend
            </Text>

            <View
              className="flex-row items-end justify-between"
              style={{ marginTop: hp(2), height: hp(15) }}
            >
              {REVENUE_DATA.map((item, index) => (
                <View key={index} className="items-center" style={{ flex: 1 }}>
                  <View
                    className="rounded-t"
                    style={{
                      width: wp(6),
                      height: `${(item.value / maxRevenue) * 100}%`,
                      backgroundColor: Colors.salon.pinkLight,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: rf(12),
                      color: '#6B7280',
                      marginTop: hp(1),
                    }}
                  >
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Trend Analysis */}
        <View style={{ paddingHorizontal: wp(6), marginTop: hp(4) }}>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>
            Trend Analysis
          </Text>

          <Text
            style={{
              fontSize: rf(14),
              color: '#000',
              marginTop: hp(2),
            }}
          >
            Customer Retention Rate
          </Text>

          {/* Simple line chart representation */}
          <View
            className="rounded-2xl"
            style={{
              marginTop: hp(2),
              height: hp(15),
              backgroundColor: Colors.salon.pinkBg,
              overflow: 'hidden',
            }}
          >
            {/* SVG-like wave using View */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                backgroundColor: `${Colors.primary}20`,
                borderTopLeftRadius: wp(10),
                borderTopRightRadius: wp(5),
              }}
            />
          </View>

          {/* Month labels */}
          <View className="flex-row justify-between" style={{ marginTop: hp(1) }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
              <Text key={month} style={{ fontSize: rf(12), color: '#6B7280' }}>
                {month}
              </Text>
            ))}
          </View>
        </View>

        <View style={{ height: hp(12) }} />
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
          onPress={() => router.push('/admin/home' as any)}
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
