import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const BankCardItem = ({ card }) => {
  return (
    <View style={[styles.cardContainer, { backgroundColor: card.cardColor }]}>
      <Text style={styles.cardNumber}>•••• •••• •••• {card.number}</Text>
      <Text style={styles.cardDetails}>{card.balance}</Text>
      <Text style={styles.cardDetails}>{card.valid}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDetails: {
    color: '#555',
  },
});

export default BankCardItem;