import { ColorsPalette } from '@/constants/Pallete';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ColorValue } from 'react-native';
import { BankCardProps } from '../classes/bank-card';
import { maskCardNumber } from '../hooks/maskCardNumber';

const BankCardItem = ({ card }: { card: Partial<BankCardProps> }) => {
  const { number, type = 'Platinum', color } = card as { number?: string; type?: keyof typeof cardColors; color?: string };
  const cardColors = {
    'Platinum': {
      backgroundColor: [ColorsPalette.light["lime.500"], ColorsPalette.light["lime.400"]],
      color: ColorsPalette.light["lime.900"]
    },
    'Gold': {
      backgroundColor: [ColorsPalette.light["lime.200"], ColorsPalette.light["lime.300"]],
      color: ColorsPalette.light["lime.900"]
    },
    'Black': {
      backgroundColor: [ColorsPalette.light["lime.900"], ColorsPalette.light["grey.800"]],
      color: ColorsPalette.light["lime.50"]
    },
  }
  return (
    <LinearGradient
      colors={color ? [color as ColorValue, '#fff' as ColorValue] : (cardColors[type]?.backgroundColor || cardColors['Platinum'].backgroundColor) as [ColorValue, ColorValue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <Image
        source={require('../../assets/images/pixels.png')}
        style={styles.cardBackgroundImage}
        resizeMode="contain"
      />
      <View style={styles.cardTitleContainer}>
        <Text style={[styles.cardTitle, { color: cardColors[type]?.color }]}>Byte</Text>
        <Text style={[styles.cardType, { color: cardColors[type]?.color }]}>{type}</Text>
      </View>
      <Text style={[styles.cardNumber, { color: cardColors[type]?.color }]}>{maskCardNumber(number ?? '')}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardBackgroundImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 200,
    height: 200,
    opacity: 0.6,
  },
  cardTitleContainer: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    width: 55,
    flexWrap: 'wrap',
    fontStyle: 'italic',
  },
  cardType: {
    fontWeight: 'light',
    fontSize: 18,
    fontStyle: 'normal',
    letterSpacing: 1.5
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