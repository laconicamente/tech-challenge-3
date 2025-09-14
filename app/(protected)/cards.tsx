import BankCardItem from '@/shared/components/BankCardItem';
import BankCardDetails from '@/shared/components/BankCardDetails';
import TransactionHeader from '@/shared/components/TransactionHeader';
import { Stack } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { ColorsPalette } from '@/constants/Pallete';

const { width } = Dimensions.get('window');

const cardsData = [
  {
    id: '1',
    number: '3098',
    name: 'Simon StClaire',
    expireDate: '12/26',
    type: 'Platinum',
    cvv: '321',
  },
  {
    id: '2',
    number: '4567',
    name: 'Maria Gomes',
    expireDate: '05/25',
    balance: '$50,000.00',
    type: 'Black',
    cvv: '123',
  },
  {
    id: '3',
    number: '3098',
    name: 'Simon StClaire',
    expireDate: '12/26',
    type: 'Gold',
    cvv: '321',
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
      <BankCardDetails card={cardsData[activeCardIndex]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    display: 'flex',
    height: 260,
    marginTop: 15,
  },
  cardWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: ColorsPalette.light['lime.200'],
  },
});

export default Cards;