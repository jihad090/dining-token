import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Pressable,
} from 'react-native';
import { Stack, Link, router } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function OtpScreen() {
  const CODE_LENGTH = 4;

  const [codeArr, setCodeArr] = useState(Array(CODE_LENGTH).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>(Array(CODE_LENGTH).fill(null));
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(10); // e.g., seconds

  useEffect(() => {
    // start countdown for resend
    const timer = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newArr = [...codeArr];
    newArr[index] = text;
    setCodeArr(newArr);

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !codeArr[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const code = codeArr.join('');
    if (code.length < CODE_LENGTH) {
      setError('Please enter the full code');
      return;
    }
    setError(null);
    console.log('Entered code:', code);

    router.push('/(diner)/home')
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      console.log('Resend code');
      setCodeArr(Array(CODE_LENGTH).fill(''));
      setResendTimer(10);
      // TODO: call resend API
    }
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <ThemedText type="title" style={styles.titleText}>
          Enter confirmation code
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitleText}>
          A {CODE_LENGTH}-digit code was sent to student-mail@email.com
        </ThemedText>

        <View style={styles.codeContainer}>
        {codeArr.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={ref => { inputRefs.current[idx] = ref; }}
            style={[styles.codeInput, idx === activeInput && styles.codeInputActive]}
            value={digit}
            onChangeText={text => {
              if (/^\d$/.test(text)) {
                const newArr = [...codeArr];
                newArr[idx] = text;
                setCodeArr(newArr);
                const nextIndex = idx + 1 < CODE_LENGTH ? idx + 1 : idx;
                setActiveInput(nextIndex);
                inputRefs.current[nextIndex]?.focus();
              }
            }}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace' && !digit && idx > 0) {
                inputRefs.current[idx - 1]?.focus();
                setActiveInput(idx - 1);
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
          <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff', // adjust to your theme
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 4,
  },
  codeInputActive: {
    borderColor: '#0066cc',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  resendText: {
    textAlign: 'center',
    color: '#0066cc',
    marginBottom: 24,
  },
  resendTextDisabled: {
    color: '#999',
  },
  button: {
    height: 48,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
