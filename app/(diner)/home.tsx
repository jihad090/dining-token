

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Modal, TextInput, RefreshControl
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';

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

interface HistoryItem {
  _id: string;
  tokenID: string;
  mealType: 'Lunch' | 'Dinner';
  date: string;
  status: string;
  scannedAt?: string;
}

const HALL_TIMINGS = {
  LUNCH_START: 9,
  DINNER_START: 21,
};

const fetchDinerData = async (): Promise<{ status: MealStatus; tokens: TokenStatus }> => {
  return {
    status: {
      totalMealsToday: 180,
      mealsEaten: 155,
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
    lunchScanned: true,
    dinnerScanned: false,
  });

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [upcomingTokensCount, setUpcomingTokensCount] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [packageType, setPackageType] = useState<'15_days' | '30_days' | 'rest_month'>('15_days');
  const [bkashNumber, setBkashNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [amount, setAmount] = useState(0);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [submitting, setSubmitting] = useState(false);
const [hasPendingRequest, setHasPendingRequest] = useState(false);
const [myHallName, setMyHallName] = useState<string>('Loading Hall...');
  const MEAL_RATE_PER_DAY = 40;

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'token', 'accessToken']); 
      
      setHistoryList([]);
      
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
      router.replace('/login');
    }
  };

  const tokensRemaining = mealStatus.totalMealsToday - mealStatus.mealsEaten;
  const tokenWarning = mealStatus.mealsEaten > mealStatus.totalMealsToday * 0.8;
  const now = new Date();
  const currentHour = now.getHours();

  let nextMealTime: Date;
  let nextMealName: 'Lunch' | 'Dinner';
  
  if (currentHour < HALL_TIMINGS.LUNCH_START) {
    nextMealTime = new Date(now.setHours(HALL_TIMINGS.LUNCH_START, 0, 0, 0));
    nextMealName = 'Lunch';
  } else if (currentHour < HALL_TIMINGS.DINNER_START) {
    nextMealTime = new Date(now.setHours(HALL_TIMINGS.DINNER_START, 0, 0, 0));
    nextMealName = 'Dinner';
  } else {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextMealTime = new Date(tomorrow.setHours(HALL_TIMINGS.LUNCH_START, 0, 0, 0));
    nextMealName = 'Lunch';
  }
  
  const timeDifferenceMs = nextMealTime.getTime() - now.getTime();
  const hoursUntilNextMeal = Math.max(0, Math.floor(timeDifferenceMs / (1000 * 60 * 60)));
  const minutesUntilNextMeal = Math.max(0, Math.ceil((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)));

  const formatCountdown = (h: number, m: number) => {
    if (h > 0) return `${h} hr ${m} min`;
    if (m > 0) return `${m} minutes`;
    return 'Starting Soon!';
  };

  const loadData = async () => {
    setLoadingHistory(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedHallName = await AsyncStorage.getItem('hallName');
      if (storedHallName) {
        setMyHallName(storedHallName);
      } else {
        setMyHallName(" Welcome CUETian"); 
      }
      if (!token) {
        console.log("No token found, logging out...");
        handleLogout();
        return;
      }

      const data = await fetchDinerData();
      setMealStatus(data.status);
      setTokenStatus(data.tokens); 

      const historyResponse = await fetch(`${API_BASE_URL}/dining-token/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (historyResponse.status === 401) {
        handleLogout();
        return;
      }


      const historyData = await historyResponse.json();
     const isPending = historyData.some((item: any) => item.status === 'PENDING');
    setHasPendingRequest(isPending);

      if (historyResponse.ok) {
        setHistoryList(historyData);
      }

      const trxResponse = await fetch(`${API_BASE_URL}/transactions/my-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (trxResponse.ok) {
        const trxData = await trxResponse.json();
        
        const isPending = trxData.some((item: any) => item.status === 'PENDING');
        setHasPendingRequest(isPending); 
      }

      
      // 2. Fetch Upcoming Tokens 
      const upcomingResponse = await fetch(`${API_BASE_URL}/dining-token/upcoming`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const upcomingData = await upcomingResponse.json();
      
      if (upcomingResponse.ok && Array.isArray(upcomingData)) {
          setUpcomingTokensCount(upcomingData.length); 
      } else {
          setUpcomingTokensCount(0);
      }
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingHistory(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    let days = 0;
    const today = new Date();
    if (packageType === '15_days') days = 15;
    else if (packageType === '30_days') days = 30;
    else if (packageType === 'rest_month') {
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      days = lastDay.getDate() - today.getDate();
      if (days < 0) days = 0;
    }
    setCalculatedDays(days);
    setAmount(days * MEAL_RATE_PER_DAY);
  }, [packageType]);

  const handleOrderPress = () => {
    if (hasPendingRequest) {
      Alert.alert(
        "Request Pending", 
        "You already have a pending request. Please wait for manager approval."
      );
      return; 
    }
    const isOrderBlocked = upcomingTokensCount > 2;
    
    if (isOrderBlocked) {
      const daysCovered = Math.floor(upcomingTokensCount / 2);

      const today = new Date();
      const tokenExpirationDate = new Date(today);
      tokenExpirationDate.setDate(today.getDate() + daysCovered); 
      
      const nextPurchaseDate = new Date(tokenExpirationDate);
      nextPurchaseDate.setDate(tokenExpirationDate.getDate() );

      const nextPurchaseDateString = nextPurchaseDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      Alert.alert(
        "Purchase Restricted",
        `You have tokens for the next ${daysCovered} days (${upcomingTokensCount} tokens).\n\nNew plan available starting ${nextPurchaseDateString}.`,
        [{ text: "OK" }]
      );
    } else {
      setModalVisible(true);
    }
  };
  
  const handleSubmitOrder = async () => {
    if (!trxId.trim() || !bkashNumber.trim()) {
      Alert.alert("Missing Info", "Please enter Sender Number and Transaction ID");
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/transactions/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageType,
          bkashNumber: bkashNumber,
          trxId: trxId,
          amount: amount,
          daysCount: calculatedDays
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Order Placed! Wait for Manager Approval.");
        setModalVisible(false);
        setHasPendingRequest(true);//new add
        setTrxId('');
        setBkashNumber('');
        loadData();
      } else {
        Alert.alert("Error", data.message || "Failed to submit");
      }
    } catch (e) {
      Alert.alert("Error", "Network Error");
    } finally {
      setSubmitting(false);
      setHasPendingRequest(true);//new add
    }
  };

  const handleViewToken = (item: HistoryItem) => {
    Alert.alert(
      "Token Details",
      `Date: ${new Date(item.date).toDateString()}\nMeal: ${item.mealType}\nStatus: ${item.status}\nID: ${item.tokenID}\nScanned: ${item.scannedAt ? new Date(item.scannedAt).toLocaleTimeString() : 'N/A'}`
    );
  };
  
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dining info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>{myHallName}</Text>
      <Text style={styles.dashboardTitle}>Diner Dashboard</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
      >

        {/* Timeline */}
        <View style={styles.timelineCard}>
            <View style={styles.timelineRow}>
                <Ionicons name="timer-outline" size={24} color="#6366F1" />
                <View style={styles.timelineTextContainer}>
                    <Text style={styles.timelineTitle}>Next Service: {nextMealName}</Text>
                    <Text style={styles.timelineSubtitle}>
                        <Text style={{fontWeight: '700', color: '#6366F1'}}>{formatCountdown(hoursUntilNextMeal, minutesUntilNextMeal)}</Text>
                    </Text>
                </View>
                <Text style={styles.currentMealText}>{nextMealName} Service</Text>
            </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                    <Ionicons name="restaurant-outline" size={18} color="#10B981" /> Hall Today's Status
                </Text>
            </View>
            <View style={styles.statsRow}>
                <MealStat label="Total Meals" value={mealStatus.totalMealsToday} width={'50%'} />
                <MealStat label="Eaten Tokens" value={mealStatus.mealsEaten} width={'50%'} highlight={true} />
            </View>
            {tokenWarning && (
                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        ⚠️ Token Pool Low! **{tokensRemaining}** tokens left for the day.
                    </Text>
                </View>
            )}
        </View>

        {/* Announcement */}
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

        <Text style={styles.sectionHeader}>Your Token History</Text>

        {loadingHistory ? (
            <ActivityIndicator size="small" color="#4F46E5" />
        ) : historyList.length === 0 ? (
            <Text style={styles.noDataText}>No history available.</Text>
        ) : (
            historyList.map((item) => {
                const itemDate = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                const isUsed = item.status === 'Used';
                const isExpired = item.status === 'Expired';

                let statusColor = "#6B7280";
                if (isUsed) statusColor = "#10B981";
                if (isExpired) statusColor = "#EF4444";

                return (
                    <ActionButton
                        key={item._id}
                        label={`${itemDate} (${item.mealType})`}
                        subtext={`Status: ${item.status}`}
                        color={statusColor}
                        icon={isUsed ? "checkmark-done-circle-outline" : isExpired ? "alert-circle-outline" : "time-outline"}
                        onPress={() => handleViewToken(item)}
                        disabled={false}
                    />
                );
            })
        )}

      </ScrollView>

      {/* Logout Button Update */}
      <TouchableOpacity onPress={handleLogout} style={styles.logout}>
        <AntDesign name="logout" size={24} color="black" />
      </TouchableOpacity>
      




     {/* FAB Button Updated */}
<TouchableOpacity 
  onPress={handleOrderPress} 
  style={[
    styles.fab, 
    (hasPendingRequest || upcomingTokensCount > 2) && { backgroundColor: '#6B7280' } 
  ]}
  disabled={hasPendingRequest}
>
  <Ionicons 
    name={hasPendingRequest ? "time-outline" : upcomingTokensCount > 0 ? "checkmark-circle-outline" : "add-circle"} 
    size={30} 
    color="#fff" 
  />
  <Text style={styles.fabText}>
    {hasPendingRequest 
      ? "Request Pending" 
      : upcomingTokensCount > 2 
        ? "Plan Active" 
        : "Order Next Token"
    }
  </Text>
</TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Purchase Meal Plan</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Package Selection */}
            <Text style={styles.label}>Select Duration</Text>
            <View style={styles.packageGrid}>
              {['15_days', '30_days', 'rest_month'].map((pkg) => (
                <TouchableOpacity
                  key={pkg}
                  style={[styles.pkgBox, packageType === pkg && styles.pkgBoxActive]}
                  onPress={() => setPackageType(pkg as any)}
                >
                  <Text style={[styles.pkgText, packageType === pkg && styles.pkgTextActive]}>
                    {pkg === 'rest_month' ? 'Rest Month' : pkg.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Days:</Text>
                <Text style={styles.summaryValue}>{calculatedDays} Days</Text>
              </View>
              <View style={[styles.summaryRow, {marginTop:5}]}>
                <Text style={[styles.summaryLabel, {fontWeight:'bold'}]}>Total Payable:</Text>
                <Text style={[styles.summaryValue, {color:'#F97316', fontSize:18}]}>৳ {amount}</Text>
              </View>
            </View>

            <Text style={styles.paymentNote}>
              Send to bKash: <Text style={{fontWeight:'bold'}}>01608631661</Text>
            </Text>

            <Text style={styles.label}>Sender Number</Text>
            <TextInput
              style={styles.input}
              placeholder="01XXXXXXXXX"
              value={bkashNumber}
              onChangeText={setBkashNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />

            <Text style={styles.label}>Transaction ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 8JKS92LZ"
              value={trxId}
              onChangeText={setTrxId}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmitOrder}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.submitBtnText}>Confirm Purchase</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

const ActionButton = ({ label, subtext, onPress, color, disabled, icon }: { label: string, subtext: string, onPress: () => void, color: string, disabled: boolean, icon?: string }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.actionButton, { borderLeftColor: color }]}
    disabled={disabled}
  >
    <View style={styles.actionButtonContent}>
      <View style={{backgroundColor: color + '20', padding: 8, borderRadius: 8, marginRight: 15}}>
        <Ionicons name={(icon as any) || "qr-code-outline"} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.actionButtonText}>{label}</Text>
        <Text style={styles.actionButtonSubtext}>{subtext}</Text>
      </View>
    </View>
    {!disabled && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
  hallName: { textAlign: 'center', marginTop: 30, fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  dashboardTitle: { textAlign: 'center', marginBottom: 24, fontSize: 18, color: '#6B7280', fontWeight: '500' },
  sectionHeader: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginTop: 15, marginBottom: 10 },

  // Cards
  timelineCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#6366F1', elevation: 3 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineTextContainer: { flex: 1, marginLeft: 10 },
  timelineTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  timelineSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  currentMealText: { fontSize: 12, fontWeight: 'bold', color: '#10B981', backgroundColor: '#D1FAE5', padding: 5, borderRadius: 6 },
  statusCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 18, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  cardHeader: { marginBottom: 15 },
  cardHeaderText: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', paddingVertical: 5 },
  statValue: { fontSize: 28, fontWeight: '700', color: '#4B5563', marginTop: 3 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  warningBox: { backgroundColor: '#FEF3C7', padding: 10, borderRadius: 8, marginTop: 15 },
  warningText: { fontSize: 14, color: '#D97706', fontWeight: '600', textAlign: 'center' },
  announcementCard: { backgroundColor: '#F3E8FF', padding: 15, borderRadius: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  announcementContent: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  announcementIcon: { marginRight: 10 },
  announcementText: { fontSize: 15, fontWeight: '600', color: '#C026D3' },

  // List Item
  actionButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderLeftWidth: 5, elevation: 1 },
  actionButtonContent: { flexDirection: 'row', alignItems: 'center' },
  actionButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  actionButtonSubtext: { color: '#666', fontSize: 12, marginTop: 2 },
  noDataText: { textAlign: 'center', marginTop: 10, color: '#999', fontStyle: 'italic' },

  // FAB & Logout
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#F97316', borderRadius: 30, paddingVertical: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', elevation: 8 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  logout: { position: 'absolute', top: 50, right: 20, padding: 5 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '600' },
  packageGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  pkgBox: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  pkgBoxActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  pkgText: { fontSize: 12, color: '#555', fontWeight: '600' },
  pkgTextActive: { color: '#fff' },
  summaryBox: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryLabel: { color: '#666' },
  summaryValue: { fontWeight: 'bold', color: '#333' },
  paymentNote: { fontSize: 12, color: '#666', marginBottom: 15, backgroundColor: '#FEF3C7', padding: 10, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 15 },
  submitBtn: { backgroundColor: '#10B981', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});





