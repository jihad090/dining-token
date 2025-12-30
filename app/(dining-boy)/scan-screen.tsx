import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/api";
import { useFocusEffect } from '@react-navigation/native';

const scanApi = async (scannedToken: string): Promise<{ success: boolean; tokenValue: string; message: string, meal: string | null }> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error("Authentication failed. Login again.");

    const response = await fetch(`${API_BASE_URL}/dining-token/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tokenID: scannedToken }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        tokenValue: scannedToken,
        message: data.message || "Token Verified!",
        meal: data.meal
      };
    } else {
      return {
        success: false,
        tokenValue: scannedToken,
        message: data.message || 'Validation Failed!',
        meal: null
      };
    }
  } catch (error: any) {
    return { success: false, tokenValue: scannedToken, message: error.message || "Network Error.", meal: null };
  }
};

const { width } = Dimensions.get('window');

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hallName, setHallName] = useState<string>('Muktijoddha Hall');
  const [lastScanResult, setLastScanResult] = useState<{
    status: "success" | "failure" | null;
    message: string;
    meal: string | null;
  }>({
    status: null,
    message: "Ready to scan",
    meal: null
  });

  const scanTimeoutRef = useRef<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      // রিসেট লজিক (যা আগে ছিল)
      setLastScanResult({
        status: null,
        message: "Ready to scan",
        meal: null
      });
      setIsScanning(false);
      setIsProcessing(false);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }

      const loadHallName = async () => {
        try {
          const storedHall = await AsyncStorage.getItem('hallName');
          if (storedHall) {
            setHallName(storedHall);
          }
        } catch (error) {
          console.log('Failed to load hall name', error);
        }
      };
      
      loadHallName();

    }, [])
  );
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning || isProcessing) return;

    setIsScanning(false);
    setIsProcessing(true);

    try {
      const result = await scanApi(data);

      setLastScanResult({
        status: result.success ? "success" : "failure",
        message: result.message,
        meal: result.meal
      });

      if (result.success) {
        if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = setTimeout(() => {
          setLastScanResult({ status: null, message: "Ready to scan", meal: null });
        }, 5000) as any;
      }

    } catch (e) {
      setLastScanResult({ status: "failure", message: "Error processing scan", meal: null });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setLastScanResult({ status: null, message: "Scanning...", meal: null });
  };

  if (!permission) return <View style={styles.container}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission is required.</Text>
        <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
          <Text style={styles.scanButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.hallName}>{hallName}</Text>
        <Text style={styles.subtitle}>Token Scanner</Text>
      </View>

      <View style={styles.cameraWrapper}>
        {isScanning ? (
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.overlayText}>Align QR code within frame</Text>
            </View>
          </CameraView>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Ionicons name="qr-code-outline" size={80} color="#444" />
            <Text style={styles.placeholderText}>ready to scan </Text>
          </View>
        )}
      </View>


      <View style={[
        styles.feedbackBox,
        lastScanResult.status === 'success' ? styles.successBox :
          lastScanResult.status === 'failure' ? styles.errorBox : styles.neutralBox
      ]}>
        {isProcessing ? (
          <>
            <ActivityIndicator size={32} color="#4F46E5" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.feedbackText, { color: "#4F46E5", fontWeight: "bold" }]}>
                Validating Token...
              </Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons
              name={lastScanResult.status === 'success' ? "checkmark-circle" :
                lastScanResult.status === 'failure' ? "alert-circle" : "qr-code-outline"}
              size={32}
              color={lastScanResult.status === 'success' ? "#059669" :
                lastScanResult.status === 'failure' ? "#DC2626" : "#6B7280"}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={[
                styles.feedbackText,
                {
                  color: lastScanResult.status === 'success' ? "#059669" :
                    lastScanResult.status === 'failure' ? "#DC2626" : "#374151"
                }
              ]}>
                {lastScanResult.message}
              </Text>
              {lastScanResult.meal && (
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#059669', marginTop: 4 }}>
                  Meal: {lastScanResult.meal.toUpperCase()}
                </Text>
              )}
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.scanButton, (isScanning || isProcessing) && styles.disabledButton]}
        onPress={handleStartScan}
        disabled={isScanning || isProcessing}
      >
        <Ionicons name="camera" size={24} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.scanButtonText}>
          {isScanning ? "Scanning..." : "Tap to Scan"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'space-between'
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  hallName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },


  cameraWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 20,
    justifyContent: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB'
  },
  placeholderText: {
    color: '#6B7280',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600'
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    borderRadius: 20
  },
  overlayText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },

  // Feedback Box
  feedbackBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    minHeight: 70,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  neutralBox: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
  },
  successBox: {
    backgroundColor: "#D1FAE5",
    borderColor: "#34D399",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#F87171",
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Button
  scanButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }
  },
  disabledButton: {
    backgroundColor: "#A5B4FC",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#4B5563'
  }
});
