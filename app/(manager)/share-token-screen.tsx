import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, TextInput, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
// Assuming ThemedView/Text are simple wrappers for light/dark mode

// --- Types & Dummy Data (Move these to a separate data file in a real app) ---
interface Token {
  id: number;
  hallName: string;
  date: string;
  mealType: 'Lunch' | 'Dinner';
}

interface SellerToken extends Token {
  sellerName: string;
  sellerEmail: string;
  note?: string;
  isRequested: boolean;
}

interface AvailableToken extends Token {
  isAvailable: boolean;
}

const availableTokens: AvailableToken[] = [
  { id: 101, hallName: 'Muktijoddha Hall', date: '2025-11-18', mealType: 'Lunch', isAvailable: true },
  { id: 102, hallName: 'Muktijoddha Hall', date: '2025-11-18', mealType: 'Dinner', isAvailable: true },
  { id: 103, hallName: 'Kazi Nazrul Hall', date: '2025-11-19', mealType: 'Lunch', isAvailable: true },
  { id: 104, hallName: 'Muktijoddha Hall', date: '2025-11-19', mealType: 'Dinner', isAvailable: true },
];

const tokensForSale: SellerToken[] = [
  { id: 202, hallName: 'Muktijoddha Hall', date: '2025-11-18', mealType: 'Lunch', sellerName: 'MD. Al Jihad', sellerEmail: '2104090@student.cuet.ac.bd', note: " ", isRequested: true },  
  { id: 201, hallName: 'Qk hall', date: '2025-11-17', mealType: 'Dinner', sellerName: 'Efti', sellerEmail: '2104128@student.cuet.ac.bd', note: 'Can sell only after 7 PM', isRequested: false },
  { id: 203, hallName: 'North Hall', date: '2025-11-18', mealType: 'Dinner', sellerName: 'MD. Mehedi', sellerEmail: '2104067@student.cuet.ac.bd', note: 'Urgent sale, contact soon!', isRequested: false },
  { id: 207, hallName: 'Muktijoddha Hall', date: '2025-11-18', mealType: 'Dinner', sellerName: 'Abu Shaid', sellerEmail: '2104070@student.cuet.ac.bd', note: 'Urgent sale, contact soon!', isRequested: false },
  { id: 212, hallName: 'Muktijoddha Hall', date: '2025-11-18', mealType: 'Lunch', sellerName: 'MD. Al Jihad', sellerEmail: '2104090@student.cuet.ac.bd', note: " ", isRequested: true },  
  { id: 211, hallName: 'Qk hall', date: '2025-11-17', mealType: 'Dinner', sellerName: 'Efti', sellerEmail: '2104128@student.cuet.ac.bd', note: 'Can sell only after 7 PM', isRequested: false },
  { id: 213, hallName: 'North Hall', date: '2025-11-18', mealType: 'Dinner', sellerName: 'MD. Mehedi', sellerEmail: '2104067@student.cuet.ac.bd', note: 'Urgent sale, contact soon!', isRequested: false },
  { id: 217, hallName: 'Muktijoddha Hall', date: '2025-11-18', mealType: 'Dinner', sellerName: 'Abu Shaid', sellerEmail: '2104070@student.cuet.ac.bd', note: 'Urgent sale, contact soon!', isRequested: false },
];
// --- End Types & Dummy Data ---


// Placeholder components for theming - replace with your actual Themed components
const ThemedView = (props: any) => <View style={[{ backgroundColor: '#F3F4F6' }, props.style]}>{props.children}</View>;
const ThemedText = (props: any) => <Text style={[{ color: 'black', fontSize: props.type === 'title' ? 24 : 16 }, props.style]}>{props.children}</Text>;


