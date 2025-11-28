<<<<<<< HEAD
=======
// import React, { useState } from 'react';
// import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
// import { Link, router } from 'expo-router';

// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     console.log('Logging in with', email, password);

//     if(email==''){
//       router.push('/(diner)/token-screen')
//     }else if(email=="boy"){
//       router.push('/(dining-boy)/home')
//     }else if(email=='manager'){
//       router.push('/(manager)/professional-dashboard')
//     }else if(email=='hall'){
//       router.push('/(hall-authority)/professional-dashboard')
//     }
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText type="title" style={styles.titleText}>Welcome!</ThemedText>

//       <TextInput
//         style={styles.input}
//         placeholder="Email Address"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.forgotContainer} onPress={() => { /* handle forgot password */ }}>
//         <Text style={styles.forgotText}>Forgot password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>

//       <View style={styles.registerContainer}>
//         <Text>Not a member? </Text>
//         <Link href="/register" style={styles.registerLink}>
//           <Text style={styles.registerLinkText}>Register now</Text>
//         </Link>
//       </View>

//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff', // adapt based on your theme
//   },
//   titleText: {
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   input: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 12,
//   },
//   forgotContainer: {
//     alignItems: 'flex-end',
//     marginBottom: 24,
//   },
//   forgotText: {
//     color: '#0066cc',
//   },
//   button: {
//     height: 48,
//     backgroundColor: '#0066cc',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   registerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   registerLink: {
//     // no extra padding needed or add if you like
//   },
//   registerLinkText: {
//     color: '#0066cc',
//     fontWeight: 'bold',
//     padding:10
//   },
// });
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
<<<<<<< HEAD
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
=======
} from "react-native";
import { Link, router } from "expo-router";
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

<<<<<<< HEAD
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
=======
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDummyGoogleLogin = () => {
    const testEmail = email.toLowerCase().trim();

    if (testEmail === "boy") {
      router.replace("/(dining-boy)/home");
    } else if (testEmail === "manager") {
      router.replace("/(manager)/professional-dashboard");
    } else if (testEmail === "hall") {
      router.replace("/(hall-authority)/professional-dashboard");
    } else {
      router.replace("/(diner)/token-screen");
    }
  };

  const handleTestLogin = () => {
    handleDummyGoogleLogin();
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.titleText}>
        Dining Token
      </ThemedText>
      <Text style={styles.subtitle}>Sign in to continue</Text>

<<<<<<< HEAD
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
=======
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleDummyGoogleLogin}
      >
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
        <View style={styles.googleLogoCircle}>
          <Text style={styles.googleLogoText}>G</Text>
        </View>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
<<<<<<< HEAD
        <Text style={styles.dividerText}>or use email</Text>
=======
        <Text style={styles.dividerText}>or use test login</Text>
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
        <View style={styles.dividerLine} />
      </View>

      <TextInput
        style={styles.input}
<<<<<<< HEAD
        placeholder="Email Address"
        autoCapitalize="none"
        keyboardType="email-address"
=======
        placeholder="Enter role key (boy / manager / hall)"
        autoCapitalize="none"
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
<<<<<<< HEAD
        placeholder="Password"
=======
        placeholder="Dummy password (not used)"
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

<<<<<<< HEAD
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Don't have an account? </Text>
=======
      <TouchableOpacity style={styles.button} onPress={handleTestLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.hintBox}>
        <Text style={styles.hintTitle}>Test accounts</Text>
        <Text style={styles.hintText}>• Empty email → Diner</Text>
        <Text style={styles.hintText}>• boy → Dining Boy</Text>
        <Text style={styles.hintText}>• manager → Dining Manager</Text>
        <Text style={styles.hintText}>• hall → Hall Admin</Text>
      </View>

      <View style={styles.registerContainer}>
        <Text>Need manual registration? </Text>
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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
<<<<<<< HEAD
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
=======
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
<<<<<<< HEAD
=======
  hintBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    marginBottom: 16,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1d4ed8",
    marginBottom: 4,
  },
  hintText: {
    fontSize: 11,
    color: "#4b5563",
  },
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  registerLinkText: {
    color: "#2563eb",
    fontWeight: "600",
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
