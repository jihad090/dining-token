// Note: This file has been transformed into a simple QR Code Scanner Interface
// for the Dining Boy role, removing the original PDF elements.

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 

// Simulate random scan results for demonstration
const mockScanApi = (): Promise<{ success: boolean, tokenValue: string, message: string }> => {
  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.3; // 70% chance of success
      const token = `ID-${Math.floor(Math.random() * 900000) + 100000}`;
      
      if (isSuccessful) {
        resolve({
          success: true,
          tokenValue: token,
          message: `Meal token validated for student ${token}. Enjoy your meal!`,
        });
      } else {
        resolve({
          success: false,
          tokenValue: token,
          message: `Invalid or expired token (${token}). Please verify student details.`,
        });
      }
    }, 1500); // 1.5 seconds delay
  });
};

export default function QrScannerScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<{ status: 'success' | 'failure' | null, message: string }>({
    status: null,
    message: 'Press the button below to start scanning.',
  });

  const handleScan = async () => {
    // In a real app, this function would open the camera/QR reader view.
    // Here we simulate the process.
    setIsScanning(true);
    setLastScanResult({ status: null, message: 'Scanning in progress...' });

    // Simulate the API call after a successful scan
    const result = await mockScanApi();

    setIsScanning(false);
    
    if (result.success) {
      setLastScanResult({ 
        status: 'success', 
        message: `SUCCESS! Token ${result.tokenValue} validated.`,
      });
      Alert.alert('Scan Successful', result.message, [{ text: 'OK' }]);
    } else {
      setLastScanResult({ 
        status: 'failure', 
        message: `FAILURE! Token ${result.tokenValue} invalid.`,
      });
      Alert.alert('Scan Failed', result.message, [{ text: 'OK' }]);
    }
  };

  // Determine styles based on the last scan result status
  const feedbackColor = lastScanResult.status === 'success' ? '#10B981' : 
                        lastScanResult.status === 'failure' ? '#EF4444' : 
                        '#6B7280';
  
  const feedbackBackgroundColor = lastScanResult.status === 'success' ? '#D1FAE5' : 
                                  lastScanResult.status === 'failure' ? '#FEE2E2' : 
                                  '#E5E7EB';

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>Muktijoddha Hall</Text>
      <Text style={styles.subtitle}>Dining Token QR Scanner</Text>

      <View style={styles.scannerArea}>
        {/* Visual Feedback Display */}
        <View style={[styles.feedbackBox, { backgroundColor: feedbackBackgroundColor }]}>
            <Ionicons 
                name={lastScanResult.status === 'success' ? "checkmark-circle" : 
                      lastScanResult.status === 'failure' ? "close-circle" : 
                      "scan-outline"} 
                size={80} 
                color={feedbackColor} 
            />
            <Text style={[styles.feedbackText, { color: feedbackColor, marginTop: 15 }]}>
                {lastScanResult.message}
            </Text>
            {isScanning && <ActivityIndicator size="large" color="#4F46E5" style={{marginTop: 10}} />}
        </View>
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity 
        style={styles.scanButton} 
        onPress={handleScan}
        disabled={isScanning}
      >
        <Ionicons name="qr-code-outline" size={30} color="#fff" />
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'space-between', // Push scan button to the bottom
    paddingTop: 50,
  },
  hallName: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  feedbackBox: {
    width: '90%',
    minHeight: 250,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanButton: {
    height: 60,
    backgroundColor: '#4F46E5', // Indigo color for primary action
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 10,
    elevation: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
});