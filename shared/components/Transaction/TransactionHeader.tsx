import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ColorsPalette } from '@/constants/Pallete';

const TransactionHeader = ({ title = '' }) => {

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => router.replace('/(protected)/dashboard')} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={ColorsPalette.light["lime.900"]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={24} color={ColorsPalette.light["lime.900"]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#d4eb61',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
});

export default TransactionHeader;