import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api'; 

export default function GoogleAuthCallback() {
  const { token } = useLocalSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) return;

      try {
        const tokenString = token as string;
        await AsyncStorage.setItem('userToken', tokenString);

        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${tokenString}`
          }
        });

        const userData = await response.json();
        console.log("👤 DEBUG: User Profile Data:", userData);
        const userId = userData._id || userData.id;
        if (userId) {
            await AsyncStorage.setItem('userId', userId.toString());
            console.log("✅ Google Auth: User ID Saved:", userId);
        } else {
            console.error("❌ Google Auth: User ID missing in profile response!");
        }
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        const role = userData.role || 'user';
        
        await AsyncStorage.setItem('userRole', role);
        
        if (!userData.hallName) {
          console.log("⚠️ Hall Name missing, redirecting to complete-profile");
          router.replace('/complete-profile');
          return;
        }
      await AsyncStorage.setItem('hallName', userData.hallName);

        if (role === 'hall_admin') {
          router.replace('/(hall-authority)/professional-dashboard');
        } else if (role === 'manager') {
          router.replace('/(manager)/professional-dashboard');
        } else if (role === 'dining_boy') {
          router.replace('/(dining-boy)/home');
        } else {
          router.replace('/(diner)/token-screen');
        }

      } catch (error) {
        console.error("Auth routing error:", error);
        router.replace('/login');
      }
    };

    handleAuth();
  }, [token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0066cc" />
      <Text style={{ marginTop: 20 }}>Verifying User Role...</Text>
    </View>
  );
}