import React, { useState, useEffect,useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router,useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';

interface MealStatus {
  totalMealsToday: number;
  mealsEaten: number;
  nextFeastAnnouncement: string | null;
  hallCapacity: number;
}

interface TransactionRequest {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  packageType: string;
  amount: number;
  trxId: string;
  bkashNumber: string;
  daysCount: number;
  createdAt: string;
}

interface HistoryItem {
  _id: string;
  userId: {
    name: string;
  };
  packageType: string;
  status: 'APPROVED' | 'REJECTED';
  updatedAt: string;
}

interface DiningBoy {
  _id: string;
  email: string;
  name: string;
  role: string;
}

type ManagerTab = 'Dashboard' | 'Approvals' | 'Assignment';

const HALL_TIMINGS = {
  LUNCH_START: 9,
  DINNER_START: 21,
};

const fetchManagerData = async (): Promise<{ status: MealStatus }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    status: {
      totalMealsToday: 180,
      mealsEaten: 155,
      hallCapacity: 200,
      nextFeastAnnouncement: 'Monthly special dinner on 20 Nov 2025!',
    },
  };
};

const MealStat = ({ label, value, highlight = false }: { label: string, value: number, highlight?: boolean }) => (
  <View style={[styles.statItem, { flex: 1 }]}>
    <Text style={[styles.statValue, highlight && { color: '#EF4444' }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TabButton = ({ tab, activeTab, onPress, icon }: { tab: ManagerTab, activeTab: ManagerTab, onPress: (t: ManagerTab) => void, icon: string }) => (
  <TouchableOpacity
    style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
    onPress={() => onPress(tab)}
  >
    <Ionicons name={icon as any} size={22} color={activeTab === tab ? '#fff' : '#4B5563'} />
    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
  </TouchableOpacity>
);


const ApprovalSection = () => {
  const [requests, setRequests] = useState<TransactionRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/transactions/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = action === 'approve'
        ? `${API_BASE_URL}/transactions/approve/${id}`
        : `${API_BASE_URL}/transactions/reject/${id}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", `Request ${action}!`);
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        Alert.alert("Error", result.message || "Failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network Error");
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Token Approval Requests ({requests.length})</Text>
      <ScrollView
        contentContainerStyle={styles.scrollSection}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchRequests} />}
      >
        {loading && requests.length === 0 ? (
          <ActivityIndicator color="#4F46E5" style={{ marginTop: 20 }} />
        ) : requests.length === 0 ? (
          <Text style={styles.noDataText}>🎉 No pending requests!</Text>
        ) : (
          requests.map((request) => (
            <View key={request._id} style={styles.approvalItem}>
              <View style={styles.requestDetails}>
                <Text style={styles.requestTitle}>{request.userId?.name || "Student"}</Text>
                <Text style={styles.requestSubtext}>{request.daysCount} Days • ৳{request.amount}</Text>
                <Text style={[styles.requestSubtext, { fontSize: 11, color: '#888' }]}>TrxID: {request.trxId}</Text>
              </View>
              <View style={styles.approvalActions}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={() => handleAction(request._id, 'approve')}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleAction(request._id, 'reject')}>
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const AssignmentSection = () => {
  const [diningBoys, setDiningBoys] = useState<DiningBoy[]>([]);
  const [newBoyEmail, setNewBoyEmail] = useState('');
  const [newBoyName, setNewBoyName] = useState('');
  const [newBoyPass, setNewBoyPass] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchStaff = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/my-dining-boys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setDiningBoys(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAssign = async () => {
    if (!newBoyName || !newBoyEmail || !newBoyPass) {
      Alert.alert('Missing Info', 'Please enter Name, Email & Password.'); return;
    }
    setAssigning(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/add-dining-boy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newBoyName, email: newBoyEmail.toLowerCase().trim(), password: newBoyPass })
      });
      if (response.ok) {
        Alert.alert('Success', 'Dining Boy assigned successfully!');
        setNewBoyName(''); setNewBoyEmail(''); setNewBoyPass('');
        fetchStaff();
      } else { Alert.alert('Error', 'Failed'); }
    } catch (error) { Alert.alert('Error', 'Network Error'); } finally { setAssigning(false); }
  };

  const handleRemove = (email: string, name: string) => {
    Alert.alert('Confirm Removal', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/users/remove-dining-boy`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ email })
            });
            if (response.ok) { fetchStaff(); }
          } catch (e) { }
        }
      },
    ]);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Assign Dining Boy</Text>
      <View style={styles.assignmentCard}>
        <TextInput style={styles.input} placeholder="Name" value={newBoyName} onChangeText={setNewBoyName} />
        <TextInput style={styles.input} placeholder="Email" value={newBoyEmail} onChangeText={setNewBoyEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={newBoyPass} onChangeText={setNewBoyPass} secureTextEntry />
        <TouchableOpacity style={styles.assignButton} onPress={handleAssign} disabled={assigning}>
          {assigning ? <ActivityIndicator color="#fff" /> : <Text style={styles.assignButtonText}>Add Staff</Text>}
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollSection}>
        {diningBoys.map((boy) => (
          <View key={boy._id} style={styles.diningBoyItem}>
            <View style={styles.diningBoyDetails}>
              <Text style={styles.diningBoyName}>{boy.name}</Text>
              <Text style={styles.diningBoyEmail}>{boy.email}</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(boy.email, boy.name)}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function ManagerProfessionalDashboard() {
  const [mealStatus, setMealStatus] = useState<MealStatus>({
    totalMealsToday: 0,
    mealsEaten: 0,
    nextFeastAnnouncement: null,
    hallCapacity: 0,
  });

  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ManagerTab>('Dashboard');
    const [hallName, setHallName] = useState("Loading..."); 


  
useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok && data.hallName) {
          setHallName(data.hallName);
        }
      } catch (error) {
        console.log("Error fetching hall name:", error);
      }
    };

    fetchUserProfile();
  }, []);

