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
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

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
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.titleText}>
        Dining Token
      </ThemedText>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleDummyGoogleLogin}
      >
        <View style={styles.googleLogoCircle}>
          <Text style={styles.googleLogoText}>G</Text>
        </View>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or use test login</Text>
        <View style={styles.dividerLine} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter role key (boy / manager / hall)"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Dummy password (not used)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
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
