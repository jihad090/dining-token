import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
<<<<<<< HEAD
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
  const [lastScanResult, setLastScanResult] = useState<{
    status: "success" | "failure" | null;
    message: string;
    meal: string | null;
  }>({
    status: null,
    message: "Ready to scan",
    meal: null
  });

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  const scanTimeoutRef = useRef<number | null>(null);
=======
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";

const mockScanApi = (
  scannedToken: string
): Promise<{ success: boolean; tokenValue: string; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.3;

      if (isSuccessful) {
        resolve({
          success: true,
          tokenValue: scannedToken,
          message: `Meal token validated for student ${scannedToken}. Enjoy your meal!`,
        });
      } else {
        resolve({
          success: false,
          tokenValue: scannedToken,
          message: `Invalid or expired token (${scannedToken}). Please verify student details.`,
        });
      }
    }, 1000);
  });
};

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [isScanning, setIsScanning] = useState(false); // camera actively scanning
  const [isProcessing, setIsProcessing] = useState(false); // waiting for API
  const [lastScanResult, setLastScanResult] = useState<{
    status: "success" | "failure" | null;
    message: string;
  }>({
    status: null,
    message: "Press the button below to start scanning.",
  });

  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    };
  }, []);

<<<<<<< HEAD
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
         }, 5000);
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
=======
  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.hallName}>Muktijoddha Hall</Text>
        <Text style={[styles.subtitle, { marginBottom: 20 }]}>
          Dining Token QR Scanner
        </Text>
        <Text style={styles.permissionText}>
          Camera permission is required to scan dining tokens.
        </Text>
        <TouchableOpacity
          style={[styles.scanButton, { marginTop: 24 }]}
          onPress={requestPermission}
        >
          <Ionicons name="camera-outline" size={26} color="#fff" />
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
          <Text style={styles.scanButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

<<<<<<< HEAD
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.hallName}>Muktijoddha Hall</Text>
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
              { color: lastScanResult.status === 'success' ? "#059669" : 
                     lastScanResult.status === 'failure' ? "#DC2626" : "#374151" }
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
        <Ionicons name="camera" size={24} color="#fff" style={{marginRight: 8}} />
        <Text style={styles.scanButtonText}>
            {isScanning ? "Scanning..." : "Tap to Scan"}
        </Text>
      </TouchableOpacity>

=======
  const handleStartScan = () => {
    // clear any existing timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    setIsScanning(true);
    setIsProcessing(false);
    setLastScanResult({
      status: null,
      message: "Point the camera at the diner's QR token.",
    });

    scanTimeoutRef.current = setTimeout(() => {
      setIsScanning(false);
      setLastScanResult((prev) => {
        if (prev.status) return prev;
        return {
          status: "failure",
          message: "Scan timed out. Please try again.",
        };
      });
    }, 10000);
  };

  const handleBarcodeScanned = async ({
    data,
  }: {
    data: string;
    type: string;
  }) => {
    if (!isScanning || isProcessing) return; 

    setIsScanning(false);
    setIsProcessing(true);


    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    setLastScanResult({
      status: null,
      message: "Validating token…",
    });

    try {
      const result = await mockScanApi(data);

      if (result.success) {
        setLastScanResult({
          status: "success",
          message: `SUCCESS! Token ${result.tokenValue} validated.`,
        });
        Alert.alert("Scan Successful", result.message, [{ text: "OK" }]);
      } else {
        setLastScanResult({
          status: "failure",
          message: `FAILURE! Token ${result.tokenValue} invalid.`,
        });
        Alert.alert("Scan Failed", result.message, [{ text: "OK" }]);
      }
    } catch (e) {
      setLastScanResult({
        status: "failure",
        message: "Something went wrong while validating token.",
      });
      Alert.alert("Error", "Could not validate token. Please retry.", [
        { text: "OK" },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const feedbackColor =
    lastScanResult.status === "success"
      ? "#10B981"
      : lastScanResult.status === "failure"
      ? "#EF4444"
      : "#6B7280";

  const feedbackBackgroundColor =
    lastScanResult.status === "success"
      ? "#D1FAE5"
      : lastScanResult.status === "failure"
      ? "#FEE2E2"
      : "#E5E7EB";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View>
        <Text style={styles.hallName}>Muktijoddha Hall</Text>
        {/* <Text style={styles.subtitle}>Dining Token QR Scanner</Text> */}
      </View>

      <View style={styles.scannerArea}>
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "code128"],
            }}
            onBarcodeScanned={
              isScanning ? (event) => handleBarcodeScanned(event) : undefined
            }
          >
            <View style={styles.cameraOverlay}>
              <View className="scanFrame" style={styles.scanFrame} />
              <Text style={styles.overlayText}>
                {isScanning
                  ? "Align the QR code within the frame"
                  : "Press 'Start Scan' to begin"}
              </Text>
            </View>
          </CameraView>
        </View>

        {/* Visual Feedback Box */}
        <View
          style={[
            styles.feedbackBox,
            { backgroundColor: feedbackBackgroundColor },
          ]}
        >
          <Ionicons
            name={
              lastScanResult.status === "success"
                ? "checkmark-circle"
                : lastScanResult.status === "failure"
                ? "close-circle"
                : "scan-outline"
            }
            size={35}
            color={feedbackColor}
          />
          <Text
            style={[
              styles.feedbackText,
              { color: feedbackColor},
            ]}
          >
            {lastScanResult.message}
          </Text>
          {(isScanning || isProcessing) && (
            <ActivityIndicator
              size="large"
              color="#4F46E5"
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity
        style={[
          styles.scanButton,
          (isScanning || isProcessing) && { opacity: 0.7 },
        ]}
        onPress={handleStartScan}
        disabled={isScanning || isProcessing}
      >
        <Ionicons name="qr-code-outline" size={26} color="#fff" />
        <Text style={styles.scanButtonText}>
          {isScanning || isProcessing ? "Scanning..." : "Start Scan"}
        </Text>
      </TouchableOpacity>
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
    </View>
  );
}

<<<<<<< HEAD
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
=======
// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "space-between",
    paddingTop: 50,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  hallName: {
    textAlign: "center",
    fontSize: 28,
    paddingBottom:30,
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
<<<<<<< HEAD
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
=======
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "500",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
    paddingHorizontal: 24,
  },
  scannerArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  cameraWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 16,
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  },
  camera: {
    flex: 1,
  },
<<<<<<< HEAD
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
=======
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  scanFrame: {
    width: "70%",
    height: "55%",
    borderWidth: 3,
    borderColor: "#ffffff",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  overlayText: {
    color: "#E5E7EB",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  feedbackBox: {
    width: "100%",
    minHeight: 40,
    flexDirection: "row",
    height: 50,
    borderRadius: 20,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "600",
<<<<<<< HEAD
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
=======
    textAlign: "center",
    flex: 1,
    alignItems: "center",
  },
  scanButton: {
    height: 60,
    backgroundColor: "#4F46E5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 20,
    flexDirection: "row",
    // removed 'gap' for better RN compatibility
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
});
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