useFocusEffect(
    useCallback(() => {
      const loadHallInfo = async () => {
        try {
          const storedHallName = await AsyncStorage.getItem('hallName');
          if (storedHallName) {
            setHallName(storedHallName);
          } else {
            setHallName('Hall Not Found');
          }
        } catch (error) {
          console.error('Failed to load hall name', error);
        }
      };
      loadHallInfo();
    }, [])
  );

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      const statsData = await fetchManagerData();
      setMealStatus(statsData.status);

      const historyRes = await fetch(`${API_BASE_URL}/transactions/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyJson = await historyRes.json();
      if (historyRes.ok) {
        setHistoryData(historyJson);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    router.replace('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <View>
            {/* 1. Timeline */}
            <View style={styles.timelineCard}>
              <View style={styles.timelineRow}>
                <Ionicons name="timer-outline" size={24} color="#6366F1" />
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Dashboard Overview</Text>
                  <Text style={styles.timelineSubtitle}>Real-time updates</Text>
                </View>
              </View>
            </View>

            {/* 2. Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons name="restaurant-outline" size={18} color="#10B981" /> Hall Today's Status
                </Text>
              </View>
              <View style={styles.statsRow}>
                <MealStat label="Capacity" value={mealStatus.hallCapacity} />
                <MealStat label="Used" value={mealStatus.mealsEaten} highlight={true} />
                <MealStat label="Available" value={mealStatus.hallCapacity - mealStatus.mealsEaten} />
              </View>
            </View>

            {/* 3. Announcement Banner */}
            {mealStatus.nextFeastAnnouncement && (
              <TouchableOpacity style={styles.announcementCard}>
                <View style={styles.announcementContent}>
                  <Ionicons name="gift-outline" size={24} color="#C026D3" style={styles.announcementIcon} />
                  <Text style={styles.announcementText}>
                    {mealStatus.nextFeastAnnouncement}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* 4. Token Approval History (REAL DATA) */}
            <Text style={styles.sectionHeader}>Recent Activity</Text>
            <View style={{ marginBottom: 20 }}>
              {historyData.length === 0 ? (
                <Text style={{ color: '#888', fontStyle: 'italic' }}>No recent history.</Text>
              ) : (
                historyData.map((item) => (
                  <View key={item._id} style={styles.historyItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[styles.statusDot, { backgroundColor: item.status === 'APPROVED' ? '#10B981' : '#EF4444' }]} />
                      <View>
                        <Text style={styles.historyUser}>{item.userId?.name || 'Unknown User'}</Text>
                        <Text style={styles.historyDetails}>{item.packageType?.replace('_', ' ')}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.historyStatus, { color: item.status === 'APPROVED' ? '#10B981' : '#EF4444' }]}>
                        {item.status}
                      </Text>
                      <Text style={styles.historyTime}>{formatDate(item.updatedAt)}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

          </View>
        );
      case 'Approvals': return <ApprovalSection />;
      case 'Assignment': return <AssignmentSection />;
      default: return null;
    }
  };

  if (loading) {
    return <View style={[styles.container, styles.loadingContainer]}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>{hallName} </Text>
      <Text style={styles.dashboardTitle}>Manager Dashboard</Text>

      <View style={styles.tabBar}>
        <TabButton tab="Dashboard" activeTab={activeTab} onPress={setActiveTab} icon="grid-outline" />
        <TabButton tab="Approvals" activeTab={activeTab} onPress={setActiveTab} icon="notifications-outline" />
        <TabButton tab="Assignment" activeTab={activeTab} onPress={setActiveTab} icon="person-add-outline" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDashboardData} />}
      >
        {renderCurrentTab()}
      </ScrollView>

      <TouchableOpacity onPress={handleLogout} style={styles.logout}>
        <AntDesign name="logout" size={24} color="#1F2937" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20, paddingTop: 50 },
  scrollContent: { paddingBottom: 20, flexGrow: 1 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
  hallName: { textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  dashboardTitle: { textAlign: 'center', marginBottom: 20, fontSize: 18, color: '#6B7280', fontWeight: '500' },
  sectionHeader: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginTop: 15, marginBottom: 10 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, padding: 5, elevation: 3 },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, marginHorizontal: 2 },
  activeTabButton: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 12, marginTop: 2, fontWeight: '600', color: '#4B5563' },
  activeTabText: { color: '#fff' },
  timelineCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#6366F1', elevation: 3 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineTextContainer: { flex: 1, marginLeft: 10 },
  timelineTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  timelineSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  currentMealText: { fontSize: 12, fontWeight: 'bold', color: '#10B981', backgroundColor: '#D1FAE5', padding: 5, borderRadius: 6 },
  statusCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 18, marginBottom: 20, elevation: 3 },
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
  sectionContainer: { flex: 1 },
  scrollSection: { paddingBottom: 20 },
  infoBox: { backgroundColor: '#EEF2FF', padding: 12, borderRadius: 10, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#4F46E5' },
  infoText: { fontSize: 14, color: '#4F46E5' },
  approvalItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  requestDetails: { flex: 1 },
  requestTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  requestSubtext: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  approvalActions: { flexDirection: 'row' },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  noDataText: { textAlign: 'center', marginTop: 20, color: '#888', fontStyle: 'italic' },
  assignmentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 15, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 15, backgroundColor: '#F9FAFB' },
  assignButton: { backgroundColor: '#3B82F6', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  assignButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 10 },
  diningBoyItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#F97316' },
  diningBoyDetails: { flex: 1 },
  diningBoyName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  diningBoyEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  diningBoyDate: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  removeButton: { backgroundColor: '#EF4444', padding: 10, borderRadius: 8 },
  logout: { position: 'absolute', top: 50, right: 20, padding: 5 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  historyUser: { fontSize: 14, fontWeight: '600', color: '#333' },
  historyDetails: { fontSize: 12, color: '#666' },
  historyStatus: { fontSize: 12, fontWeight: 'bold' },
  historyTime: { fontSize: 10, color: '#999', marginTop: 2 },
});