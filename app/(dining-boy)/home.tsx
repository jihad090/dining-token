import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

// --- Types & Constants ---
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
  LUNCH_START: 16, 
  DINNER_START: 20, 
};

// Mock data for scan history
const mockScanHistory: ScanRecord[] = [
  { id: '2104090-L-121212', meal: 'Lunch', date: '10 Nov 2025', isSuccessful: true, scanTime: '13:05' },
  { id: '2104091-D-121213', meal: 'Dinner', date: '10 Nov 2025', isSuccessful: true, scanTime: '20:15' },
  { id: '2104092-L-121214', meal: 'Lunch', date: '09 Nov 2025', isSuccessful: false, scanTime: '12:45' },
];


const fetchDiningBoyData = async (): Promise<{ status: MealStatus, history: ScanRecord[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const total = 180;
  // Meals eaten is now derived from the mock history
  const mealsEatenCount = mockScanHistory.filter(r => r.isSuccessful).length;

  return {
    status: {
      totalMealsToday: total,
      mealsEaten: mealsEatenCount,
      nextFeastAnnouncement: 'Monthly special dinner on 20 Nov 2025!',
    },
    history: mockScanHistory,
  };
};

export default function DiningBoyDashboard() {
  const [mealStatus, setMealStatus] = useState<MealStatus>({
    totalMealsToday: 0,
    mealsEaten: 0,
    nextFeastAnnouncement: null,
  });
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Derived State and Logic (Hall Status) ---
  const tokensRemaining = mealStatus.totalMealsToday - mealStatus.mealsEaten;
  const tokenWarning = mealStatus.mealsEaten > mealStatus.totalMealsToday * 0.8;
  const now = new Date();
  const currentHour = now.getHours();

  // Determine the current or upcoming meal service
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
  // --- End Derived State and Logic ---

  useEffect(() => {
    setLoading(true);
    fetchDiningBoyData().then(data => {
      setMealStatus(data.status);
      setScanHistory(data.history);
      setLoading(false);
    });
  }, []);

  // Action: Display token details (QR code value and status)
  const handleViewToken = (record: ScanRecord) => {
    Alert.alert(
      `${record.meal} Token Scan Details`,
      `Token ID (QR Value): ${record.id}\nStatus: ${record.isSuccessful ? 'Successful' : 'Failed'}\nScan Time: ${record.scanTime }`,
      [{ text: 'OK', style: 'cancel' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading hall management info...</Text>
      </View>
    );
  }

  // Helper function to format the countdown text
  const formatCountdown = (h: number, m: number) => {
      if (h > 0) return `${h} hr ${m} min`;
      if (m > 0) return `${m} minutes`;
      return 'Starting Now!';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>Muktijoddha Hall</Text>
      <Text style={styles.dashboardTitle}>Token Management Dashboard</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* --- 1. Meal Service Timeline Card --- */}
        <View style={styles.timelineCard}>
            <View style={styles.timelineRow}>
                <Ionicons name="timer-outline" size={24} color="#6366F1" />
                <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineTitle}>Next Service: {nextMealName}</Text>
                    <Text style={styles.timelineSubtitle}>
                        Starts in <Text style={{fontWeight: '700', color: '#6366F1'}}>{formatCountdown(hoursUntilNextMeal, minutesUntilNextMeal)}</Text>
                    </Text>
                </View>
                <Text style={styles.currentMealText}>
                    {currentMealName !== 'None' ? currentMealName : 'Closed'}
                </Text>
            </View>
        </View>

        {/* --- 2. Combined Status Card (Hall Status Only) --- */}
        <View style={styles.statusCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                    <Ionicons name="restaurant-outline" size={18} color="#10B981" /> Hall Today's Status
                </Text>
            </View>

            <View style={styles.statsRow}>
                <MealStat label="Total Tokens" value={mealStatus.totalMealsToday} width={'33%'} />
                <MealStat label="Successfull Scan" value={mealStatus.totalMealsToday-10} width={'33%'} />
                <MealStat label="Invalid Scan" value={mealStatus.mealsEaten} width={'33%'} highlight={true} />
            </View>

            {tokenWarning && (
                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        ⚠️ Token Pool Low! **{tokensRemaining}** tokens left for the day.
                    </Text>
                </View>
            )}
        </View>

        {/* --- 3. Feast Announcement --- */}
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
        
        {/* --- 4. Scan History List (Core Feature for Dining Boy) --- */}
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

      {/* --- Logout Button --- */}
      <TouchableOpacity 
        onPress={() => router.push('/login')} 
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
    const color = record.isSuccessful ? "#10B981" : "#EF4444"; // Success (Green) / Failure (Red)
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
                    <Text style={[styles.historyItemSubtext, {color}]}>{statusText}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
    );
};


// --- Stylesheet ---
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
  // 1. Timeline Card Styles
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
  // 2. Status Card Styles
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
  // 3. Announcement Card Styles
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
  // 4. Scan History Item Styles
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
  // Logout Styles
  logout: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
});