import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons'; // Importe os ícones

const { width } = Dimensions.get('window');

const CardCategory = ({ category }) => {
  return (
    <TouchableOpacity style={styles.cardWrapper}>
      <Card style={styles.cardContainer}>
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <Feather name={category.icon} size={24} color="#000" />
          </View>
          <Text style={styles.itemsCount}>{category.itemsCount} Items</Text>
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.totalAmount}>${category.totalAmount.toFixed(2)}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: (width / 2) - 20,
  },
  cardContainer: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0', // Fundo cinza claro para o círculo do ícone
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsCount: {
    fontSize: 14,
    color: '#888',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default CardCategory;