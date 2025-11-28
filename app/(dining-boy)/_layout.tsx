import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown:false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-account" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan-screen"
        options={{
          title: 'Scan',
          headerShown:false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="qrcode-scan" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
