import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Image
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router,Stack, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
type AuthorityTab = 'Dashboard' | 'HallInfo' | 'Managers' | 'Halls';

interface MonthlyEarning {
  id: string;
  monthLabel: string;
  amount: number;
}

interface HallInfo {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  notice: string;
}

interface Manager {
  _id: string;
  name: string;
  email: string;
  hallName: string;
  role: string;
}

interface Hall {
  id: string;
  name: string;
  email: string;
  address: string;
  capacity: number;
  description: string;
}


const SmallStatCard = ({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    {subtitle ? <Text style={styles.statSubLabel}>{subtitle}</Text> : null}
  </View>
);


const TabButton = ({
  tab,
  activeTab,
  onPress,
  icon,
}: {
  tab: AuthorityTab;
  activeTab: AuthorityTab;
  onPress: (t: AuthorityTab) => void;
  icon: string;
}) => (
  <TouchableOpacity
    style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
    onPress={() => onPress(tab)}
  >
    <Ionicons
      name={icon as any}
      size={22}
      color={activeTab === tab ? '#fff' : '#4B5563'}
    />
    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
      {tab === 'HallInfo' ? 'Hall Info' : tab}
    </Text>
  </TouchableOpacity>
);


const HallInfoSection = ({
  hallInfo,
  onUpdate,
}: {
  hallInfo: HallInfo;
  onUpdate: (updated: HallInfo) => void;
}) => {
  
  const [localInfo, setLocalInfo] = useState<HallInfo>(hallInfo);
  
  useEffect(() => {
    setLocalInfo(hallInfo);
  }, [hallInfo]);



  const handleSave = () => {
    if (!localInfo.name.trim()) {
      Alert.alert('Validation', 'Hall name is required.');
      return;
    }
    onUpdate(localInfo);
    Alert.alert('Updated', 'Hall information has been updated successfully.');
  };

  const updateField = (field: keyof HallInfo, value: string) => {
    setLocalInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Primary Hall Information</Text>

      <View style={styles.assignmentCard}>
        <TextInput
          style={styles.input}
          placeholder="Hall Name"
          value={localInfo.name}
          onChangeText={text => updateField('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Hall Address"
          value={localInfo.address}
          onChangeText={text => updateField('address', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Email"
          value={localInfo.contactEmail}
          onChangeText={text => updateField('contactEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Phone"
          value={localInfo.contactPhone}
          onChangeText={text => updateField('contactPhone', text)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notice / Important Info (shown to managers & dining boy)"
          multiline
          value={localInfo.notice}
          onChangeText={text => updateField('notice', text)}
        />

        <TouchableOpacity style={styles.assignButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.assignButtonText}>Save Hall Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ManagersSection = ({
  managers,
  onRemove,
  searchEmail,
  setSearchEmail,
  handleSearch,
  foundStudent,
  setFoundStudent,
  handlePromote,
  searching,
  loadingAction
}: {
  managers: Manager[];
  onRemove: (email: string) => void;
  searchEmail: string;
  setSearchEmail: (text: string) => void;
  handleSearch: () => void;
  foundStudent: any;
  setFoundStudent: (data: any) => void;
  handlePromote: () => void;
  searching: boolean;
  loadingAction: boolean;
}) => {

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Manage Hall Managers</Text>

      <View style={styles.assignmentCard}>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
          Search existing student to appoint as manager:
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Student Email (e.g. u17040...)"
            value={searchEmail}
            onChangeText={setSearchEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={{ backgroundColor: '#2563eb', padding: 12, borderRadius: 8, marginLeft: 10 }}
            onPress={handleSearch}
            disabled={searching}
          >
            {searching ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="search-outline" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

        {foundStudent && (
          <View style={{ marginTop: 15, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1F2937' }}>{foundStudent.name}</Text>
            <Text style={{ color: '#666', marginBottom: 5 }}>{foundStudent.email}</Text>

            {foundStudent.role === 'user' ? (
              <TouchableOpacity
                style={[styles.assignButton, { marginTop: 10 }]}
                onPress={handlePromote}
                disabled={loadingAction}
              >
                {loadingAction ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name="person-add-outline" size={20} color="#fff" />
                    <Text style={styles.assignButtonText}>Promote to Manager</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={{ color: '#DC2626', marginTop: 5, fontWeight: 'bold' }}>
                User is already a {foundStudent.role}
              </Text>
            )}
            <TouchableOpacity onPress={() => setFoundStudent(null)} style={{ position: 'absolute', top: 5, right: 5 }}>
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
        Current Managers ({managers.length})
      </Text>
      <ScrollView style={styles.scrollSection}>
        {managers.length === 0 ? (
          <Text style={styles.noDataText}>
            No managers found. Search and promote a student.
          </Text>
        ) : (
          managers.map(m => (
            <View key={m._id} style={styles.diningBoyItem}>
              <View style={styles.diningBoyDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                    <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>{m.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.diningBoyName}>{m.name}</Text>
                    <Text style={styles.diningBoyEmail}>{m.email}</Text>
                  </View>
                </View>
                <Text style={styles.diningBoyDate}>Hall: {m.hallName}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(m.email)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};



const HallsSection = ({
  halls,
  onAddHall,
}: {
  halls: Hall[];
  onAddHall: (h: any) => void; 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleAddHall = async () => {
    if (!name || !email || !password || !capacity) {
      Alert.alert('Missing Fields', 'Please fill all fields (Name, Email, Password, Capacity).');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/halls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          capacity: Number(capacity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Hall and Admin created successfully!');
        
        setName('');
        setEmail('');
        setPassword('');
        setCapacity('');

        if (onAddHall && data.hall) {
           onAddHall(data.hall);
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to create hall.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Add New Hall & Admin</Text>

      <View style={styles.assignmentCard}>
        <TextInput 
          style={styles.input} 
          placeholder="Hall Name" 
          value={name} 
          onChangeText={setName} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Admin Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={true} 
        />

        <TextInput 
          style={styles.input} 
          placeholder="Capacity" 
          value={capacity} 
          onChangeText={setCapacity} 
          keyboardType="numeric" 
        />

        <TouchableOpacity 
            style={[styles.assignButton, loading && { opacity: 0.7 }]} 
            onPress={handleAddHall}
            disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
                <Ionicons name="business-outline" size={20} color="#fff" />
                <Text style={styles.assignButtonText}>Create Hall & Admin</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>All Halls</Text>
      <ScrollView style={styles.scrollSection}>
        {halls.length === 0 ? (
            <Text style={styles.noDataText}>No halls found.</Text>
        ) : (
            halls.map((hall, index) => (
                <View key={index} style={styles.diningBoyItem}>
                    <View>
                        <Text style={styles.diningBoyName}>{hall.name}</Text>
                        <Text style={styles.diningBoyDate}>Capacity: {hall.capacity}</Text>
                    </View>
                    {/*In future here add hall history */}
                </View>
            ))
        )}
      </ScrollView>
    </View>
  );
};

export default function HallAuthorityDashboard() {
  const [earnings, setEarnings] = useState<MonthlyEarning[]>([
    { id: 'e1', monthLabel: 'Nov 2025', amount: 180000 },
    { id: 'e2', monthLabel: 'Oct 2025', amount: 165000 },
    { id: 'e3', monthLabel: 'Sep 2025', amount: 150000 },
    { id: 'e4', monthLabel: 'Aug 2025', amount: 142000 },
  ]);

  const [hallInfo, setHallInfo] = useState<HallInfo>({
    name: 'Muktijoddha Hall',
    address: 'University Campus, Block A',
    contactEmail: 'hall.authority@univ.edu',
    contactPhone: '+8801XXXXXXXXX',
    notice: 'Mess bill payment deadline: 25th of every month.',
  });

  const [managers, setManagers] = useState<Manager[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AuthorityTab>('Dashboard');

  const [searchEmail, setSearchEmail] = useState('');
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
const [myHallName, setMyHallName] = useState<string>('Loading Hall...');

  const fetchProvostInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.hallName) {
        setHallInfo(prev => ({
          ...prev,
          name: data.hallName 
        }));
      }
    } catch (e) {
      console.error("Failed to fetch provost info", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const storedName = await AsyncStorage.getItem('hallName');
          if (isActive) {
            if (storedName) {
              setMyHallName(storedName);
            } else {
              setMyHallName("Unknown Hall");
            }
          }
        } catch (error) {
          console.error("Failed to load hall name from storage", error);
        }

        if (isActive) {
          await fetchProvostInfo();
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  

  const fetchManagers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/my-managers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setManagers(data);
      }
    } catch (e) {
      console.error("Failed to fetch managers", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchManagers();
      await fetchProvostInfo();
      setTimeout(() => setLoading(false), 800);
    };
    init();
  }, []);

  const handleSearchStudent = async () => {
    if (!searchEmail) return;
    setSearching(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/find-student?email=${searchEmail.toLowerCase().trim()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setFoundStudent(data);
      } else {
        Alert.alert("Not Found", "No student found with this email");
        setFoundStudent(null);
      }
    } catch (e) {
      Alert.alert("Error", "Network Error");
    } finally {
      setSearching(false);
    }
  };

  const handlePromote = async () => {
    if (!foundStudent) return;
    setLoadingAction(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/promote-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: foundStudent.email })
      });

      if (response.ok) {
        Alert.alert("Success", `${foundStudent.name} is now a Manager!`);
        setFoundStudent(null);
        setSearchEmail('');
        fetchManagers();
      } else {
        Alert.alert("Error", "Failed to promote");
      }
    } catch (e) {
      Alert.alert("Error", "Network Error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveManager = async (email: string) => {
    Alert.alert(
      'Remove Manager',
      `Are you sure you want to revert ${email} to a normal student?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              await fetch(`${API_BASE_URL}/users/demote-manager`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
              });
              fetchManagers();
              Alert.alert('Removed', 'Manager reverted to student successfully.');
            } catch (e) {
              Alert.alert("Error", "Failed to remove manager");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    router.replace('/login');
  };

  const totalThisMonth = earnings[0]?.amount ?? 0;
  const totalLastMonth = earnings[1]?.amount ?? 0;
  const totalThisYear = earnings.reduce((sum, e) => sum + e.amount, 0);
  const earningGrowth =
    totalLastMonth === 0
      ? 0
      : Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100);

  if (loading) {
    return (
     <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Hall Authority Dashboard...</Text>
      </View>
    );
  }

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <View>
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons name="cash-outline" size={18} color="#10B981" />{' '}
                  Earnings Overview
                </Text>
              </View>

              <View style={styles.statsRow}>
                <SmallStatCard label="This Month" value={`${totalThisMonth} ৳`} subtitle={earnings[0]?.monthLabel} />
                <SmallStatCard label="Last Month" value={`${totalLastMonth} ৳`} subtitle={earnings[1]?.monthLabel} />
              </View>

              <View style={[styles.statsRow, { marginTop: 10 }]}>
                <SmallStatCard label="This Year Total" value={`${totalThisYear} ৳`} />
                <SmallStatCard label="Growth" value={`${earningGrowth}%`} subtitle="vs. last month" />
              </View>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons name="calendar-outline" size={18} color="#F97316" />{' '}
                  Monthly Earnings (Recent)
                </Text>
              </View>
              {earnings.map(e => (
                <View key={e.id} style={styles.earningRow}>
                  <Text style={styles.earningMonth}>{e.monthLabel}</Text>
                  <Text style={styles.earningAmount}>{e.amount} ৳</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'HallInfo':
        return (
          <HallInfoSection hallInfo={hallInfo} onUpdate={setHallInfo} />
        );

      case 'Managers':
        return (
          <ManagersSection
            managers={managers}
            onRemove={handleRemoveManager}
            searchEmail={searchEmail}
            setSearchEmail={setSearchEmail}
            handleSearch={handleSearchStudent}
            foundStudent={foundStudent}
            setFoundStudent={setFoundStudent}
            handlePromote={handlePromote}
            searching={searching}
            loadingAction={loadingAction}
          />
        );

      case 'Halls':
        return (
          <HallsSection
            halls={halls}
            onAddHall={h => setHalls(prev => [...prev, { id: `h${Date.now()}`, ...h }])}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>Hall Authority Dashboard</Text>
      <Text style={styles.dashboardTitle}>
        {myHallName} Control & Monitoring
      </Text>

      <View style={styles.tabBar}>
        <TabButton tab="Dashboard" activeTab={activeTab} onPress={setActiveTab} icon="grid-outline" />
        <TabButton tab="HallInfo" activeTab={activeTab} onPress={setActiveTab} icon="information-circle-outline" />
        <TabButton tab="Managers" activeTab={activeTab} onPress={setActiveTab} icon="people-outline" />
        <TabButton tab="Halls" activeTab={activeTab} onPress={setActiveTab} icon="business-outline" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderCurrentTab()}
      </ScrollView>

      <TouchableOpacity onPress={handleLogout} style={styles.logout}>
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
    flexGrow: 1,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dashboardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
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
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#fff',
  },
  // Cards
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
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4B5563',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statSubLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  earningMonth: {
    fontSize: 14,
    color: '#4B5563',
  },
  earningAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  // Section container & scroll
  sectionContainer: {
    flex: 1,
  },
  scrollSection: {
    paddingBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  // Form / assignment card
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
    backgroundColor: '#F9FAFB',
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
  // List items reused
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
  logout: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
});
