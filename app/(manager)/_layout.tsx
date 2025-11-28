import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';

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
        name="professional-dashboard"
        options={{
          title: 'Workplace',
          headerShown:false,
          tabBarIcon: ({ color }) => <Octicons name="tasklist" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="token-screen"
        options={{
          title: 'Token',
          tabBarIcon: ({ color }) => <Ionicons name="ticket-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="share-token-screen"
        options={{
          title: 'Sell Token', 
          tabBarIcon: ({ color }) => <FontAwesome6 name="money-check-dollar" size={28} color={color} />,
        }
      }
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
