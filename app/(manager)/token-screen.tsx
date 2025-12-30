import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import QRCode from 'react-native-qrcode-svg';

interface ActiveToken {
  _id: string;
  tokenID: string;
  mealType: 'Lunch' | 'Dinner';
  status: string;
  date: string;
  ownerId?: {
      name: string;
      hallName: string;
  };
}

export default function TokenScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTokens, setActiveTokens] = useState<ActiveToken[]>([]);
const [localHallName, setLocalHallName] = useState('My Hall');
  const [selectedMeal, setSelectedMeal] = useState<'Lunch' | 'Dinner'>('Lunch');

  const fetchStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedHall = await AsyncStorage.getItem('hallName'); 
      if(storedHall) setLocalHallName(storedHall);
      const response = await fetch(`${API_BASE_URL}/dining-token/my-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setActiveTokens(data.tokens || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 21) {
      setSelectedMeal('Dinner');
    } else {
      setSelectedMeal('Lunch');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStatus();
    }, [])
  );

  const isScanTimeForSelected = () => {
    const hour = new Date().getHours();
    if (selectedMeal === 'Lunch') {
      return hour >= 9 && hour < 15;
    } else {
      return hour >= 21 && hour < 23;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#1F2937" style={{ marginTop: 50 }} />;
    }

    const token = activeTokens.find(t => t.mealType === selectedMeal);
    const isTime = isScanTimeForSelected();

    // 1. No Token
    if (!token) {
      return (
        <View style={styles.centerBox}>
          <Ionicons name="fast-food-outline" size={80} color="#ccc" />
          <Text style={styles.noTokenText}>No {selectedMeal} Token</Text>
          <Text style={styles.subText}>
            You haven't purchased any token for today's {selectedMeal}.
          </Text>
        </View>
      );
    }

    if (token.status === 'Used') {
      return (
        <View style={styles.centerBox}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
          <Text style={[styles.noTokenText, { color: '#10B981' }]}>Already Eaten</Text>
          <Text style={styles.subText}>
            You have successfully consumed your {selectedMeal}.
          </Text>
          <Text style={styles.tokenIdText}>ID: {token.tokenID}</Text>
        </View>
      );
    }

    if (!isTime) {
      const timeMsg = selectedMeal === 'Lunch' ? "9:00 AM - 3:00 PM" : "9:00 PM - 11:00 PM";
      return (
        <View style={styles.centerBox}>
          <Ionicons name="time-outline" size={80} color="#F59E0B" />
          <Text style={styles.waitText}>Scanning Inactive</Text>
          <Text style={styles.subText}>
            {selectedMeal} QR code will be available between:
          </Text>
          <Text style={[styles.subText, { fontWeight: 'bold', marginTop: 5, color: '#333' }]}>{timeMsg}</Text>
          <Text style={styles.tokenIdText}>Token ID: {token.tokenID}</Text>
        </View>
      );
    }

    return (
      <View style={styles.qrContainer}>
        <Text style={styles.qrTitle}>{selectedMeal} QR Code</Text>
        <View style={styles.qrBorder}>
          <QRCode
            value={token.tokenID}
            size={220}
            color="black"
            backgroundColor="white"
          />
        </View>
        <View style={styles.tokenInfoBox}>
         <Text style={styles.hallNameText}>
           {token.ownerId?.hallName || localHallName}
          </Text>
         <Text style={styles.activeStatus}>● READY TO SCAN</Text>
        </View>
        <Text style={styles.warningText}>*Show this QR to the dining boy</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerTitle}>My Tokens</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStatus(); }} />}
      >
        {renderContent()}
      </ScrollView>

      <View style={styles.bottomFloatingContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, selectedMeal === 'Lunch' && styles.activeToggleBtn]}
            onPress={() => setSelectedMeal('Lunch')}
          >
            <Text style={[styles.toggleText, selectedMeal === 'Lunch' && styles.activeToggleText]}>Lunch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, selectedMeal === 'Dinner' && styles.activeToggleBtn]}
            onPress={() => setSelectedMeal('Dinner')}
          >
            <Text style={[styles.toggleText, selectedMeal === 'Dinner' && styles.activeToggleText]}>Dinner</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f7f8fa', paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },

  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 120, alignItems: 'center' },

  bottomFloatingContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 5,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  activeToggleBtn: {
    backgroundColor: '#1F2937',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeToggleText: {
    color: '#fff',
  },

  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: '100%'
  },
  noTokenText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15
  },
  waitText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginTop: 15
  },
  subText: {
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22
  },
  tokenIdText: {
    marginTop: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden'
  },
hallNameText: { fontSize: 30, fontWeight: 'bold', color: '#1F2937' },
  qrContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    textTransform: 'uppercase'
  },
  qrBorder: { padding: 15, backgroundColor: '#fff', borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  tokenInfoBox: { marginTop: 30, alignItems: 'center' },
  tokenText: { fontSize: 22, fontWeight: 'bold', color: '#333', letterSpacing: 1 },
  activeStatus: {
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14
  },
  warningText: {
    marginTop: 20,
    color: '#999',
    fontSize: 12
  }
});
