import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { CardBalance } from '@/shared/components/CardBalance';
import FinancialResume from '@/shared/components/FinancialResume';
import CardAnalytics from '@/shared/components/CardAnalysis';
import React from 'react';
import { Stack } from 'expo-router';
import { AppHeader } from '@/shared/components/AppHeader';
import CategoryList from '@/shared/components/CategoryList';

export default function Dashboard() {

  return (
    <SafeAreaView style={styles.viewContainer}>
      <Stack.Screen
        options={{
          header: () => <AppHeader />,
          headerShown: true,
        }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >

        <View style={{ flex: 1, justifyContent: 'flex-start', padding: 16 }}>
          <Text style={{ fontSize: 30, fontWeight: '500' }}>{'Olá, Joana!'}</Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }} >Gerencie suas finanças de forma eficiente.</Text>
          <CardBalance />
          <FinancialResume />
          <CardAnalytics />
          <View style={{ minHeight: 220 }}>
            <CategoryList />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  viewContainer: {
    flex: 1,
  },
  flatListContent: {
    display: 'flex',
    gap: 15
  },
});
