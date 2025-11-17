import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

interface MealStatus {
  totalMealsToday: number;
  mealsEaten: number;
  nextFeastAnnouncement: string | null;
  hallCapacity: number; 
}

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
}

type ManagerTab = 'Dashboard' | 'Approvals' | 'Assignment';


const HALL_TIMINGS = {
  LUNCH_START: 16, 
  DINNER_START: 20, 
};

// Mock Manager Data
const fetchManagerData = async (): Promise<{ status: MealStatus }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    status: {
      totalMealsToday: 180, // Total tokens issued/used today
      mealsEaten: 155, // Actual successful scans today
      hallCapacity: 200, // Total available capacity
      nextFeastAnnouncement: 'Monthly special dinner on 20 Nov 2025!',
    },
  };
};

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
        }
    };

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Token Approval Requests ({requests.length})</Text>
            
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
    };

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Assign Dining Boy</Text>
            
            <View style={styles.assignmentCard}>
                <TextInput
                    style={styles.input}
                    placeholder="Dining Boy Full Name (e.g., John Doe)"
                    value={newBoyName}
                    onChangeText={setNewBoyName}
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dining Boy Email (e.g., boy@hall.edu)"
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
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// --- Main Dashboard Component ---

export default function ManagerProfessionalDashboard() {
  const [mealStatus, setMealStatus] = useState<MealStatus>({
    totalMealsToday: 0,
    mealsEaten: 0,
    nextFeastAnnouncement: null,
    hallCapacity: 0,
  });
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
  };

  const renderCurrentTab = () => {
    switch (activeTab) {
        case 'Dashboard':
            return (
                <View>
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


  return (
    <View style={styles.container}>
        <Text style={styles.hallName}>Muktijoddha Hall</Text>
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
            <AntDesign name="logout" size={24} color="#1F2937" />
        </TouchableOpacity>
    </View>
  );
}



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
});