import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Lock, Eye, EyeOff, Check, Shield } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { AuthGuard } from '@/components';
import { useAuth } from '@/contexts';
import { authApi } from '@/api';

function ChangePasswordContent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.current = 'Current password is required';
    } else if (currentPassword.length < 6) {
      newErrors.current = 'Password must be at least 6 characters';
    }

    if (!newPassword) {
      newErrors.new = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.new = 'Password must be at least 6 characters';
    } else if (newPassword === currentPassword) {
      newErrors.new = 'New password must be different from current';
    }

    if (!confirmPassword) {
      newErrors.confirm = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (): { label: string; color: string; width: number } => {
    if (!newPassword) return { label: '', color: Colors.gray[300], width: 0 };

    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { label: 'Weak', color: '#EF4444', width: 20 };
    if (score <= 2) return { label: 'Fair', color: '#F59E0B', width: 40 };
    if (score <= 3) return { label: 'Good', color: '#3B82F6', width: 60 };
    if (score <= 4) return { label: 'Strong', color: '#10B981', width: 80 };
    return { label: 'Very Strong', color: '#059669', width: 100 };
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        Alert.alert('Success', 'Password changed successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', res.message || 'Failed to change password');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
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
        <View
          className="flex-row items-center justify-between px-5"
          style={{ paddingTop: hp(6) }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full items-center justify-center"
            style={{ width: wp(10), height: wp(10), backgroundColor: Colors.gray[100] }}
          >
            <ChevronLeft size={rf(20)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>Change Password</Text>
          <View style={{ width: wp(10) }} />
        </View>

        <View className="items-center" style={{ marginTop: hp(4) }}>
          <View
            className="rounded-full items-center justify-center"
            style={{ width: wp(20), height: wp(20), backgroundColor: Colors.salon.pinkBg }}
          >
            <Lock size={rf(36)} color={Colors.primary} />
          </View>
          <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(2), textAlign: 'center', paddingHorizontal: wp(10) }}>
            Your new password must be different from your current password
          </Text>
        </View>

        <View className="px-5" style={{ marginTop: hp(4) }}>
          <View style={{ marginBottom: hp(2.5) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Current Password
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.current ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <Lock size={rf(18)} color={Colors.gray[400]} />
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry={!showCurrent}
                style={{ flex: 1, fontSize: rf(16), color: '#000', marginLeft: wp(3) }}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? (
                  <EyeOff size={rf(18)} color={Colors.gray[400]} />
                ) : (
                  <Eye size={rf(18)} color={Colors.gray[400]} />
                )}
              </TouchableOpacity>
            </View>
            {errors.current && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.current}</Text>
            )}
          </View>

          <View style={{ marginBottom: hp(1) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              New Password
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.new ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <Lock size={rf(18)} color={Colors.gray[400]} />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry={!showNew}
                style={{ flex: 1, fontSize: rf(16), color: '#000', marginLeft: wp(3) }}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                {showNew ? (
                  <EyeOff size={rf(18)} color={Colors.gray[400]} />
                ) : (
                  <Eye size={rf(18)} color={Colors.gray[400]} />
                )}
              </TouchableOpacity>
            </View>
            {errors.new && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.new}</Text>
            )}
          </View>

          {newPassword && (
            <View style={{ marginBottom: hp(2.5) }}>
              <View className="flex-row items-center justify-between" style={{ marginBottom: hp(0.5) }}>
                <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Password Strength</Text>
                <Text style={{ fontSize: rf(12), color: passwordStrength.color, fontWeight: '600' }}>
                  {passwordStrength.label}
                </Text>
              </View>
              <View className="rounded-full overflow-hidden" style={{ height: hp(0.5), backgroundColor: Colors.gray[200] }}>
                <View
                  className="rounded-full"
                  style={{ width: `${passwordStrength.width}%`, height: '100%', backgroundColor: passwordStrength.color }}
                />
              </View>
            </View>
          )}

          <View style={{ marginBottom: hp(3) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Confirm New Password
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.confirm ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <Lock size={rf(18)} color={Colors.gray[400]} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry={!showConfirm}
                style={{ flex: 1, fontSize: rf(16), color: '#000', marginLeft: wp(3) }}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? (
                  <EyeOff size={rf(18)} color={Colors.gray[400]} />
                ) : (
                  <Eye size={rf(18)} color={Colors.gray[400]} />
                )}
              </TouchableOpacity>
              {confirmPassword && confirmPassword === newPassword && (
                <Check size={rf(18)} color="#10B981" style={{ marginLeft: wp(2) }} />
              )}
            </View>
            {errors.confirm && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.confirm}</Text>
            )}
          </View>

          <View
            className="rounded-xl p-4"
            style={{ backgroundColor: Colors.gray[50] }}
          >
            <View className="flex-row items-center" style={{ marginBottom: hp(1) }}>
              <Shield size={rf(16)} color={Colors.gray[500]} />
              <Text style={{ fontSize: rf(13), fontWeight: '600', color: Colors.gray[600], marginLeft: wp(2) }}>
                Password Tips
              </Text>
            </View>
            <View style={{ gap: hp(0.5) }}>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>• Use at least 8 characters</Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>• Include uppercase and lowercase letters</Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>• Add numbers and special characters</Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>• Avoid common words or patterns</Text>
            </View>
          </View>
        </View>

        <View style={{ height: hp(20) }} />
      </ScrollView>

      <View
        className="px-5"
        style={{ paddingBottom: hp(4), paddingTop: hp(2), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={handleChangePassword}
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
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function ChangePasswordScreen() {
  return (
    <AuthGuard message="Please login to change your password">
      <ChangePasswordContent />
    </AuthGuard>
  );
}