export default function ShareToken() {
  const [selected, setSelected] = useState<'Buy' | 'Sell'>('Buy');
  const [selectedSellTokenId, setSelectedSellTokenId] = useState<number | null>(null);
  const [sellNote, setSellNote] = useState('');
  const [buySearchDate, setBuySearchDate] = useState('');
  const [buySearchMeal, setBuySearchMeal] = useState<'All' | 'Lunch' | 'Dinner'>('All');
  
  // State for Buy Token Modal/Details View
  const [viewingSellerToken, setViewingSellerToken] = useState<SellerToken | null>(null);


  // --- Buy Token Logic ---
  const handleRequestToken = (token: SellerToken) => {
    Alert.alert(
      "Confirm Request",
      `Are you sure you want to request the ${token.mealType} token for ${token.date} from ${token.sellerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => {
             // 1. Send request to the server (WebSocket/API)
             console.log(`Request sent for token ID: ${token.id}`);
             // 2. Clear the detail view
             setViewingSellerToken(null);
             Alert.alert("Request Sent!", `Your request has been sent to ${token.sellerName}. You will be notified of their response.`);
        }}
      ]
    );
  };
  
  const filteredTokensForSale = tokensForSale.filter(token => {
      const dateMatch = !buySearchDate || token.date.includes(buySearchDate);
      const mealMatch = buySearchMeal === 'All' || token.mealType === buySearchMeal;
      return dateMatch && mealMatch;
  });

  const renderBuyTokenSection = () => {
    if (viewingSellerToken) {
        return (
            <View style={styles.detailContainer}>
                <TouchableOpacity onPress={() => setViewingSellerToken(null)} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color="#1F2937" />
                    <Text style={styles.backButtonText}>Back to List</Text>
                </TouchableOpacity>

                <View style={styles.tokenDetailCard}>
                    <ThemedText style={styles.detailTitle}>{viewingSellerToken.mealType} Token</ThemedText>
                    <DetailRow label="Date" value={viewingSellerToken.date} />
                    <DetailRow label="Hall" value={viewingSellerToken.hallName} />
                    <DetailRow label="Seller" value={viewingSellerToken.sellerName} />
                    <DetailRow label="Email" value={viewingSellerToken.sellerEmail} highlight={true} />
                    {viewingSellerToken.note && <DetailRow label="Note" value={viewingSellerToken.note} />}
                </View>

                <TouchableOpacity 
                    style={styles.requestButton}
                    onPress={() => handleRequestToken(viewingSellerToken)}
                    disabled={viewingSellerToken.isRequested}
                >
                    <Ionicons name="mail-outline" size={20} color="#fff" style={{marginRight: 10}} />
                    <Text style={styles.requestButtonText}>
                        {viewingSellerToken.isRequested ? 'Request Already Sent' : 'Request Token'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    // List View
    return (
      <>
        {/* Search/Filter Bar */}
        <View style={styles.searchBar}>
            <TextInput 
                style={styles.searchInput}
                placeholder="Search by Date (YYYY-MM-DD)"
                value={buySearchDate}
                onChangeText={setBuySearchDate}
            />
            <MealTypeSelector value={buySearchMeal} onChange={setBuySearchMeal} />
        </View>

        <ScrollView style={styles.listScrollView}>
          {filteredTokensForSale.length === 0 ? (
              <Text style={styles.emptyListText}>No tokens currently available for sale.</Text>
          ) : (
              filteredTokensForSale.map(token => (
                  <TouchableOpacity 
                      key={token.id} 
                      style={styles.listItem}
                      onPress={() => setViewingSellerToken(token)}
                  >
                      <View style={styles.listItemContent}>
                          <Ionicons 
                            name={token.mealType === 'Dinner' ? 'moon-outline' : 'sunny-outline'} 
                            size={24} 
                            color={token.mealType === 'Dinner' ? '#4F46E5' : '#F59E0B'} 
                            style={{marginRight: 10}}
                          />
                          <View>
                              <Text style={styles.listItemTitle}>{token.mealType} Token on {token.date}</Text>
                              <Text style={styles.listItemSubtitle}>{token.hallName} - Seller: {token.sellerName}</Text>
                          </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </TouchableOpacity>
              ))
          )}
        </ScrollView>
      </>
    );
  };
  

  // --- Sell Token Logic ---
  const handlePostTokenForSale = () => {
    if (!selectedSellTokenId) {
        Alert.alert("Error", "Please select a token to post for sale.");
        return;
    }
    const tokenToSell = availableTokens.find(t => t.id === selectedSellTokenId);

    Alert.alert(
      "Confirm Sale Post",
      `Are you sure you want to post your ${tokenToSell?.mealType} token for ${tokenToSell?.date} for sale?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => {
             // 1. API call to post token (sending token ID and sellNote)
             console.log(`Token ID ${selectedSellTokenId} posted with note: ${sellNote}`);
             // 2. Reset the form
             setSelectedSellTokenId(null);
             setSellNote('');
             Alert.alert("Success", "Your token is now visible in the Buy Token section!");
        }}
      ]
    );
  };

  const renderSellTokenSection = () => {
    const tokensAwaitingResponse = tokensForSale.filter(t => t.isRequested);
    
    return (
      <ScrollView style={styles.listScrollView}>
        
        {/* Tokens Awaiting Response/Requests */}
        <Text style={styles.sectionHeader}>Requests for Your Posted Tokens ({tokensAwaitingResponse.length})</Text>
        {tokensAwaitingResponse.length > 0 ? (
            tokensAwaitingResponse.map(token => (
                <View key={token.id} style={[styles.listItem, styles.requestItem]}>
                    <View style={styles.listItemContent}>
                        <Ionicons name="alert-circle-outline" size={24} color="#D97706" style={{marginRight: 10}} />
                        <View>
                            <Text style={styles.listItemTitle}>Request for {token.mealType} Token</Text>
                            <Text style={styles.listItemSubtitle}>Token on {token.date}. A buyer is waiting!</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.viewRequestButton}>
                        <Text style={styles.viewRequestButtonText}>Review</Text>
                    </TouchableOpacity>
                </View>
            ))
        ) : (
            <Text style={styles.emptyListText}>No pending requests for your tokens.</Text>
        )}
        
        {/* Token Selection for Posting */}
        <Text style={styles.sectionHeader}>Select Your Available Token to Post</Text>
        {availableTokens.filter(t => t.isAvailable).map(token => (
          <TouchableOpacity 
            key={token.id} 
            style={[
              styles.listItem, 
              styles.selectableItem,
              selectedSellTokenId === token.id && styles.selectedItem
            ]}
            onPress={() => setSelectedSellTokenId(token.id)}
          >
              <View style={styles.listItemContent}>
                  <Ionicons name="checkmark-circle-outline" size={24} color={selectedSellTokenId === token.id ? '#10B981' : '#6B7280'} style={{marginRight: 10}} />
                  <View>
                      <Text style={styles.listItemTitle}>{token.mealType} Token</Text>
                      <Text style={styles.listItemSubtitle}>{token.hallName} on {token.date}</Text>
                  </View>
              </View>
          </TouchableOpacity>
        ))}

        {/* Short Note and Confirm */}
        <Text style={[styles.sectionHeader, {marginTop: 20}]}>Add Short Note (Optional)</Text>
        <TextInput
            style={styles.noteInput}
            placeholder="e.g., 'Available only after 8 PM', 'Need to confirm before 10 AM'"
            value={sellNote}
            onChangeText={setSellNote}
            multiline
        />

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handlePostTokenForSale}
          disabled={!selectedSellTokenId}
        >
          <Text style={styles.confirmButtonText}>
             CONFIRM POST FOR SALE
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.hallName}>Token Marketplace</ThemedText>
      
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, selected === 'Buy' && styles.selectorButtonActive]}
          onPress={() => {setSelected('Buy'); setViewingSellerToken(null);}}
        >
          <Text style={[styles.selectorText, selected === 'Buy' && styles.selectorTextActive]}>
            <Ionicons name="cart-outline" size={18} color={selected === 'Buy' ? '#fff' : '#555'} /> Buy Token
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.selectorButton, selected === 'Sell' && styles.selectorButtonActive]}
          onPress={() => {setSelected('Sell'); setViewingSellerToken(null);}}
        >
          <Text style={[styles.selectorText, selected === 'Sell' && styles.selectorTextActive]}>
            <Ionicons name="wallet-outline" size={18} color={selected === 'Sell' ? '#fff' : '#555'} /> Sell Token
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {selected === 'Buy' ? renderBuyTokenSection() : renderSellTokenSection()}
      </View>

    </ThemedView>
  );
}

