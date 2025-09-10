import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { CardBalance } from '@/shared/components/CardBalance';
import FinancialResume from '@/shared/components/FinancialResume';
import AnalyticsCard from '@/shared/components/CardAnalysis';
import CardCategory from '@/shared/components/CardCategory';
import React from 'react';

const categories = [
  {
    id: '1',
    name: 'Bills',
    icon: 'file-text', 
    itemsCount: 12,
    totalAmount: 620.00,
  },
  {
    id: '2',
    name: 'Food',
    icon: 'coffee',
    itemsCount: 15,
    totalAmount: 320.00,
  },
  {
    id: '3',
    name: 'Entertainment',
    icon: 'tv',
    itemsCount: 20,
    totalAmount: 450.00,
  },
  {
    id: '4',
    name: 'Health',
    icon: 'heart',
    itemsCount: 8,
    totalAmount: 180.00,
  },
];

const CategoryListScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CardCategory category={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} // Duas colunas por linha
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};
export default function Dashboard() {

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
    >

      <View style={{ flex: 1, justifyContent: 'flex-start', padding: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: '500' }}>{'Olá, Joana!'}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }} >Gerencie suas finanças de forma eficiente.</Text>
        <CardBalance />
        <FinancialResume />
        <AnalyticsCard />
        {CategoryListScreen()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  flatListContent: {
    display: 'flex',
    gap: 15
  },
});
