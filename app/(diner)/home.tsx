import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

interface MealStatus {
  totalMealsToday: number;
  mealsEaten: number;
  nextFeastAnnouncement: string | null;
  personalWeeklyMealCount: number; 
}

interface TokenStatus {
  lunchScanned: boolean;
  dinnerScanned: boolean;
}

const HALL_TIMINGS = {
  LUNCH_START: 16, 
  DINNER_START: 20, 
};


const fetchDinerData = async (): Promise<{ status: MealStatus; tokens: TokenStatus }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const total = 180;
  const eaten = 155;

  return {
    status: {
      totalMealsToday: total,
      mealsEaten: eaten,
      nextFeastAnnouncement: 'Monthly special dinner on 20 Nov 2025!',
      personalWeeklyMealCount: 17, 
    },
    tokens: {
      lunchScanned: true,
      dinnerScanned: false,
    },
  };
};

export default function DinerDashboard() {
  const [mealStatus, setMealStatus] = useState<MealStatus>({
    totalMealsToday: 0,
    mealsEaten: 0,
    nextFeastAnnouncement: null,
    personalWeeklyMealCount: 0,
  });
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>({
    lunchScanned: false,
    dinnerScanned: false,
  });
  const [loading, setLoading] = useState(true);

  // --- Derived State and Logic ---
  const tokensRemaining = mealStatus.totalMealsToday - mealStatus.mealsEaten;
  const tokenWarning = mealStatus.mealsEaten > mealStatus.totalMealsToday * 0.8;
  const now = new Date();
  const currentHour = now.getHours();

  // Determine the current or upcoming meal service
  let nextMealTime: Date;
  let currentMealName: 'Lunch' | 'Dinner' | 'None' = 'None';
  let nextMealName: 'Lunch' | 'Dinner';

  if (currentHour < HALL_TIMINGS.LUNCH_START) {
    // Before Lunch
    nextMealTime = new Date(now.setHours(HALL_TIMINGS.LUNCH_START, 0, 0, 0));
    nextMealName = 'Lunch';
  } else if (currentHour < HALL_TIMINGS.DINNER_START) {
    // Between Lunch and Dinner
    nextMealTime = new Date(now.setHours(HALL_TIMINGS.DINNER_START, 0, 0, 0));
    nextMealName = 'Dinner';
    currentMealName = 'Lunch';
  } else {
    // After Dinner (Next meal is Lunch tomorrow)
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
    fetchDinerData().then(data => {
      setMealStatus(data.status);
      setTokenStatus(data.tokens);
      setLoading(false);
    });
  }, []);

  const handleViewToken = (scanHistory:any) => {
    if(scanHistory==true){
      Alert.alert(
        `Scanned successfully on time`,
        `Token ID: 2104090-L-121212\nScanning Date: 10 Nov 2025  \nScanning Time: 01:00 pm`,
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );      
    }else{
      Alert.alert(
        `Missed to scan `,
        `Token ID: 2104090-L-121212 \nDuration was 12:00 pm - 02:00 pm \nDate: 10 Nov 2025`,
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }

  };

  const handleOrderToken = () => {
    console.log('Navigating to Token Order screen...');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dining info...</Text>
      </View>
    );
  }

  // Helper function to format the countdown text
  const formatCountdown = (h: number, m: number) => {
      if (h > 0) return `${h} hr ${m} min`;
      if (m > 0) return `${m} minutes`;
      return 'Starting Soon!';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>Muktijoddha Hall</Text>
      <Text style={styles.dashboardTitle}>Diner Dashboard</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* --- 1. Meal Service Timeline Card --- */}
        <View style={styles.timelineCard}>
            <View style={styles.timelineRow}>
                <Ionicons name="timer-outline" size={24} color="#6366F1" />
                <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineTitle}>Next Service: {nextMealName}</Text>
                    <Text style={styles.timelineSubtitle}>
                        <Text style={{fontWeight: '700', color: '#6366F1'}}>{formatCountdown(hoursUntilNextMeal, minutesUntilNextMeal)}</Text>
                    </Text>
                </View>
                <Text style={styles.currentMealText}>
                    {/* {currentMealName !== 'None' ? `Current: ${currentMealName}` : ''} */}
                    Lunch
                </Text>
            </View>
        </View>

        {/* --- 2. Combined Status Card (Hall & Personal) --- */}
        <View style={styles.statusCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                    <Ionicons name="restaurant-outline" size={18} color="#10B981" /> Hall Today's Status
                </Text>
            </View>

            <View style={styles.statsRow}>
                <MealStat label="Total Meals" value={mealStatus.totalMealsToday} width={'50%'} />
                <MealStat label="Eaten Tokens" value={mealStatus.mealsEaten} width={'50%'} highlight={true} />
                {/* <MealStat label="Weekly Usage" value={mealStatus.personalWeeklyMealCount} width={'33%'} highlight={false} icon="calendar-outline" /> */}
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

        <Text style={styles.sectionHeader}>Your token history</Text>
        
        <ActionButton 
          label="10 Nov 2025 (Lunch Token)"
          subtext={tokenStatus.lunchScanned ? 'Status: Scanned on time' : 'Status: Missed'}
          color={tokenStatus.lunchScanned ? "#15B392" : "#d40b0b"} // Blue for Lunch
          onPress={() => handleViewToken(tokenStatus.lunchScanned)}
          disabled={false}
        />
        <ActionButton 
          label="10 Nov 2025 (Dinner Token)"
          subtext={tokenStatus.dinnerScanned ? 'Status: Scanned on time' : 'Status: Missed'}
          color={tokenStatus.dinnerScanned ? "#15B392" : "#d40b0b"} // Blue for Lunch
          onPress={() => handleViewToken(tokenStatus.dinnerScanned)}
          disabled={false}
        />
        <ActionButton 
          label="9 Nov 2025 (Dinner Token)"
          subtext={tokenStatus.dinnerScanned ? 'Status: Scanned on time' : 'Status: Missed'}
          color={tokenStatus.dinnerScanned ? "#15B392" : "#d40b0b"} // Blue for Lunch
          onPress={() => handleViewToken(tokenStatus.dinnerScanned)}
          disabled={false}
        /> 
      </ScrollView>

      <TouchableOpacity 
        onPress={()=>{router.push('/login')}} 
        style={styles.logout}
      >
        <AntDesign name="logout" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={handleOrderToken} 
        style={styles.fab}
      >
        <Ionicons name="add-circle" size={30} color="#fff" />
        <Text style={styles.fabText}>Order Next Token</Text>
      </TouchableOpacity>

    </View>
  );
}


