import { formatCurrency } from '@/shared/helpers/formatCurrency';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WidgetCategoryProps {
  value: number;
  name: string;
  color?: string;
}

const SpendingCategoryItem = ({ data, style = {}, ref }: { data: WidgetCategoryProps; style?: object; ref?: React.Ref<any> }) => {
  return (
    <View ref={ref} style={[styles.card, { backgroundColor: data.color }, style]}>
      <Text style={styles.value}>{formatCurrency(data.value)}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{data.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    marginRight: 10,
    marginBottom: 20,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  events: {
    fontSize: 12,
  },
});

export default SpendingCategoryItem;