import React, { useState } from 'react';
<<<<<<< HEAD
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Alert } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { API_BASE_URL } from '../constants/api';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

=======
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import DropDownPicker from 'react-native-dropdown-picker';

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
<<<<<<< HEAD
=======
  const [hall, setHall] = useState<string | null>(null);

  // For DropDownPicker state
  const [openHall, setOpenHall] = useState(false);
  const [hallItems, setHallItems] = useState([
    { label: 'MJ', value: 'hallA' },
    { label: 'QK', value: 'hallB' },
    { label: 'North', value: 'hallC' },
    { label: 'South', value: 'hallD' },
  ]);
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
<<<<<<< HEAD

    if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
    }
=======
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
<<<<<<< HEAD

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Registration Success:', data);
      Alert.alert('Success', 'Account created successfully!', [
        { 
            text: 'OK', 
            onPress: () => router.push('/login') 
        }
      ]);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
=======
    if (!hall) {
      setError('Please select your hall');
      return;
    }
    setLoading(true);
    try {
      console.log('Registering', { name, email, password, hall });
      // TODO: registration API call
    } catch (e) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
    router.push('/otp-screen');
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedText type="title" style={styles.titleText}>Sign up</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitleText}>Create an account to get started</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Name"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

<<<<<<< HEAD
=======
      {/* Dropdown for selecting hall */}
      <DropDownPicker
        open={openHall}
        value={hall}
        items={hallItems}
        setOpen={setOpenHall}
        setValue={setHall}
        setItems={setHallItems}
        placeholder="Select your hall"
        style={styles.input}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}       // ensure dropdown appears above other fields
      />

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
      <TextInput
        style={styles.input}
        placeholder="Create a password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
<<<<<<< HEAD
        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
=======
        <Text style={styles.buttonText}>{loading ? 'Sending OTP…' : 'Send OTP'}</Text>
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text>Already have an account? </Text>
        <Link href="/login" style={styles.loginLinkText}>
          <Text style={styles.loginLinkText}>Login</Text>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
<<<<<<< HEAD
=======
  dropdownContainer: {
    borderColor: '#ccc',
    marginBottom: 16,
  },
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  button: {
    height: 48,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#99ccee',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLinkText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
