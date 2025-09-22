import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/AntDesign";

const TransactionHeader = ({ title = '', showSearch = false }) => {
  const { user } = useAuth();
  return (
    <SafeAreaView style={styles.headerContainer} edges={['top']}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.leftIcon}>
          <View style={styles.avatarCircle}>
            {user && user.photoURL ? <Image source={{ uri: user.photoURL }} style={{ width: 50, height: 50, borderRadius: 25 }} /> : <MaterialIcons name="user" size={25} color={ColorsPalette.light['lime.800']} />}
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
        </View>
        {showSearch ? (
          <TouchableOpacity style={styles.rightIcon}>
            <Ionicons name="search" size={24} color={ColorsPalette.light["lime.900"]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightIcon} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#d4eb61',
    minHeight: 'auto',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  leftIcon: {
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  avatarCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorsPalette.light['lime.50'],
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightIcon: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 8,
  },
});

export default TransactionHeader;