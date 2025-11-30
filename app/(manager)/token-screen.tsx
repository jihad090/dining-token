import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function TokenScreen() {
  const [selected, setSelected] = useState<'dinner' | 'lunch'>('dinner');

  const renderTokenContent = () => {
    if (selected === 'dinner') {
      return (
        <View style={styles.qrContainer}>
          <ThemedText type="subtitle" style={{ color: "black", fontSize: 25, top: -20 }}>Todays Available Token</ThemedText>
          <Image
            source={require('../../assets/images/qrcode.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={{
            padding: 5, paddingHorizontal: 30, fontSize: 20, backgroundColor: "#D6F4ED", margin: 10, borderRadius: 12, fontWeight: 600
          }}>
            Token ID: 2104090-D-123456</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.qrContainer}>
          <ThemedText type="subtitle" style={{ color: "black", fontSize: 25, top: -20 }}>Todays Available Token</ThemedText>
          <Image
            source={require('../../assets/images/qrcodeL.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={{
            padding: 5, paddingHorizontal: 30, fontSize: 20, backgroundColor: "#D6F4ED", margin: 10, borderRadius: 12, fontWeight: 600
          }}>
            Token ID: 2104090-D-921212</Text>
        </View>
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.hallName}>Muktijoddha Hall</ThemedText>
      {renderTokenContent()}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, selected === 'dinner' && styles.selectorButtonActive]}
          onPress={() => setSelected('dinner')}
        >
          <Text style={[styles.selectorText, selected === 'dinner' && styles.selectorTextActive]}>
            Dinner Token
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.selectorButton, selected === 'lunch' && styles.selectorButtonActive]}
          onPress={() => setSelected('lunch')}
        >
          <Text style={[styles.selectorText, selected === 'lunch' && styles.selectorTextActive]}>
            Lunch Token
          </Text>
        </TouchableOpacity>
      </View>


    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
  },
  hallName: {
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 50,
    color: "black"
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#b09160',
  },
  selectorText: {
    fontSize: 16,
    color: '#555',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -50
  },
  qrImage: {
    width: 300,
    height: 300,
    backgroundColor: '#eaf0fc',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: '#e0e0e0',
  },
});
