import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Home, Grid, MessageSquare, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

type TabName = 'home' | 'dashboard' | 'messages' | 'profile';

interface AdminBottomNavProps {
  activeTab?: TabName;
}

interface NavItem {
  name: TabName;
  icon: typeof Home;
  route: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'home', icon: Home, route: '/admin/home' },
  { name: 'dashboard', icon: Grid, route: '/admin/dashboard' },
  { name: 'messages', icon: MessageSquare, route: '/admin/messages' },
  { name: 'profile', icon: User, route: '/admin/profile' },
];

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ activeTab }) => {
  const handlePress = (route: string) => {
    router.push(route as any);
  };

  return (
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
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.name;

        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => handlePress(item.route)}
            className="items-center"
            style={{ opacity: isActive ? 1 : 0.6 }}
          >
            <Icon size={rf(24)} color={isActive ? Colors.primary : '#000'} />
            {isActive && (
              <View
                className="rounded-full"
                style={{
                  width: wp(1),
                  height: wp(1),
                  backgroundColor: Colors.primary,
                  marginTop: hp(0.5),
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
