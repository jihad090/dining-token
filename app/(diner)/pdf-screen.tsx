import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';

const COLUMNS = 6;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 1;
const GAP = 2;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING - (GAP * (COLUMNS - 1))) / COLUMNS;

interface Token {
  _id: string;
  tokenID: string;
  mealType: 'Lunch' | 'Dinner';
  date: string;
  status: string;
}

export default function PdfScreen() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
const [hallName, setHallName] = useState<string>('Muktijoddha Hall');
  useFocusEffect(
    React.useCallback(() => {
      fetchUpcomingTokens();
    }, [])
  );

  const fetchUpcomingTokens = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      const storedHallName = await AsyncStorage.getItem('hallName');
      if (storedHallName) {
        setHallName(storedHallName);
      }
      const response = await fetch(`${API_BASE_URL}/dining-token/upcoming`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setTokens(data || []);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (tokens.length === 0) {
      Alert.alert("No Data", "No upcoming tokens to print.");
      return;
    }

    setGeneratingPdf(true);
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              h1 { text-align: center; margin-bottom: 5px; font-size: 18px; }
              h2 { text-align: center; color: #666; margin-bottom: 20px; font-size: 14px; font-weight: normal; }
              
              /* CSS GRID: 5 COLUMNS */
              .grid-container {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 5px;
                width: 100%;
              }

              .token-card {
                border: 1px solid #000;
                padding: 4px;
                text-align: center;
                border-radius: 4px;
                height: 110px; /* Fixed height like the image */
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                page-break-inside: avoid;
              }

              .date { font-size: 9px; font-weight: bold; color: #333; }
              .qr-code { width: 65px; height: 65px; display: block; }
              .footer { font-size: 8px; font-weight: bold; width: 100%; display: flex; justify-content: center; gap: 4px; align-items: center; }
              .badge { background-color: #eee; padding: 2px 4px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>${hallName}</h1>
            <h2>All Token PDF</h2>
            <div class="grid-container">
              ${tokens.map(token => {
        const date = new Date(token.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        // Generate QR URL
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token.tokenID}`;

        return `
                  <div class="token-card">
                    <span class="date">${date}</span>
                    <img src="${qrUrl}" class="qr-code" />
                    <div class="footer">
                      <span>${token.tokenID.slice(-5)}</span>
                      <span class="badge">${token.mealType.charAt(0)}</span>
                    </div>
                  </div>
                `;
      }).join('')}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    } catch (error) {
      Alert.alert("Error", "Could not generate PDF");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#b09160" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>{hallName}</Text>
      <Text style={styles.subtitle}>All Token PDF</Text>

      <View style={styles.gridWrapper}>
        <ScrollView contentContainerStyle={styles.gridScroll}>
          {tokens.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming tokens available.</Text>
          ) : (
            <View style={styles.gridContainer}>
              {tokens.map((token) => (
                <View key={token._id} style={styles.card}>
                  {/* Top: Date */}
                  <Text style={styles.dateText}>
                    {new Date(token.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </Text>

                  <View style={styles.qrContainer}>
                    <QRCode value={token.tokenID} size={42} />
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.idText}>{token.tokenID.slice(-5)}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{token.mealType.charAt(0)}</Text>
                    </View>
                  </View>
                </View>
              ))}

            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownloadPdf}
        disabled={generatingPdf}
      >
        {generatingPdf ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.downloadButtonText}>Download PDF</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
    justifyContent: 'flex-start',
  },
  hallName: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 8,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },

  gridWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    overflow: 'hidden'
  },
  gridScroll: {
    padding: 10,
    alignItems: 'center'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: GAP,
    width: '100%'
  },

  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    backgroundColor: '#fff'
  },
  dateText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333'
  },
  qrContainer: {
    overflow: 'hidden',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  idText: {
    fontSize: 7,
    color: '#333',
    fontWeight: '600'
  },
  badge: {
    backgroundColor: '#eee',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3
  },
  badgeText: {
    fontSize: 7,
    fontWeight: 'bold'
  },

  emptyText: {
    marginTop: 50,
    color: '#999',
    fontSize: 16
  },
  downloadButton: {
    height: 48,
    backgroundColor: '#b09160',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
