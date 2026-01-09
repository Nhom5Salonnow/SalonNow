import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Camera, User, Mail, Phone, Check } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { AuthGuard } from '@/components';
import { useAuth } from '@/contexts';
import { userApi } from '@/api';

function EditProfileContent() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const checkForChanges = () => {
    if (!user) return false;
    return (
      name !== (user.name || '') ||
      email !== (user.email || '') ||
      phone !== (user.phone || '') ||
      avatar !== (user.avatar || '')
    );
  };

  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [name, email, phone, avatar, user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (phone && !/^\+?[\d\s-]{10,}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const res = await userApi.updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        avatar: avatar || undefined,
      });

      if (res.success) {
        await updateUser({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          avatar: avatar || undefined,
        });

        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', res.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (authLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>Edit Profile</Text>
          <View style={{ width: wp(10) }} />
        </View>

        <View className="items-center" style={{ marginTop: hp(4) }}>
          <TouchableOpacity onPress={handleChangeAvatar}>
            <View
              className="rounded-full overflow-hidden"
              style={{
                width: wp(28),
                height: wp(28),
                borderWidth: 3,
                borderColor: Colors.salon.pinkLight,
              }}
            >
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center" style={{ backgroundColor: Colors.gray[200] }}>
                  <User size={rf(40)} color={Colors.gray[400]} />
                </View>
              )}
            </View>

            <View
              className="absolute rounded-full items-center justify-center"
              style={{
                bottom: 0,
                right: 0,
                width: wp(9),
                height: wp(9),
                backgroundColor: Colors.primary,
              }}
            >
              <Camera size={rf(16)} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(1.5) }}>
            Tap to change photo
          </Text>
        </View>

        <View className="px-5" style={{ marginTop: hp(4) }}>
          <View style={{ marginBottom: hp(2.5) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Full Name
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.name ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <User size={rf(18)} color={Colors.gray[400]} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.gray[400]}
                style={{ flex: 1, fontSize: rf(16), color: '#000', marginLeft: wp(3) }}
              />
            </View>
            {errors.name && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.name}</Text>
            )}
          </View>

          <View style={{ marginBottom: hp(2.5) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Email Address
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.email ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <Mail size={rf(18)} color={Colors.gray[400]} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, fontSize: rf(16), color: '#000', marginLeft: wp(3) }}
              />
            </View>
            {errors.email && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.email}</Text>
            )}
          </View>

          <View style={{ marginBottom: hp(2.5) }}>
            <Text style={{ fontSize: rf(14), fontWeight: '500', color: Colors.gray[600], marginBottom: hp(1) }}>
              Phone Number
            </Text>
            <View
              className="flex-row items-center rounded-xl px-4"
              style={{
                height: hp(6.5),
                backgroundColor: Colors.gray[100],
                borderWidth: errors.phone ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <Phone size={rf(18)} color={Colors.gray[400]} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="phone-pad"
                style={{ flex: 1, fontSize: rf(16), color: '#000', marginLeft: wp(3) }}
              />
            </View>
            {errors.phone && (
              <Text style={{ fontSize: rf(12), color: '#EF4444', marginTop: hp(0.5) }}>{errors.phone}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push('/change-password' as any)}
            className="flex-row items-center justify-between rounded-xl px-4"
            style={{
              height: hp(6.5),
              backgroundColor: Colors.gray[100],
              marginBottom: hp(4),
            }}
          >
            <Text style={{ fontSize: rf(16), color: Colors.gray[600] }}>Change Password</Text>
            <ChevronLeft size={rf(18)} color={Colors.gray[400]} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        className="px-5"
        style={{ paddingBottom: hp(4), paddingTop: hp(2), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving || !hasChanges}
          className="rounded-full items-center justify-center flex-row"
          style={{
            backgroundColor: isSaving || !hasChanges ? Colors.gray[300] : Colors.primary,
            paddingVertical: hp(2),
          }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Check size={rf(18)} color="#FFF" />
              <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600', marginLeft: wp(2) }}>
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function EditProfileScreen() {
  return (
    <AuthGuard message="Please login to edit your profile">
      <EditProfileContent />
    </AuthGuard>
  );
}
