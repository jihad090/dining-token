import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ActivityIndicator, 
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { API_BASE_URL } from '../constants/api';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("Logging in to:", `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      await AsyncStorage.setItem('userToken', data.access_token);

    const userId = data.user._id || data.user.id; 
      if (userId) {
          await AsyncStorage.setItem('userId', userId.toString());
          console.log("✅ User ID Saved:", userId);
      } else {
          console.error("❌ Warning: User ID not found in login response!");
      }
      if (data.user.hallName) {
            await AsyncStorage.setItem('hallName', data.user.hallName);
        } else {
            await AsyncStorage.removeItem('hallName'); 
        }
      
      if (data.user) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      }

      
      const role = data.user?.role || 'user'; 
      console.log("User Role Found:", role);

      Alert.alert("Login Successful", `Welcome ${data.user?.name || 'User'}!`, [
        {
          text: "Go to Dashboard",
          onPress: () => navigateBasedOnRole(role) 
        }
      ]);

    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", error.message || "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  const navigateBasedOnRole = (role: string) => {
    switch (role) {
      case 'manager':
      case 'dining_manager':
        router.replace("/(manager)/professional-dashboard");
        break;

      case 'boy':
      case 'dining_boy':
        router.replace("/(dining-boy)/home");
        break;

      case 'hall':
      case 'hall_admin':
        router.replace("/(hall-authority)/professional-dashboard");
        break;

      case 'user':
      default:
        router.replace("/(diner)/token-screen");
        break;
    }
  };

  const handleGoogleLogin = async () => {
      try {
        await WebBrowser.openBrowserAsync(`${API_BASE_URL}/auth/google`);
        
      } catch (e) {
        Alert.alert("Error", "Google Login Failed");
      }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.titleText}>
        Dining Token
      </ThemedText>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <View style={styles.googleLogoCircle}>
          <Text style={styles.googleLogoText}>G</Text>
        </View>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or use email</Text>
        <View style={styles.dividerLine} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Don't have an account? </Text>
        <Link href="/register">
          <Text style={styles.registerLinkText}>Register now</Text>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  titleText: {
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 14,
    color: "#6b7280",
  },
  googleButton: {
    height: 52,
    backgroundColor: "#111827",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  googleLogoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  googleLogoText: {
    fontWeight: "bold",
    color: "#4285F4",
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 11,
    color: "#9ca3af",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  button: {
    height: 48,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },

  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  registerLinkText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
