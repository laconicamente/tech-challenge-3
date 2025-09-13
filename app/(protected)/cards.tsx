import BankCardItem from '@/shared/components/BankCardItem';
import BankCardDetails from '@/shared/components/BankCardDetails';
import TransactionHeader from '@/shared/components/TransactionHeader';
import { Stack } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';

const { width } = Dimensions.get('window');

const cardsData = [
  {
    id: '1',
    number: '3098',
    holder: 'Simon StClaire',
    valid: '12/26',
    balance: '$142,560.00',
    type: 'VISA',
    cardColor: '#D0DD92',
    transactions: [
      { id: 't1', amount: '$ 2,130.00', merchant: ['Whole Foods', 'Burger King'] },
      { id: 't2', amount: '$ 180.50', text: 'Cashback earned', merchant: ['Netflix', 'HBO Max'] },
    ],
    actions: { canBlock: true, canSetPrimary: true, canDelete: true },
  },
  {
    id: '2',
    number: '4567',
    holder: 'Maria Gomes',
    valid: '05/25',
    balance: '$50,000.00',
    type: 'MasterCard',
    cardColor: '#A8D8B9',
    transactions: [
      { id: 't4', amount: '$ 500.00', merchant: ['Amazon'] },
      { id: 't5', amount: '50', text: 'Cashback earned', merchant: ['Spotify'] },
    ],
    actions: { canBlock: false, canSetPrimary: true, canDelete: true },
  },
];

const Cards = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveCardIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderCardItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <BankCardItem card={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <TransactionHeader title='Meus cartões' />,
          headerShown: true,
        }}
      />
      <FlatList
        data={cardsData}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.cardList}
      />
      
      {/* Indicadores de página */}
      <View style={styles.pagination}>
        {cardsData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeCardIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>

      {/* Detalhes e ações do cartão ativo */}
      <BankCardDetails card={cardsData[activeCardIndex]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardList: {
    height: 0,
  },
  cardWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
});

export default Cards;