import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';

=======
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

interface MealStatus {
  totalMealsToday: number;
  mealsEaten: number;
  nextFeastAnnouncement: string | null;
  hallCapacity: number; 
}

<<<<<<< HEAD
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
=======
interface PendingRequest {
  id: string;
  user: string;
  mealType: 'Lunch' | 'Dinner';
  date: string;
}

interface DiningBoy {
  id: string;
  email: string;
  name: string;
  assignedDate: string;
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
}

type ManagerTab = 'Dashboard' | 'Approvals' | 'Assignment';

<<<<<<< HEAD
=======

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
const HALL_TIMINGS = {
  LUNCH_START: 16, 
  DINNER_START: 20, 
};

<<<<<<< HEAD
const fetchManagerData = async (): Promise<{ status: MealStatus }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    status: {
      totalMealsToday: 180, 
      mealsEaten: 155, 
      hallCapacity: 200, 
=======
// Mock Manager Data
const fetchManagerData = async (): Promise<{ status: MealStatus }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    status: {
      totalMealsToday: 180, // Total tokens issued/used today
      mealsEaten: 155, // Actual successful scans today
      hallCapacity: 200, // Total available capacity
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
      nextFeastAnnouncement: 'Monthly special dinner on 20 Nov 2025!',
    },
  };
};

<<<<<<< HEAD
=======
const mockPendingRequests: PendingRequest[] = [
  { id: 'req1', user: 'Ali Ahmed (ID: 2104090)', mealType: 'Dinner', date: '17 Nov 2025' },
  { id: 'req2', user: 'Babu Khan (ID: 2104095)', mealType: 'Lunch', date: '18 Nov 2025' },
  { id: 'req3', user: 'Celine Dion (ID: 2105121)', mealType: 'Dinner', date: '19 Nov 2025' },
];

const initialDiningBoys: DiningBoy[] = [
  { id: 'db1', email: 'boy.karim@hall.edu', name: 'Karim Ahmed', assignedDate: '01 Oct 2025' },
  { id: 'db2', email: 'boy.rahim@hall.edu', name: 'Rahim Shah', assignedDate: '15 Sep 2025' },
];


// --- Helper Components ---

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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

