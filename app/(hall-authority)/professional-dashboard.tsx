import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
<<<<<<< HEAD
  Image
=======
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
=======
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

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
<<<<<<< HEAD
  _id: string; 
  name: string;
  email: string;
  hallName: string;
  role: string;
=======
  id: string;
  name: string;
  email: string;
  hallName: string;
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
}

interface Hall {
  id: string;
  name: string;
  email: string;
  address: string;
  capacity: number;
  description: string;
}

<<<<<<< HEAD
=======
// ---- Mock Data Fetcher for Hall Authority ----
const fetchAuthorityData = async (): Promise<{
  earnings: MonthlyEarning[];
  hallInfo: HallInfo;
  managers: Manager[];
  halls: Hall[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    earnings: [
      { id: 'e1', monthLabel: 'Nov 2025', amount: 180000 },
      { id: 'e2', monthLabel: 'Oct 2025', amount: 165000 },
      { id: 'e3', monthLabel: 'Sep 2025', amount: 150000 },
      { id: 'e4', monthLabel: 'Aug 2025', amount: 142000 },
    ],
    hallInfo: {
      name: 'Muktijoddha Hall',
      address: 'University Campus, Block A',
      contactEmail: 'hall.authority@univ.edu',
      contactPhone: '+8801XXXXXXXXX',
      notice: 'Mess bill payment deadline: 25th of every month.',
    },
    managers: [
      {
        id: 'm1',
        name: 'Mr. Karim',
        email: 'karim.manager@hall.edu',
        hallName: 'Muktijoddha Hall',
      },
      {
        id: 'm2',
        name: 'Ms. Rahima',
        email: 'rahima.manager@hall.edu',
        hallName: 'Bangabandhu Hall',
      },
    ],
    halls: [
      {
        id: 'h1',
        name: 'Muktijoddha Hall',
        email: 'muktijoddha@hall.edu',
        address: 'Campus North Zone',
        capacity: 300,
        description: 'Residential hall for 300 students with dining facility.',
      },
      {
        id: 'h2',
        name: 'Bangabandhu Hall',
        email: 'bangabandhu@hall.edu',
        address: 'Campus South Zone',
        capacity: 250,
        description: 'Residential hall with attached study and dining facility.',
      },
    ],
  };
};

// --- Re-usable Small Stat Card ---
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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

<<<<<<< HEAD
=======
// --- Tab Button ---
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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

<<<<<<< HEAD
=======
// --- Hall Info Section (Update-able) ---
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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

