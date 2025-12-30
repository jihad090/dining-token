import React, { useState, useEffect, useRef } from 'react';
import { 
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, 
    RefreshControl, Modal, TextInput, Dimensions, 
    KeyboardAvoidingView, Platform, FlatList, SafeAreaView, StatusBar
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

import { API_BASE_URL, SOCKET_URL } from '@/constants/api'; 

const { width } = Dimensions.get('window'); 
const TABS = ['Available', 'Sell', 'Buy', 'History'];

const getSafeId = (data: any): string => {
    if (!data) return '';
    const id = typeof data === 'object' ? (data._id || data.id) : data;
    return id ? id.toString().replace(/['"]+/g, '') : '';
};

export default function ShareTokenScreen() {
  const [activeTab, setActiveTab] = useState('Available');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  
  // Data States
  const [myTokens, setMyTokens] = useState<any[]>([]);      
  const [myListings, setMyListings] = useState<any[]>([]);   
  const [marketTokens, setMarketTokens] = useState<any[]>([]); 
  const [salesHistory, setSalesHistory] = useState<any[]>([]); 

  // Modal States
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState('');

  // Chat States
  const [chatVisible, setChatVisible] = useState(false);
  const [activeChatTokenId, setActiveChatTokenId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const [isBuyer, setIsBuyer] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [tokenPaymentStatus, setTokenPaymentStatus] = useState('None'); 
  const [currentTokenPrice, setCurrentTokenPrice] = useState(0);
  const [opponentName, setOpponentName] = useState('');

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<any>(null);
  const activeChatTokenIdRef = useRef<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    activeChatTokenIdRef.current = activeChatTokenId;
  }, [activeChatTokenId]);

  useEffect(() => {
    let socket: any = null;
    const setupSocket = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const safeUserId = getSafeId(userId);
        if (safeUserId) {
            setCurrentUserId(safeUserId);
            socket = io(SOCKET_URL, { transports: ['websocket'], reconnection: true });
            socketRef.current = socket;

            socket.on('connect', () => { socket.emit('joinUserRoom', safeUserId); });
            
            socket.on('buy_request_notification', (data: any) => {
                Alert.alert("🔔 New Request", data.message, [{ text: "Check", onPress: () => { handleTabChange('Sell'); fetchData('Sell'); }}]);
            });

            socket.on('payment_status_updated', (data: any) => {
                if (activeChatTokenIdRef.current && getSafeId(data.tokenID) === getSafeId(activeChatTokenIdRef.current)) {
                    if (data.status === 'Paid') {
                        setTokenPaymentStatus('Paid');
                        setChatMessages(prev => [...prev, { senderId: 'SYSTEM', text: 'Buyer marked as PAID. Please verify.', timestamp: new Date() }]);
                    }
                }
            });

            socket.on('receive_chat_message', (data: any) => {
                const currentOpenId = activeChatTokenIdRef.current;
                const incomingId = getSafeId(data.tokenId);
                if (currentOpenId && incomingId === getSafeId(currentOpenId)) {
                    setChatMessages(prev => [...prev, data.message]);
                }
            });

            socket.on('token_transfer_completed', (data: any) => {
                Alert.alert("🎉 Success", data.message);
                setChatVisible(false);
                fetchData('Available'); 
                fetchData('Buy');       
            });
        }
    };
    setupSocket();
    return () => { if (socket) { socket.disconnect(); socketRef.current = null; } };
  }, []);

  useEffect(() => { fetchData(activeTab); }, [activeTab]);

  const fetchData = async (tab = activeTab) => {
    setLoading(true);
    try {
        const token = await AsyncStorage.getItem('userToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        let url = `${API_BASE_URL}/dining-token/upcoming`;
        if (tab === 'Sell') url = `${API_BASE_URL}/dining-token/my-sales`;
        else if (tab === 'Buy') url = `${API_BASE_URL}/dining-token/marketplace`;
        else if (tab === 'History') url = `${API_BASE_URL}/dining-token/my-sales-history`;

        const res = await fetch(url, { headers });
        const data = await res.json();

        if (res.ok) {
            if (tab === 'Available') setMyTokens(Array.isArray(data) ? data : data.tokens || []);
            else if (tab === 'Sell') setMyListings(Array.isArray(data) ? data : []);
            else if (tab === 'Buy') setMarketTokens(Array.isArray(data) ? data : []);
            else if (tab === 'History') setSalesHistory(Array.isArray(data) ? data : []);
        }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleTabChange = (tabName: string) => {
    const index = TABS.indexOf(tabName);
    setActiveTab(tabName);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleRemoveListing = async (tokenId: string) => {
    Alert.alert("Remove Listing?", "Stop selling and return token to your wallet?", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Remove", style: 'destructive', onPress: async () => {
            try {
                const jwt = await AsyncStorage.getItem('userToken');
                const res = await fetch(`${API_BASE_URL}/dining-token/remove-listing`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
                    body: JSON.stringify({ id: tokenId })
                });
                if (res.ok) { fetchData('Sell'); fetchData('Available'); }
            } catch (e) { console.error(e); }
        }}
    ]);
  };

  const formatBDDate = (dateString: any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        timeZone: 'Asia/Dhaka', 
        weekday: 'short',       
        year: 'numeric',      
        month: 'short',         
        day: 'numeric'          
    });
};

