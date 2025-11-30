import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    };
  }, []);

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
          <Text style={styles.scanButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              { color: feedbackColor },
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
    </View>
  );
}

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
    paddingBottom: 30,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
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
  },
  camera: {
    flex: 1,
  },
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
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "600",
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

  },
  scanButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
});