<<<<<<< HEAD
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
=======
// --- Managers Section (Add / Remove) ---
const ManagersSection = ({
  managers,
  onAdd,
  onRemove,
}: {
  managers: Manager[];
  onAdd: (m: Omit<Manager, 'id'>) => void;
  onRemove: (id: string) => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hallName, setHallName] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !email.trim() || !hallName.trim()) {
      Alert.alert(
        'Missing Info',
        'Please enter manager name, email and hall name.'
      );
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    onAdd({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      hallName: hallName.trim(),
    });

    setName('');
    setEmail('');
    setHallName('');
    Alert.alert('Success', 'Manager has been added successfully.');
  };

  const confirmRemove = (manager: Manager) => {
    Alert.alert(
      'Remove Manager',
      `Are you sure you want to remove manager with email: ${manager.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onRemove(manager.id);
            Alert.alert('Removed', 'Manager removed successfully.');
          },
        },
      ]
    );
  };
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Manage Hall Managers</Text>

<<<<<<< HEAD
      <View style={styles.assignmentCard}>
        <Text style={{fontSize: 14, color: '#666', marginBottom: 10}}>
           Search existing student to appoint as manager:
        </Text>
        
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Student Email (e.g. u17040...)"
            value={searchEmail}
            onChangeText={setSearchEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />
            <TouchableOpacity 
                style={{backgroundColor: '#2563eb', padding: 12, borderRadius: 8, marginLeft: 10}} 
                onPress={handleSearch}
                disabled={searching}
            >
                {searching ? <ActivityIndicator color="#fff" size="small"/> : <Ionicons name="search-outline" size={20} color="#fff" />}
            </TouchableOpacity>
        </View>

        {foundStudent && (
             <View style={{marginTop: 15, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: '#1F2937'}}>{foundStudent.name}</Text>
                <Text style={{color: '#666', marginBottom: 5}}>{foundStudent.email}</Text>
                
                {foundStudent.role === 'user' ? (
                    <TouchableOpacity 
                        style={[styles.assignButton, {marginTop: 10}]} 
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
                    <Text style={{color: '#DC2626', marginTop: 5, fontWeight: 'bold'}}>
                        User is already a {foundStudent.role}
                    </Text>
                )}
                 <TouchableOpacity onPress={() => setFoundStudent(null)} style={{position: 'absolute', top: 5, right: 5}}>
                     <Ionicons name="close" size={20} color="#999" />
                 </TouchableOpacity>
             </View>
        )}
      </View>

=======
      {/* Add Manager */}
      <View style={styles.assignmentCard}>
        <TextInput
          style={styles.input}
          placeholder="Manager Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Manager Email (used for add/remove)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Hall Name (e.g., Muktijoddha Hall)"
          value={hallName}
          onChangeText={setHallName}
        />

        <TouchableOpacity style={styles.assignButton} onPress={handleAdd}>
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.assignButtonText}>Add Manager</Text>
        </TouchableOpacity>
      </View>

      {/* List Managers */}
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
        Current Managers ({managers.length})
      </Text>
      <ScrollView style={styles.scrollSection}>
<<<<<<< HEAD
        {managers.length === 0 ? (
          <Text style={styles.noDataText}>
            No managers found. Search and promote a student.
          </Text>
        ) : (
            managers.map(m => (
            <View key={m._id} style={styles.diningBoyItem}>
                <View style={styles.diningBoyDetails}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 10}}>
                             <Text style={{color: '#4F46E5', fontWeight: 'bold'}}>{m.name.charAt(0)}</Text>
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
=======
        {managers.map(m => (
          <View key={m.id} style={styles.diningBoyItem}>
            <View style={styles.diningBoyDetails}>
              <Text style={styles.diningBoyName}>{m.name}</Text>
              <Text style={styles.diningBoyEmail}>{m.email}</Text>
              <Text style={styles.diningBoyDate}>Hall: {m.hallName}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => confirmRemove(m)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        {managers.length === 0 && (
          <Text style={styles.noDataText}>
            No managers found. Please add a manager.
          </Text>
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
        )}
      </ScrollView>
    </View>
  );
};

<<<<<<< HEAD
=======
// --- Halls Section (Add only, never delete) ---
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
const HallsSection = ({
  halls,
  onAddHall,
}: {
  halls: Hall[];
  onAddHall: (h: Omit<Hall, 'id'>) => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');

  const handleAddHall = () => {
<<<<<<< HEAD
    // Mock Implementation for now
    Alert.alert('Feature Pending', 'Add Hall API is not integrated yet.');
=======
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation', 'Hall name and email are required.');
      return;
    }
    const capNumber = Number(capacity);
    if (capacity && (isNaN(capNumber) || capNumber <= 0)) {
      Alert.alert('Invalid Capacity', 'Please enter a valid capacity number.');
      return;
    }

    onAddHall({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      capacity: capNumber || 0,
      description: description.trim(),
    });

    setName('');
    setEmail('');
    setAddress('');
    setCapacity('');
    setDescription('');

    Alert.alert(
      'Hall Added',
      'New hall has been added. Hall records are never deleted.'
    );
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Add New Hall</Text>

      <View style={styles.assignmentCard}>
<<<<<<< HEAD
        <TextInput style={styles.input} placeholder="Hall Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Hall Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Hall Address" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="Capacity" value={capacity} onChangeText={setCapacity} keyboardType="numeric"/>
        <TextInput style={[styles.input, { height: 80 }]} placeholder="Description / Notes" value={description} onChangeText={setDescription} multiline />
=======
        <TextInput
          style={styles.input}
          placeholder="Hall Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Hall Email (e.g., hall@univ.edu)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Hall Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity (optional)"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description / Notes"
          value={description}
          onChangeText={setDescription}
          multiline
        />
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416

        <TouchableOpacity style={styles.assignButton} onPress={handleAddHall}>
          <Ionicons name="business-outline" size={20} color="#fff" />
          <Text style={styles.assignButtonText}>Add Hall</Text>
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>All Halls</Text>
      <ScrollView style={styles.scrollSection}>
         <Text style={styles.noDataText}>No halls found.</Text>
=======
      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
        All Halls ({halls.length})
      </Text>
      <ScrollView style={styles.scrollSection}>
        {halls.map(h => (
          <View key={h.id} style={styles.diningBoyItem}>
            <View style={styles.diningBoyDetails}>
              <Text style={styles.diningBoyName}>{h.name}</Text>
              <Text style={styles.diningBoyEmail}>{h.email}</Text>
              <Text style={styles.diningBoyDate}>
                Capacity: {h.capacity || 'N/A'}
              </Text>
              {!!h.address && (
                <Text style={styles.diningBoyDate}>Address: {h.address}</Text>
              )}
              {!!h.description && (
                <Text style={styles.diningBoyDate}>
                  Note: {h.description}
                </Text>
              )}
            </View>
            {/* NOTE: No delete button here (halls are never deleted) */}
          </View>
        ))}
        {halls.length === 0 && (
          <Text style={styles.noDataText}>
            No halls found. Start by adding a hall.
          </Text>
        )}
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
      </ScrollView>
    </View>
  );
};

<<<<<<< HEAD

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

=======
// --- Main Hall Authority Dashboard Component ---

export default function HallAuthorityDashboard() {
  const [earnings, setEarnings] = useState<MonthlyEarning[]>([]);
  const [hallInfo, setHallInfo] = useState<HallInfo>({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    notice: '',
  });
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  const [managers, setManagers] = useState<Manager[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AuthorityTab>('Dashboard');

<<<<<<< HEAD
  // Search States
  const [searchEmail, setSearchEmail] = useState('');
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);


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

=======
  useEffect(() => {
    setLoading(true);
    fetchAuthorityData().then(data => {
      setEarnings(data.earnings);
      setHallInfo(data.hallInfo);
      setManagers(data.managers);
      setHalls(data.halls);
      setLoading(false);
    });
  }, []);

  // Derived stats
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  const totalThisMonth = earnings[0]?.amount ?? 0;
  const totalLastMonth = earnings[1]?.amount ?? 0;
  const totalThisYear = earnings.reduce((sum, e) => sum + e.amount, 0);
  const earningGrowth =
    totalLastMonth === 0
      ? 0
      : Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100);

<<<<<<< HEAD
=======
  const totalHalls = halls.length;
  const totalManagers = managers.length;

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
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
<<<<<<< HEAD
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons name="cash-outline" size={18} color="#10B981"/>{' '}
=======
            {/* Earnings Overview */}
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons
                    name="cash-outline"
                    size={18}
                    color="#10B981"
                  />{' '}
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
                  Earnings Overview
                </Text>
              </View>

              <View style={styles.statsRow}>
<<<<<<< HEAD
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
                  <Ionicons name="calendar-outline" size={18} color="#F97316"/>{' '}
                  Monthly Earnings (Recent)
                </Text>
              </View>
=======
                <SmallStatCard
                  label="This Month"
                  value={`${totalThisMonth} ৳`}
                  subtitle={earnings[0]?.monthLabel}
                />
                <SmallStatCard
                  label="Last Month"
                  value={`${totalLastMonth} ৳`}
                  subtitle={earnings[1]?.monthLabel}
                />
              </View>

              <View style={[styles.statsRow, { marginTop: 10 }]}>
                <SmallStatCard
                  label="This Year Total"
                  value={`${totalThisYear} ৳`}
                />
                <SmallStatCard
                  label="Growth"
                  value={`${earningGrowth}%`}
                  subtitle="vs. last month"
                />
              </View>
            </View>

            {/* Hall & Manager Stats */}
            {/* <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons
                    name="business-outline"
                    size={18}
                    color="#6366F1"
                  />{' '}
                  Hall & Manager Status
                </Text>
              </View>

              <View style={styles.statsRow}>
                <SmallStatCard
                  label="Total Halls"
                  value={totalHalls}
                  subtitle="Registered"
                />
                <SmallStatCard
                  label="Total Managers"
                  value={totalManagers}
                  subtitle="Active"
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#4F46E5"
                  />{' '}
                  Use <Text style={{ fontWeight: '700' }}>Hall Info</Text> to
                  update main hall details and{' '}
                  <Text style={{ fontWeight: '700' }}>Halls</Text> tab to add
                  new halls.
                </Text>
              </View>
            </View> */}

            {/* Recent Months List */}
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#F97316"
                  />{' '}
                  Monthly Earnings (Recent)
                </Text>
              </View>

>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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
<<<<<<< HEAD
            onRemove={handleRemoveManager}
            searchEmail={searchEmail}
            setSearchEmail={setSearchEmail}
            handleSearch={handleSearchStudent}
            foundStudent={foundStudent}
            setFoundStudent={setFoundStudent}
            handlePromote={handlePromote}
            searching={searching}
            loadingAction={loadingAction}
=======
            onAdd={m => {
              setManagers(prev => [
                ...prev,
                { id: `m${Date.now()}`, ...m },
              ]);
            }}
            onRemove={id => {
              setManagers(prev => prev.filter(m => m.id !== id));
            }}
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
          />
        );

      case 'Halls':
        return (
          <HallsSection
            halls={halls}
<<<<<<< HEAD
            onAddHall={h => setHalls(prev => [...prev, { id: `h${Date.now()}`, ...h }])}
=======
            onAddHall={h =>
              setHalls(prev => [...prev, { id: `h${Date.now()}`, ...h }])
            }
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hallName}>University Hall Authority</Text>
      <Text style={styles.dashboardTitle}>
        Central Hall Control & Monitoring
      </Text>

<<<<<<< HEAD
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
=======
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TabButton
          tab="Dashboard"
          activeTab={activeTab}
          onPress={setActiveTab}
          icon="grid-outline"
        />
        <TabButton
          tab="HallInfo"
          activeTab={activeTab}
          onPress={setActiveTab}
          icon="information-circle-outline"
        />
        <TabButton
          tab="Managers"
          activeTab={activeTab}
          onPress={setActiveTab}
          icon="people-outline"
        />
        <TabButton
          tab="Halls"
          activeTab={activeTab}
          onPress={setActiveTab}
          icon="business-outline"
        />
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCurrentTab()}
      </ScrollView>

      {/* Logout */}
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
  // Tab Bar
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
<<<<<<< HEAD
=======
  infoBox: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  infoText: {
    fontSize: 14,
    color: '#4F46E5',
  },
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 6c0acbe09b12f47db99b7c37c2c9a3ef819d5416