<<<<<<< HEAD

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
=======
// --- 1. Approval Section Component ---
const ApprovalSection = () => {
    const [requests, setRequests] = useState<PendingRequest[]>(mockPendingRequests);

    const handleApproval = (id: string, action: 'approved' | 'rejected') => {
        const req = requests.find(r => r.id === id);
        if (req) {
            Alert.alert(
                `${action === 'approved' ? 'Approved' : 'Rejected'}`,
                `Request for ${req.user} for ${req.mealType} on ${req.date} has been ${action}.`,
                [{ text: 'OK' }]
            );
            setRequests(prev => prev.filter(r => r.id !== id));
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
        }
    };

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Token Approval Requests ({requests.length})</Text>
<<<<<<< HEAD
            <ScrollView 
                contentContainerStyle={styles.scrollSection}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchRequests} />}
            >
                {loading && requests.length === 0 ? (
                    <ActivityIndicator color="#4F46E5" style={{marginTop: 20}}/>
                ) : requests.length === 0 ? (
                    <Text style={styles.noDataText}>🎉 No pending requests!</Text>
                ) : (
                    requests.map((request) => (
                        <View key={request._id} style={styles.approvalItem}>
                            <View style={styles.requestDetails}>
                                <Text style={styles.requestTitle}>{request.userId?.name || "Student"}</Text>
                                <Text style={styles.requestSubtext}>{request.daysCount} Days • ৳{request.amount}</Text>
                                <Text style={[styles.requestSubtext, {fontSize: 11, color: '#888'}]}>TrxID: {request.trxId}</Text>
                            </View>
                            <View style={styles.approvalActions}>
                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={() => handleAction(request._id, 'approve')}>
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleAction(request._id, 'reject')}>
=======
            
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    <Ionicons name="information-circle-outline" size={16} color="#4F46E5" /> 
                    {' '}Review and approve special token requests here.
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollSection}>
                {requests.length === 0 ? (
                    <Text style={styles.noDataText}>🎉 No pending requests at the moment!</Text>
                ) : (
                    requests.map((request) => (
                        <View key={request.id} style={styles.approvalItem}>
                            <View style={styles.requestDetails}>
                                <Text style={styles.requestTitle}>{request.user}</Text>
                                <Text style={styles.requestSubtext}>{request.mealType} Token on {request.date}</Text>
                            </View>
                            <View style={styles.approvalActions}>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                                    onPress={() => handleApproval(request.id, 'approved')}
                                >
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
                                    onPress={() => handleApproval(request.id, 'rejected')}
                                >
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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

<<<<<<< HEAD
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
            { text: 'Remove', style: 'destructive', onPress: async () => {
                try {
                    const token = await AsyncStorage.getItem('userToken');
                    const response = await fetch(`${API_BASE_URL}/users/remove-dining-boy`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ email })
                    });
                    if (response.ok) { fetchStaff(); } 
                } catch (e) {}
            }},
        ]);
=======
// --- 2. Assignment Section Component ---
const AssignmentSection = () => {
    const [diningBoys, setDiningBoys] = useState<DiningBoy[]>(initialDiningBoys);
    const [newBoyEmail, setNewBoyEmail] = useState('');
    const [newBoyName, setNewBoyName] = useState('');

    const handleAssign = () => {
        if (newBoyEmail.trim() === '' || newBoyName.trim() === '') {
            Alert.alert('Missing Info', 'Please enter both the full name and email address.', [{ text: 'OK' }]);
            return;
        }
        if (!newBoyEmail.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.', [{ text: 'OK' }]);
            return;
        }

        const newBoy: DiningBoy = {
            id: `db${Date.now()}`,
            name: newBoyName.trim(),
            email: newBoyEmail.trim().toLowerCase(),
            assignedDate: new Date().toLocaleDateString('en-GB'),
        };

        setDiningBoys(prev => [...prev, newBoy]);
        setNewBoyEmail('');
        setNewBoyName('');
        Alert.alert('Assignment Successful', `${newBoy.name} has been assigned as a Dining Boy.`, [{ text: 'OK' }]);
    };

    const handleRemove = (id: string, name: string) => {
        Alert.alert(
            'Confirm Removal',
            `Are you sure you want to remove ${name} from Dining Boy duties?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive', 
                    onPress: () => {
                        setDiningBoys(prev => prev.filter(db => db.id !== id));
                        Alert.alert('Removed', `${name} has been removed.`, [{ text: 'OK' }]);
                    }
                },
            ]
        );
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
    };

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Assign Dining Boy</Text>
<<<<<<< HEAD
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
=======
            
            <View style={styles.assignmentCard}>
                <TextInput
                    style={styles.input}
                    placeholder="Dining Boy Full Name (e.g., Kuddus Alom)"
                    value={newBoyName}
                    onChangeText={setNewBoyName}
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dining Boy Email (e.g., boy@gmail.com)"
                    value={newBoyEmail}
                    onChangeText={setNewBoyEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
                    <Ionicons name="person-add-outline" size={20} color="#fff" />
                    <Text style={styles.assignButtonText}>Assign Dining Boy</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Current Assignments ({diningBoys.length})</Text>
            <ScrollView style={styles.scrollSection}>
                {diningBoys.map((boy) => (
                    <View key={boy.id} style={styles.diningBoyItem}>
                        <View style={styles.diningBoyDetails}>
                            <Text style={styles.diningBoyName}>{boy.name}</Text>
                            <Text style={styles.diningBoyEmail}>{boy.email}</Text>
                            <Text style={styles.diningBoyDate}>Assigned: {boy.assignedDate}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.removeButton} 
                            onPress={() => handleRemove(boy.id, boy.name)}
                        >
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

<<<<<<< HEAD
=======
// --- Main Dashboard Component ---

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
export default function ManagerProfessionalDashboard() {
  const [mealStatus, setMealStatus] = useState<MealStatus>({
    totalMealsToday: 0,
    mealsEaten: 0,
    nextFeastAnnouncement: null,
    hallCapacity: 0,
  });
<<<<<<< HEAD
  
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ManagerTab>('Dashboard');

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
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
=======
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ManagerTab>('Dashboard');


  // --- Derived State and Logic ---
  const tokenUsage = mealStatus.mealsEaten;
  const tokensRemaining = mealStatus.hallCapacity - tokenUsage;
  const tokenWarning = tokenUsage > mealStatus.hallCapacity * 0.8;
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
    fetchManagerData().then(data => {
      setMealStatus(data.status);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Manager Dashboard...</Text>
      </View>
    );
  }

  // Helper function to format the countdown text
  const formatCountdown = (h: number, m: number) => {
      if (h > 0) return `${h} hr ${m} min`;
      if (m > 0) return `${m} minutes`;
      return 'Starting Soon!';
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  };

  const renderCurrentTab = () => {
    switch (activeTab) {
        case 'Dashboard':
            return (
                <View>
<<<<<<< HEAD
                    {/* 1. Timeline */}
=======
                    {/* --- 1. Meal Service Timeline Card --- */}
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
                    <View style={styles.timelineCard}>
                        <View style={styles.timelineRow}>
                            <Ionicons name="timer-outline" size={24} color="#6366F1" />
                            <View style={styles.timelineTextContainer}>
<<<<<<< HEAD
                                <Text style={styles.timelineTitle}>Dashboard Overview</Text>
                                <Text style={styles.timelineSubtitle}>Real-time updates</Text>
                            </View>
                        </View>
                    </View>

                    {/* 2. Status Card */}
=======
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
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
                    <View style={styles.statusCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardHeaderText}>
                                <Ionicons name="restaurant-outline" size={18} color="#10B981" /> Hall Today's Status
                            </Text>
                        </View>
<<<<<<< HEAD
                        <View style={styles.statsRow}>
                            <MealStat label="Capacity" value={mealStatus.hallCapacity} />
                            <MealStat label="Used" value={mealStatus.mealsEaten} highlight={true} />
                            <MealStat label="Available" value={mealStatus.hallCapacity - mealStatus.mealsEaten} />
                        </View>
                    </View>

                    {/* 3. Announcement Banner */}
=======

                        <View style={styles.statsRow}>
                            <MealStat label="Hall Capacity" value={mealStatus.hallCapacity} />
                            <MealStat label="Tokens Used" value={tokenUsage} highlight={true} />
                            <MealStat label="Available" value={tokensRemaining} highlight={tokensRemaining < 20} />
                        </View>

                        {tokenWarning && (
                            <View style={styles.warningBox}>
                                <Text style={styles.warningText}>
                                    ⚠️ Capacity Reached! **{tokensRemaining}** tokens left out of {mealStatus.hallCapacity}.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* --- 3. Feast Announcement --- */}
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
                    {mealStatus.nextFeastAnnouncement && (
                        <TouchableOpacity style={styles.announcementCard}>
                            <View style={styles.announcementContent}>
                                <Ionicons name="gift-outline" size={24} color="#C026D3" style={styles.announcementIcon} />
                                <Text style={styles.announcementText}>
                                    {mealStatus.nextFeastAnnouncement}
                                </Text>
                            </View>
<<<<<<< HEAD
                        </TouchableOpacity>
                    )}

                    {/* 4. Token Approval History (REAL DATA) */}
                    <Text style={styles.sectionHeader}>Recent Activity</Text>
                    <View style={{marginBottom: 20}}>
                        {historyData.length === 0 ? (
                            <Text style={{color:'#888', fontStyle:'italic'}}>No recent history.</Text>
                        ) : (
                            historyData.map((item) => (
                                <View key={item._id} style={styles.historyItem}>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <View style={[styles.statusDot, {backgroundColor: item.status === 'APPROVED' ? '#10B981' : '#EF4444'}]} />
                                        <View>
                                            <Text style={styles.historyUser}>{item.userId?.name || 'Unknown User'}</Text>
                                            <Text style={styles.historyDetails}>{item.packageType?.replace('_', ' ')}</Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text style={[styles.historyStatus, {color: item.status === 'APPROVED' ? '#10B981' : '#EF4444'}]}>
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
=======
                            <Ionicons name="chevron-forward" size={20} color="#C026D3" />
                        </TouchableOpacity>
                    )}
                </View>
            );
        case 'Approvals':
            return <ApprovalSection />;
        case 'Assignment':
            return <AssignmentSection />;
        default:
            return null;
    }
  };

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

  return (
    <View style={styles.container}>
        <Text style={styles.hallName}>Muktijoddha Hall</Text>
<<<<<<< HEAD
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
=======
        <Text style={styles.dashboardTitle}>Manager Professional Dashboard</Text>
        
        {/* --- Tab Bar Navigation --- */}
        <View style={styles.tabBar}>
            <TabButton 
                tab="Dashboard" 
                activeTab={activeTab} 
                onPress={setActiveTab} 
                icon="grid-outline"
            />
            <TabButton 
                tab="Approvals" 
                activeTab={activeTab} 
                onPress={setActiveTab} 
                icon="notifications-outline"
            />
            <TabButton 
                tab="Assignment" 
                activeTab={activeTab} 
                onPress={setActiveTab} 
                icon="person-add-outline"
            />
        </View>

        {/* --- Content Area --- */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {renderCurrentTab()}
        </ScrollView>

        {/* --- Logout Button --- */}
        <TouchableOpacity 
            onPress={() => router.push('/login')} 
            style={styles.logout}
        >
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
            <AntDesign name="logout" size={24} color="#1F2937" />
        </TouchableOpacity>
    </View>
  );
}

<<<<<<< HEAD
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
  approvalActions: { flexDirection: 'row', marginLeft: 15 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  noDataText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#9CA3AF', fontStyle: 'italic' },
  assignmentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 15, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 15 },
  assignButton: { backgroundColor: '#3B82F6', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  assignButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 10 },
  diningBoyItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#F97316' },
  diningBoyDetails: { flex: 1 },
  diningBoyName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  diningBoyEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  diningBoyDate: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  removeButton: { backgroundColor: '#EF4444', padding: 10, borderRadius: 8 },
  logout: { position: 'absolute', top: 50, right: 20, padding: 5 },
  
  // History Styles
  historyItem: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  historyUser: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  historyDetails: { fontSize: 12, color: '#666' },
  historyStatus: { fontSize: 12, fontWeight: 'bold' },
  historyTime: { fontSize: 10, color: '#999', marginTop: 2 }
=======


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
    paddingTop: 50,
  },
  scrollContent: {
    paddingBottom: 20, 
    flexGrow: 1, // Ensures content takes up available space
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dashboardTitle: {
    textAlign: 'center',
    marginBottom: 20,
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
  // --- Tab Bar Styles ---
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#fff',
  },
  // --- Dashboard Card Styles (unchanged/cleaned) ---
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
  // --- Approvals Styles ---
  sectionContainer: {
    flex: 1,
  },
  scrollSection: {
    paddingBottom: 20,
  },
  infoBox: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  infoText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  approvalItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  requestDetails: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  requestSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  approvalActions: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  // --- Assignment Styles ---
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  assignButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  diningBoyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  diningBoyDetails: {
    flex: 1,
  },
  diningBoyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  diningBoyEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  diningBoyDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
  },
  // --- PDF Styles ---
  pdfCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  pdfTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
  },
  pdfSubtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
    marginBottom: 20,
  },
  pdfPreviewPlaceholder: {
    width: '90%',
    height: 150,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderStyle: 'dashed',
  },
  pdfPreviewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  pdfPreviewTextSmall: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 5,
  },
  downloadButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  logout: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
});