import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

export const WEEK_DAYS = ['Mo', 'Tue', 'Wed', 'Th', 'Fri', 'Sa', 'Su'] as const;

export interface WeekDay {
  day: string;
  date: number;
  isSelected: boolean;
  hasAppointment?: boolean;
}

interface WeekCalendarProps {
  month: string;
  weekDays: WeekDay[];
  onSelectDate: (date: number) => void;
  showAppointmentIndicator?: boolean;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  month,
  weekDays,
  onSelectDate,
  showAppointmentIndicator = false,
}) => {
  return (
    <View>
      {/* Month */}
      <Text
        className="text-center"
        style={{ fontSize: rf(18), color: '#6B7280', marginBottom: hp(2) }}
      >
        {month}
      </Text>

      {/* Calendar Week View */}
      <View
        className="flex-row justify-between"
        style={{ paddingHorizontal: wp(6) }}
      >
        {weekDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectDate(item.date)}
            className="items-center"
          >
            <Text
              style={{
                fontSize: rf(14),
                color: item.isSelected ? '#000' : '#9CA3AF',
                fontWeight: item.isSelected ? '600' : '400',
              }}
            >
              {item.day}
            </Text>
            <View
              className="items-center justify-center mt-2"
              style={{
                width: wp(10),
                height: wp(10),
                borderRadius: wp(5),
                backgroundColor: item.isSelected ? '#F3F4F6' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: rf(16),
                  color: item.isSelected ? '#000' : '#9CA3AF',
                  fontWeight: item.isSelected ? '600' : '400',
                }}
              >
                {item.date}
              </Text>
            </View>
            {/* Appointment indicator dot */}
            {showAppointmentIndicator && item.hasAppointment && (
              <View
                className="rounded-full mt-1"
                style={{
                  width: wp(1.5),
                  height: wp(1.5),
                  backgroundColor: Colors.primary,
                }}
              />
            )}
            {/* Selected indicator dot (when no appointment indicator) */}
            {!showAppointmentIndicator && item.isSelected && (
              <View
                className="absolute rounded-full"
                style={{
                  width: wp(1.5),
                  height: wp(1.5),
                  backgroundColor: Colors.primary,
                  bottom: wp(0.5),
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Helper function to generate week days
export const generateWeekDays = (
  startDate: number,
  selectedDate: number,
  appointmentDates: number[] = []
): WeekDay[] => {
  return WEEK_DAYS.map((day, index) => ({
    day,
    date: startDate + index,
    isSelected: startDate + index === selectedDate,
    hasAppointment: appointmentDates.includes(startDate + index),
  }));
};
