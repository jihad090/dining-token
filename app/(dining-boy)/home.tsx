import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import io from 'socket.io-client';
interface MealStatus {
  totalMealsToday: number;
  mealsEaten: number;
  nextFeastAnnouncement: string | null;
}

interface ScanRecord {
  id: string;
  meal: 'Lunch' | 'Dinner';
  date: string;
  isSuccessful: boolean;
  scanTime: string;
}

const HALL_TIMINGS = {
  LUNCH_START: 9,
  DINNER_START: 21,
};

const INITIAL_STATUS: MealStatus = {
  totalMealsToday: 180,
  mealsEaten: 0,
  nextFeastAnnouncement: 'Monthly special dinner on 20 Nov 2025!',
};






const fetchDiningBoyData = async (): Promise<{ status: MealStatus, history: ScanRecord[],hallName: string }> => {//change
  try {

    const token = await AsyncStorage.getItem('userToken');
    const storedHallName = await AsyncStorage.getItem('hallName');
    if (!token) {
      console.log("No token found in storage");
      return { status: INITIAL_STATUS, history: [],hallName: 'Muktijoddha Hall' };//change
    }

    // 2. Call API
    const response = await fetch(`${API_BASE_URL}/dining-token/dining-boy/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`API Error: ${response.status} - ${text}`);
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    const mappedHistory: ScanRecord[] = data.history.map((item: any) => {
      const dateObj = new Date(item.scannedAt);
      return {
        id: item.tokenID,
        meal: item.mealType,
        date: dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        isSuccessful: true, 
        scanTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });

    return {
      status: {
        ...INITIAL_STATUS,
        mealsEaten: data.count,
      },
      history: mappedHistory,
      hallName: data.hallName || storedHallName || 'Muktijoddha Hall',//change
    };

  } catch (error) {
    console.error("Error fetching dining history:", error);
    const storedHallName = await AsyncStorage.getItem('hallName');
    return { status: INITIAL_STATUS, history: [],hallName: storedHallName || 'Muktijoddha Hall' };//here change
  }
};

export default function DiningBoyDashboard() {
  const [mealStatus, setMealStatus] = useState<MealStatus>(INITIAL_STATUS);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
const [hallName, setHallName] = useState<string>('Loading Hall...');

  const tokensRemaining = mealStatus.totalMealsToday - mealStatus.mealsEaten;
  const tokenWarning = mealStatus.mealsEaten > mealStatus.totalMealsToday * 0.8;
  const now = new Date();
  const currentHour = now.getHours();

  let nextMealTime: Date;
  let currentMealName: 'Lunch' | 'Dinner' | 'None' = 'None';
  let nextMealName: 'Lunch' | 'Dinner';

  if (currentHour < HALL_TIMINGS.LUNCH_START) {
    nextMealTime = new Date(now.setHours(HALL_TIMINGS.LUNCH_START, 0, 0, 0));
    nextMealName = 'Lunch';
  } else if (currentHour < HALL_TIMINGS.DINNER_START) {
    nextMealTime = new Date(now.setHours(HALL_TIMINGS.DINNER_START, 0, 0, 0));
    nextMealName = 'Dinner';
    currentMealName = 'Lunch';
  } else {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextMealTime = new Date(tomorrow.setHours(HALL_TIMINGS.LUNCH_START, 0, 0, 0));
    nextMealName = 'Lunch';
    currentMealName = 'Dinner';
  }

  const timeDifferenceMs = nextMealTime.getTime() - now.getTime();
  const hoursUntilNextMeal = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
  const minutesUntilNextMeal = Math.ceil((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));


const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'accessToken', 'userToken']);
      
      setMealStatus(INITIAL_STATUS);
      setScanHistory([]);

      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
      router.replace('/login');
    }
  };



useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      const loadData = async () => {
        const data = await fetchDiningBoyData();

        if (isActive) {
          if (data === null) {
            console.log("Session invalid, redirecting to login...");
            handleLogout(); 
          } else {
            setMealStatus(data.status);
            setScanHistory(data.history);
            setHallName(data.hallName); 
            setLoading(false);
          }
        }
      };

      loadData();

      return () => { isActive = false; };
    }, [])
  );





  const handleViewToken = (record: ScanRecord) => {
    Alert.alert(
      `${record.meal} Token Scan Details`,
      `Token ID (QR Value): ${record.id}\nStatus: ${record.isSuccessful ? 'Successful' : 'Failed'}\nScan Time: ${record.scanTime}`,
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  const formatCountdown = (h: number, m: number) => {
    if (h > 0) return `${h} hr ${m} min`;
    if (m > 0) return `${m} minutes`;
    return 'Starting Now!';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>{hallName}</Text>
      <Text style={styles.dashboardTitle}>Dining Boy Dashboard</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.timelineCard}>
          <View style={styles.timelineRow}>
            <Ionicons name="timer-outline" size={24} color="#6366F1" />
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Next Service: {nextMealName}</Text>
              <Text style={styles.timelineSubtitle}>
                Starts in <Text style={{ fontWeight: '700', color: '#6366F1' }}>{formatCountdown(hoursUntilNextMeal, minutesUntilNextMeal)}</Text>
              </Text>
            </View>
            <Text style={styles.currentMealText}>
              {currentMealName !== 'None' ? currentMealName : 'Closed'}
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>
              <Ionicons name="restaurant-outline" size={18} color="#10B981" /> Hall Today's Status
            </Text>
          </View>

          <View style={styles.statsRow}>
            <MealStat label="Total Tokens" value={mealStatus.totalMealsToday} width={'33%'} />
            <MealStat label="Successfull Scan" value={mealStatus.mealsEaten} width={'33%'} />
            <MealStat label="Invalid Scan" value={0} width={'33%'} highlight={true} />
          </View>

          {tokenWarning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Token Pool Low! **{tokensRemaining}** tokens left for the day.
              </Text>
            </View>
          )}
        </View>

        {mealStatus.nextFeastAnnouncement && (
          <TouchableOpacity style={styles.announcementCard}>
            <View style={styles.announcementContent}>
              <Ionicons name="gift-outline" size={24} color="#C026D3" style={styles.announcementIcon} />
              <Text style={styles.announcementText}>
                {mealStatus.nextFeastAnnouncement}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C026D3" />
          </TouchableOpacity>
        )}

        <Text style={styles.sectionHeader}>Today's Recent Scans ({scanHistory.length})</Text>

        {scanHistory.map((record) => (
          <ScanHistoryItem
            key={record.id}
            record={record}
            onPress={handleViewToken}
          />
        ))}

        {scanHistory.length === 0 && (
          <Text style={styles.noHistoryText}>No tokens have been scanned today yet.</Text>
        )}

      </ScrollView>

      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logout}
      >
        <AntDesign name="logout" size={24} color="black" />
      </TouchableOpacity>

    </View>
  );
}


const MealStat = ({ label, value, highlight = false, width = '50%' }: { label: string, value: number, highlight?: boolean, width?: string }) => (
  <View style={[styles.statItem]}>
    <Text style={[styles.statValue, highlight && { color: '#EF4444' }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ScanHistoryItem = ({ record, onPress }: { record: ScanRecord, onPress: (record: ScanRecord) => void }) => {
  const color = record.isSuccessful ? "#10B981" : "#EF4444";
  const iconName = record.isSuccessful ? "checkmark-circle-outline" : "close-circle-outline";
  const statusText = record.isSuccessful
    ? `Successful at ${record.scanTime}`
    : 'Scan Failed/Token Invalid';

  return (
    <TouchableOpacity
      onPress={() => onPress(record)}
      style={[styles.historyItemButton, { borderLeftColor: color }]}
    >
      <View style={styles.historyItemContent}>
        <Ionicons name={iconName as any} size={24} color={color} style={styles.historyIcon} />
        <View>
          <Text style={[styles.historyItemLabel]}>{`${record.date} (${record.meal} Token)`}</Text>
          <Text style={[styles.historyItemSubtext, { color }]}>{statusText}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  hallName: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dashboardTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#6366F1',
    elevation: 3,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  currentMealText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    padding: 5,
    borderRadius: 6,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  warningText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
    textAlign: 'center',
  },
  announcementCard: {
    backgroundColor: '#F3E8FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  announcementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  announcementIcon: {
    marginRight: 10,
  },
  announcementText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C026D3',
  },
  historyItemButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyItemSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  historyIcon: {
    marginRight: 15,
  },
  noHistoryText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  logout: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
});