// --- Helper Components for Buy/Sell Section ---

const DetailRow = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>{value}</Text>
    </View>
);

const MealTypeSelector = ({ value, onChange }: { value: 'All' | 'Lunch' | 'Dinner', onChange: (val: 'All' | 'Lunch' | 'Dinner') => void }) => (
    <View style={styles.mealTypeSelectorContainer}>
        {['All', 'Lunch', 'Dinner'].map((meal) => (
            <TouchableOpacity
                key={meal}
                style={[styles.mealTypeButton, value === meal && styles.mealTypeButtonActive]}
                onPress={() => onChange(meal as 'All' | 'Lunch' | 'Dinner')}
            >
                <Text style={[styles.mealTypeButtonText, value === meal && styles.mealTypeButtonTextActive]}>{meal}</Text>
            </TouchableOpacity>
        ))}
    </View>
);


// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  hallName: {
    textAlign: 'center',
    marginVertical: 10,
    marginTop: 40,
    fontWeight: 'bold',
    fontSize: 22,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#ffffff', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorButtonActive: {
    backgroundColor: '#B09160', 
    borderColor: '#B09160',
  },
  selectorText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  // Buy List Styles
  searchBar: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  mealTypeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  mealTypeButtonActive: {
    backgroundColor: '#6366F1',
  },
  mealTypeButtonText: {
    fontSize: 12,
    color: '#4B5563',
  },
  mealTypeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listScrollView: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#9CA3AF',
  },
  // Buy Detail Styles
  detailContainer: {
      flex: 1,
      paddingTop: 10,
  },
  backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  backButtonText: {
      fontSize: 16,
      color: '#1F2937',
      marginLeft: 5,
  },
  tokenDetailCard: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      marginBottom: 30,
      borderLeftWidth: 5,
      borderLeftColor: '#F59E0B',
  },
  detailTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#1F2937',
  },
  detailRow: {
      flexDirection: 'row',
      marginBottom: 8,
  },
  detailLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: '#4B5563',
      width: 70,
  },
  detailValue: {
      fontSize: 15,
      color: '#1F2937',
      flexShrink: 1,
  },
  detailValueHighlight: {
      fontWeight: '600',
      color: '#EF4444',
  },
  requestButton: {
      backgroundColor: '#3B82F6',
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  requestButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
  },
  // Sell Styles
  sectionHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginTop: 20,
      marginBottom: 10,
  },
  selectableItem: {
      borderLeftWidth: 5,
      borderLeftColor: '#E5E7EB',
  },
  selectedItem: {
      borderLeftColor: '#10B981',
      backgroundColor: '#D1FAE5',
  },
  noteInput: {
      minHeight: 80,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      textAlignVertical: 'top',
  },
  confirmButton: {
      backgroundColor: '#B09160',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 30,
      alignItems: 'center',
  },
  confirmButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
  },
  requestItem: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
  },
  viewRequestButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewRequestButtonText: {
    color: '#fff',
    fontWeight: '600',
  }
});