const formatBDTime = (dateString: any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

  const handleRejectBuyer = async () => {
    Alert.alert("Close Chat?", "Cancel deal & Close chat?", [
        { text: "No", style: "cancel" },
        { text: "Yes, Close", style: 'destructive', onPress: async () => {
            try {
                const jwt = await AsyncStorage.getItem('userToken');
                const res = await fetch(`${API_BASE_URL}/dining-token/reject-buyer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
                    body: JSON.stringify({ id: activeChatTokenId })
                });
                if (res.ok) { setChatVisible(false); fetchData('Sell'); }
            } catch (e) { console.error(e); }
        }}
    ]);
  };

  const openChat = async (tokenItem: any) => {
      setActiveChatTokenId(tokenItem._id);
      setCurrentTokenPrice(tokenItem.price || 0);
      setTokenPaymentStatus(tokenItem.paymentStatus || 'None'); 
      setChatVisible(true);

      const ownerId = getSafeId(tokenItem.ownerId);
      const myId = getSafeId(currentUserId); 
      let name = "User";
      
      if (ownerId === myId) {
          setIsSeller(true); setIsBuyer(false);
          name = tokenItem.requestedBy?.name || "Buyer";
      } else {
          setIsBuyer(true); setIsSeller(false);
          name = tokenItem.ownerId?.name || "Seller";
      }
      setOpponentName(name);

      try {
          const jwt = await AsyncStorage.getItem('userToken');
          const res = await fetch(`${API_BASE_URL}/dining-token/chat/${tokenItem._id}`, { headers: { 'Authorization': `Bearer ${jwt}` } });
          const data = await res.json();
          if(Array.isArray(data)) setChatMessages(data);
      } catch(e) { console.error(e); }
  };

  const sendMessage = async () => {
      if (!chatInput.trim()) return;
      const tempMsg = { senderId: currentUserId, text: chatInput, timestamp: new Date().toISOString() };
      setChatMessages(prev => [...prev, tempMsg]);
      setChatInput('');
      try {
          const jwt = await AsyncStorage.getItem('userToken');
          await fetch(`${API_BASE_URL}/dining-token/chat/send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
              body: JSON.stringify({ tokenID: activeChatTokenId, text: tempMsg.text }) 
          });
      } catch (e) { console.error(e); }
  };

  const handleMarkAsPaid = async () => {
    Alert.alert("Confirm Payment", "Are you sure you sent the money?", [
        { text: "No", style: 'cancel'},
        { text: "Yes, Sent", onPress: async () => {
            const jwt = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}/dining-token/mark-paid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
                body: JSON.stringify({ tokenID: activeChatTokenId }) 
            });
            if(res.ok) setTokenPaymentStatus('Paid');
        }}
    ]);
  };

  const handleConfirmSell = async () => {
    Alert.alert("Confirm Transfer", "Only confirm if you received money.", [
        { text: "Wait", style: 'cancel'},
        { text: "Yes, Received", onPress: async () => {
            try {
                const jwt = await AsyncStorage.getItem('userToken');
                const res = await fetch(`${API_BASE_URL}/dining-token/confirm-sell`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
                    body: JSON.stringify({ id: activeChatTokenId })
                });
                if(res.ok) { setChatVisible(false); Alert.alert("Success!", "Token Transferred!"); fetchData('Sell'); fetchData('History'); }
            } catch (e) { Alert.alert("Error", "Network error."); }
        }}
    ]);
  };

  const handleListToken = async () => {
    if(!selectedTokenId || !sellPrice) return;
    try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${API_BASE_URL}/dining-token/sell`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ tokenID: selectedTokenId, price: Number(sellPrice) })
        });
        if(res.ok) { setSellModalVisible(false); setSellPrice(''); Alert.alert("Success", "Listed!"); fetchData('Available'); handleTabChange('Sell'); }
    } catch(e) { console.error(e); }
  };

  const handleRequestBuy = async (item: any) => {
    try {
        const jwt = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${API_BASE_URL}/dining-token/buy-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
            body: JSON.stringify({ id: item._id })
        });
        if (res.ok) {
            const updatedItem = { ...item, status: 'Requested', requestedBy: { _id: currentUserId } };
            setMarketTokens(prev => prev.map(t => t._id === item._id ? updatedItem : t));
            openChat(updatedItem);
        } else fetchData('Buy');
    } catch (e) { fetchData('Buy'); }
  };

  return (
    <View style={styles.container}>
      {/* Tab Header */}
      <View style={styles.headerTabs}>
          {TABS.map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]} onPress={() => handleTabChange(tab)}>
                  <Ionicons name={tab==='Available'?'home':tab==='Sell'?'pricetag':tab==='Buy'?'cart':'time'} size={18} color={activeTab === tab ? '#2563EB' : '#666'} />
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
          ))}
      </View>

      {/* Main Content */}
      <ScrollView 
        ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
             const index = Math.round(ev.nativeEvent.contentOffset.x / width);
             if (TABS[index] !== activeTab) setActiveTab(TABS[index]);
        }}
      >
        {/* Available */}
        <ScrollView style={{ width }} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData('Available')}/>}>
            {myTokens.length === 0 ? <View style={{alignItems:'center', marginTop:50}}><Text style={{color:'#999'}}>No Tokens</Text></View> :
            myTokens.map((item: any, i) => (
                <View key={i} style={styles.card}>
                    <View style={styles.cardLeft}>
                        <View style={styles.iconBox}><Ionicons name="fast-food" size={24} color="#2563EB" /></View>
                        <View><Text style={styles.cardTitle}>{item.mealType}</Text><Text style={styles.cardDate}>{new Date(item.date).toDateString()}</Text></View>
                    </View>
                    <TouchableOpacity style={styles.smartBtnSell} onPress={() => { setSelectedTokenId(item.tokenID); setSellPrice(''); setSellModalVisible(true); }}>
                        <Text style={styles.btnText}>Sell</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        {/* Sell */}
        <ScrollView style={{ width }} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData('Sell')}/>}>
            {myListings.length === 0 ? <View style={{alignItems:'center', marginTop:50}}><Text style={{color:'#999'}}>No Listings</Text></View> :
            myListings.map((item: any) => (
                <View key={item._id} style={styles.card}>
                    <View style={styles.cardLeft}>
                        <View style={[styles.iconBox, {backgroundColor:'#ECFDF5'}]}><Text style={{fontSize:18}}>৳</Text></View>
                        <View>
                            <Text style={styles.cardTitle}>{item.mealType} (৳{item.price})</Text>
                             <Text style={{fontSize: 12, color: '#6B7280', marginVertical: 2}}>
                                                                📅 {formatBDDate(item.date)}
                                                            </Text>  
                            <Text style={{fontSize:11, color: item.status==='Requested'?'#D97706':'#10B981', fontWeight:'bold'}}>{item.status === 'Requested' ? '● Action Needed' : '● Listed'}</Text>
                        </View>
                    </View>
                   {item.status === 'Requested' ? (
                        <TouchableOpacity style={styles.smartBtnChat} onPress={() => openChat(item)}><Text style={styles.btnText}>View</Text></TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{padding:8, backgroundColor:'#FEE2E2', borderRadius:20}} onPress={() => handleRemoveListing(item._id)}>
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </ScrollView>

        {/* Buy */}
        <ScrollView style={{ width }} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData('Buy')}/>}>
            {marketTokens.length === 0 ? <View style={{alignItems:'center', marginTop:50}}><Text style={{color:'#999'}}>Market Empty</Text></View> :
            marketTokens.map((item: any) => {
                const isMyRequest = item.status === 'Requested' && getSafeId(item.requestedBy?._id || item.requestedBy) === getSafeId(currentUserId);
                return (
                    <View key={item._id} style={[styles.card, isMyRequest && styles.cardActiveRequest]}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.iconBox, {backgroundColor:'#EFF6FF'}]}><Ionicons name="person" size={20} color="#2563EB"/></View>
                            <View>
                                <Text style={styles.cardTitle}>{item.mealType} <Text style={{color:'#10B981'}}>৳{item.price}</Text></Text>
                                 <Text style={{fontSize: 12, color: '#6B7280', marginVertical: 2}}>
                                                                    📅 {formatBDDate(item.date)}
                                                                </Text>  
                                <Text style={styles.cardDate}>Seller: {item.ownerId?.name || 'Student'}</Text>
                                <Text style={{fontSize: 12, color: '#4B5563', fontWeight:'600'}}>
                                        {item.ownerId?.hallName || 'Unknown Hall'}
                                    </Text>
                                {isMyRequest && <Text style={{fontSize:10, color:'#D97706'}}>Waiting...</Text>}
                            </View>
                        </View>
                        {isMyRequest ? (
                            <TouchableOpacity style={styles.smartBtnChat} onPress={() => openChat(item)}><Text style={styles.btnText}>Chat</Text></TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.smartBtnBuy} onPress={() => handleRequestBuy(item)}><Text style={styles.btnText}>Buy</Text></TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </ScrollView>

        {/* History */}
        <ScrollView style={{ width }} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData('History')}/>}>
            {salesHistory.map((item: any, i) => (
                <View key={i} style={[styles.card, {borderLeftWidth:4, borderLeftColor:'#10B981'}]}>
                    <View style={styles.cardLeft}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        <View style={{marginLeft:10}}><Text style={styles.cardTitle}>{item.mealType}</Text><Text style={styles.cardDate}>{new Date(item.date).toDateString()}</Text></View>
                    </View>
                    <Text style={{fontSize:16, fontWeight:'bold', color:'#10B981'}}>+৳{item.soldPrice}</Text>
                </View>
            ))}
        </ScrollView>
      </ScrollView>

      {/* Sell Modal */}
      <Modal visible={sellModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Sell Token</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={sellPrice} onChangeText={setSellPrice} placeholder="Price (TK)" autoFocus/>
                  <View style={styles.modalActions}>
                      <TouchableOpacity onPress={() => setSellModalVisible(false)} style={styles.modalBtnCancel}><Text>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={handleListToken} style={styles.modalBtnConfirm}><Text style={{color:'#fff', fontWeight:'bold'}}>List</Text></TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

      {/* 🔥 FIX: Modern Chat Modal Structure */}
      <Modal visible={chatVisible} animationType="slide" onRequestClose={() => { setChatVisible(false); fetchData(activeTab); }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Status Bar Fix */}
            <View style={{height: Platform.OS === 'android' ? 60 : 20}} />
            
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                
                {/* 1. HEADER (Fixed Overlap) */}
                <View style={styles.modernHeader}>
                    <View style={{ flex: 1, marginRight: 10 }}> 
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {opponentName}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tokenPaymentStatus === 'Paid' ? '#10B981' : '#F59E0B' }} />
                            <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                {tokenPaymentStatus === 'Paid' ? 'Payment Verified' : 'Payment Pending'}
                            </Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        onPress={() => { setChatVisible(false); fetchData(activeTab); }}
                        style={styles.closeBtn}
                    >
                        <Ionicons name="close" size={24} color="#374151"/>
                    </TouchableOpacity>
                </View>

                {/* 2. CHAT LIST (Clean Look) */}
                <FlatList
                    ref={flatListRef}
                    data={chatMessages}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => {
                        if (item.senderId === 'SYSTEM') return <Text style={styles.sysMsg}>{item.text}</Text>;
                        const isMe = getSafeId(item.senderId) === getSafeId(currentUserId);
                        return (
                            <View style={[styles.msgRow, isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                                {/* Show avatar only for opponent */}
                                {!isMe && (
                                    <View style={styles.avatarSmall}>
                                        <Text style={{color:'#fff', fontSize:12, fontWeight:'bold'}}>
                                            {opponentName.charAt(0)}
                                        </Text>
                                    </View>
                                )}
                                <View style={[styles.msgBubble, isMe ? styles.msgMe : styles.msgOther]}>
                                    <Text style={{ color: isMe ? '#fff' : '#1F2937', fontSize: 15 }}>{item.text}</Text>
                                    <Text style={{ fontSize: 9, color: isMe ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: 4, alignSelf: 'flex-end' }}>
                                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />

                {/* 3. ACTION BAR (Fixed Stacking Issue) */}
                <View style={styles.modernActionBar}>
                    
                    {/* Buyer Logic */}
                    {isBuyer && tokenPaymentStatus !== 'Paid' && (
                        <TouchableOpacity style={styles.primaryBtn} onPress={handleMarkAsPaid}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.btnTextBig}>Mark as Paid (৳{currentTokenPrice})</Text>
                        </TouchableOpacity>
                    )}

                    {isBuyer && tokenPaymentStatus === 'Paid' && (
                        <View style={styles.infoBox}>
                            <Ionicons name="time" size={20} color="#D97706" />
                            <Text style={{ color: '#B45309', fontWeight: '600' }}>Waiting for seller confirmation...</Text>
                        </View>
                    )}

                    {/* Seller Logic */}
                    {isSeller && (
                        <View style={{ width: '100%', gap: 10 }}>
                            {tokenPaymentStatus === 'Paid' ? (
                                <View style={{ gap: 8 }}>
                                    <View style={styles.successBox}>
                                        <Ionicons name="alert-circle" size={20} color="#059669" />
                                        <Text style={{ color: '#047857', flex: 1, fontSize: 13 }}>Buyer says they paid. Check your bKash/Nagad.</Text>
                                    </View>
                                    <TouchableOpacity style={styles.successBtn} onPress={handleConfirmSell}>
                                        <Text style={styles.btnTextBig}>Confirm & Transfer Token</Text>
                                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.infoBox}>
                                    <Text style={{ color: '#B45309', fontSize: 13 }}>Waiting for buyer to pay...</Text>
                                </View>
                            )}

                            {/* Clean Cancel Button */}
                            <TouchableOpacity style={styles.outlineBtnDestructive} onPress={handleRejectBuyer}>
                                <Text style={{ color: '#EF4444', fontWeight: '600' }}>
                                    {tokenPaymentStatus === 'Paid' ? "Reject Deal" : "Cancel Deal"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* 4. INPUT AREA */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.modernInput}
                        value={chatInput}
                        onChangeText={setChatInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#9CA3AF"
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity 
                        style={[styles.sendBtn, {backgroundColor: chatInput.trim() ? '#2563EB' : '#E5E7EB'}]} 
                        onPress={sendMessage} 
                        disabled={!chatInput.trim()}
                    >
                        <Ionicons name="send" size={18} color={chatInput.trim() ? "#fff" : "#9CA3AF"} />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
          </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', paddingTop: 40 },
    headerTabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
    tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent:'center', borderBottomWidth: 3, borderColor: 'transparent', flexDirection:'row', gap:5 },
    activeTabBtn: { borderColor: '#2563EB' },
    tabText: { color: '#6B7280', fontWeight: '600', fontSize: 13 },
    activeTabText: { color: '#2563EB', fontWeight: 'bold' },
    scrollContent: { padding: 16, paddingBottom: 120 }, 
    
    // Cards
    card: { backgroundColor: '#fff', marginBottom: 12, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.05, shadowRadius:4, elevation: 3 },
    cardActiveRequest: { borderColor: '#F59E0B', borderWidth: 1.5, backgroundColor:'#FFFBEB' },
    cardLeft: { flexDirection:'row', alignItems:'center', gap: 12, flex: 1 },
    iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontWeight: 'bold', fontSize: 15, color: '#1F2937', flexWrap:'wrap' },
    cardDate: { color: '#6B7280', fontSize: 12, marginTop: 2 },

    smartBtnSell: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
    smartBtnBuy: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
    smartBtnChat: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor: '#8B5CF6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
    btnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
    btnTextBig: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#fff', padding: 24, borderRadius: 16, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, fontSize:16, marginBottom: 20, backgroundColor:'#F9FAFB' },
    modalActions: { flexDirection:'row', justifyContent:'flex-end', gap: 15 },
    modalBtnCancel: { padding: 10 },
    modalBtnConfirm: { backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },

    // 🔥 NEW HEADER STYLES
    modernHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff',
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6', elevation: 2
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
    closeBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },

    // 🔥 NEW CHAT STYLES
    msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
    avatarSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#9CA3AF', alignItems: 'center', justifyContent: 'center' },
    msgBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, maxWidth: '75%' },
    msgMe: { backgroundColor: '#2563EB', borderBottomRightRadius: 2 },
    msgOther: { backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#E5E7EB' },
    sysMsg: { textAlign: 'center', fontSize: 11, color: '#6B7280', marginVertical: 12, backgroundColor: '#E5E7EB', alignSelf:'center', paddingHorizontal:12, paddingVertical:4, borderRadius:10 },

    // 🔥 NEW ACTION BAR
    modernActionBar: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    infoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFBEB', padding: 10, borderRadius: 8, marginBottom: 5 },
    successBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ECFDF5', padding: 10, borderRadius: 8 },
    primaryBtn: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
    successBtn: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
    outlineBtnDestructive: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2' },

    // Input Area
    inputWrapper: { flexDirection: 'row', alignItems: 'center', padding: 5, paddingBottom: 40,backgroundColor: '#ffffffff', gap: 5 },
    modernInput: { flex: 1, backgroundColor: '#e1e6e2ff', borderRadius: 24, paddingHorizontal: 18,paddingTop: 20,paddingBottom: 10, paddingVertical: 15, fontSize: 15, color: '#1F2937' },
    sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});