const MealStat = ({ label, value, highlight = false, width = '50%', icon }: { label: string, value: number, highlight?: boolean, width?: string, icon?: string }) => (
  <View style={[styles.statItem]}>
    {icon && <Ionicons name={icon as any} size={20} color="#6B7280" />}
    <Text style={[styles.statValue, highlight && { color: '#EF4444' }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButton = ({ label, subtext, onPress, color, disabled }: { label: string, subtext: string, onPress: () => void, color: string, disabled: boolean }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[
      styles.actionButton, 
      { backgroundColor: color }, 
      disabled && styles.disabledButton
    ]}
    disabled={disabled}
  >
    <View style={styles.actionButtonContent}>
      <Ionicons 
        name={disabled ? "checkmark-circle-outline" : "qr-code-outline"} 
        size={24} 
        color="#fff" 
        style={styles.qrIcon} 
      />
      <View>
        <Text style={styles.actionButtonText}>{label}</Text>
        <Text style={styles.actionButtonSubtext}>{subtext}</Text>
      </View>
    </View>
    {!disabled && <Ionicons name="chevron-forward" size={20} color="#fff" />}
  </TouchableOpacity>
);


// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Make room for the FAB
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
  // 4. Action Button Styles
  actionButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  actionButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  qrIcon: {
    marginRight: 15,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.8,
  },
  // 5. FAB Styles
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F97316',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logout: {
    position: 'absolute',
    top: 50,
    right: 20,
    // backgroundColor: '#133386',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#f5f5f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});