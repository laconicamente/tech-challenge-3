import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import MaterialIcons from "react-native-vector-icons/AntDesign";

const TransactionHeader = ({ title = '', showSearch = false }) => {

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* <TouchableOpacity onPress={() => router.replace('/(protected)/dashboard')} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={ColorsPalette.light["lime.900"]} />
        </TouchableOpacity> */}
        <TouchableOpacity>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: ColorsPalette.light['lime.50'], borderRadius: 25, width: 50, height: 50 }}>
            <MaterialIcons name="user" size={25} color={ColorsPalette.light['lime.800']} />
          </View>
        </TouchableOpacity>
        {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
        {showSearch ? (<TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={24} color={ColorsPalette.light["lime.900"]} />
        </TouchableOpacity>) : null}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    width: '90%',
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  iconButton: {
    padding: 8,
    textAlign: 'right'
  },
});

export default TransactionHeader;