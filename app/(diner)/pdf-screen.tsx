import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function PdfScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.hallName}>Muktijoddha Hall</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>All Token PDF</ThemedText>

      <View style={styles.pdfContainer}>
        {/* Placeholder for PDF preview image */}
        <Image
          source={require('../../assets/images/tokenListImage.png')}
          style={styles.pdfPreview}
          resizeMode="cover"
        />
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={() => {/* handle download logic */}}>
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
    justifyContent: 'flex-start',
  },
  hallName: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 8,
    color: 'black',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },
  pdfContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfPreview: {
    width: '100%',
    height: 500,
    backgroundColor: '#eaf0fc',
    marginBottom: 24,
  },
  downloadButton: {
    height: 48,
    backgroundColor: '#b09160',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
