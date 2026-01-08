import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { LogIn, X } from 'lucide-react-native';
import { Colors } from '@/constants';
import { wp, hp, rf } from '@/utils/responsive';
import { STORAGE_KEYS, getData } from '@/utils/asyncStorage';

interface AuthGuardProps {
  children: React.ReactNode;
  message?: string;
}

/**
 * AuthGuard component wraps screens that require authentication.
 * If user is not logged in, shows a modal prompting them to login.
 * Otherwise, renders the children normally.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  message = 'Please login to access this feature',
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setShowModal(true);
    }
  };

  const handleLogin = () => {
    setShowModal(false);
    router.push('/auth/login');
  };

  const handleGoBack = () => {
    setShowModal(false);
    router.back();
  };

  // Still loading auth state
  if (isAuthenticated === null) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>Loading...</Text>
      </View>
    );
  }

  // Not authenticated - show modal over blank screen
  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white">
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={handleGoBack}
        >
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <View
              className="bg-white rounded-3xl items-center"
              style={{
                width: wp(85),
                padding: wp(6),
                // iOS shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                // Android shadow
                elevation: 5,
              }}
            >
              {/* Close button */}
              <TouchableOpacity
                onPress={handleGoBack}
                className="absolute"
                style={{ top: wp(4), right: wp(4) }}
              >
                <X size={24} color={Colors.gray[400]} />
              </TouchableOpacity>

              {/* Icon */}
              <View
                className="rounded-full items-center justify-center"
                style={{
                  width: wp(20),
                  height: wp(20),
                  backgroundColor: Colors.salon.pinkBg,
                  marginBottom: hp(2),
                }}
              >
                <LogIn size={rf(36)} color={Colors.primary} />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: rf(22),
                  fontWeight: 'bold',
                  color: Colors.salon.dark,
                  marginBottom: hp(1),
                  textAlign: 'center',
                }}
              >
                Login Required
              </Text>

              {/* Message */}
              <Text
                style={{
                  fontSize: rf(14),
                  color: Colors.gray[500],
                  textAlign: 'center',
                  marginBottom: hp(3),
                  paddingHorizontal: wp(4),
                  lineHeight: rf(22),
                }}
              >
                {message}
              </Text>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                className="w-full items-center justify-center rounded-full"
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: hp(1.8),
                  marginBottom: hp(1.5),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(16),
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  Login Now
                </Text>
              </TouchableOpacity>

              {/* Go Back Button */}
              <TouchableOpacity
                onPress={handleGoBack}
                className="w-full items-center justify-center rounded-full"
                style={{
                  backgroundColor: Colors.salon.pinkBg,
                  paddingVertical: hp(1.8),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(16),
                    fontWeight: '600',
                    color: Colors.primary,
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
};
