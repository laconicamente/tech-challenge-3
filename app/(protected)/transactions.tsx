import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import TransactionHeader from '@/shared/components/TransactionHeader';
import { BalanceResume } from '@/shared/components/BalanceResume';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { BytebankButton } from '@/shared/ui/Button';
import { TransactionItem } from '@/shared/components/TransactionItem';

// Dados de exemplo para as transações
const transacoes = [
  {
    id: '1',
    titulo: 'Pagamento recebido',
    descricao: 'Transferência de Maria P.',
    valor: '+ R$ 50,00',
    data: '10 de Setembro',
    tipo: 'entrada',
  },
  {
    id: '2',
    titulo: 'Spotify',
    descricao: 'Pagamento de assinatura',
    valor: '- R$ 21,90',
    data: '08 de Setembro',
    tipo: 'saida',
  },
  {
    id: '3',
    titulo: 'Supermercado',
    descricao: 'Compra no Carrefour',
    valor: '- R$ 150,50',
    data: '07 de Setembro',
    tipo: 'saida',
  },
  {
    id: '4',
    titulo: 'Pix recebido',
    descricao: 'Transferência de João S.',
    valor: '+ R$ 200,00',
    data: '05 de Setembro',
    tipo: 'entrada',
  },
  {
    id: '5',
    titulo: 'Uber',
    descricao: 'Corrida para casa',
    valor: '- R$ 35,00',
    data: '04 de Setembro',
    tipo: 'saida',
  },
  {
    id: '6',
    titulo: 'Pagamento recebido',
    descricao: 'Transferência de Maria P.',
    valor: '+ R$ 50,00',
    data: '10 de Setembro',
    tipo: 'entrada',
  },
  {
    id: '7',
    titulo: 'Spotify',
    descricao: 'Pagamento de assinatura',
    valor: '- R$ 21,90',
    data: '08 de Setembro',
    tipo: 'saida',
  },
  {
    id: '8',
    titulo: 'Supermercado',
    descricao: 'Compra no Carrefour',
    valor: '- R$ 150,50',
    data: '07 de Setembro',
    tipo: 'saida',
  },
  {
    id: '9',
    titulo: 'Pix recebido',
    descricao: 'Transferência de João S.',
    valor: '+ R$ 200,00',
    data: '05 de Setembro',
    tipo: 'entrada',
  },
  {
    id: '10',
    titulo: 'Uber',
    descricao: 'Corrida para casa',
    valor: '- R$ 35,00',
    data: '04 de Setembro',
    tipo: 'saida',
  },
];


export default function TransactionsList() {
  const [showHeader, setShowHeader] = useState(true);
  const opacity = useSharedValue(1);
  const height = useSharedValue(115);
  const contentTopRadius = useSharedValue(32);
  const contentMarginTop = useSharedValue(20);

  const animatedBalanceResumeStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 300 }),
      height: withTiming(height.value, { duration: 300 }),
      overflow: 'hidden',
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: contentTopRadius.value,
      borderTopRightRadius: contentTopRadius.value,
      marginTop: contentMarginTop.value,
    };
  });

  const renderItem = ({ item }) => (
    <TransactionItem
      titulo={item.titulo}
      descricao={item.descricao}
      valor={item.valor}
      data={item.data}
      tipo={item.tipo}
    />
  );

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const shouldShowHeader = y < 40;

    if (shouldShowHeader !== showHeader) {
      setShowHeader(shouldShowHeader);
      opacity.value = shouldShowHeader ? 1 : 0;
      height.value = shouldShowHeader ? 115 : 0;
      contentTopRadius.value = shouldShowHeader ? 32 : 0;
      contentMarginTop.value = shouldShowHeader ? 20 : 0;
    }
  };

  const ListHeader = () => (
    <View style={styles.subHeader}>
      <Text style={styles.subHeaderTitle}>Movimentações</Text>
      <View style={styles.filter}>
        <BytebankButton color={'primary'} styles={styles.filterButton}>
        <Text style={styles.filterText}>Filtro</Text>
        <Ionicons name="filter" size={20} color="#000" />
        </BytebankButton>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <TransactionHeader />,
          headerShown: true,
        }}
      />
      <Animated.View style={[styles.balanceResumeHeader, animatedBalanceResumeStyle]}>
        <BalanceResume showMinified={true} />
      </Animated.View>
      <Animated.View style={[styles.contentWrapper, animatedContentStyle]}>
        <FlatList
          data={transacoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<ListHeader />}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4eb61',
  },
  balanceResumeHeader: {
    backgroundColor: '#d4eb61',
    padding: 15,
    paddingBottom: 0,
    zIndex: 2,
  },
  contentWrapper: {
    backgroundColor: '#FFF',
    width: '100%',
    minHeight: 600,
    zIndex: 1,
    paddingBottom: 32,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 16,
    marginRight: 8,
    color: '#555',
  },
  filterButton: {
    backgroundColor: '#f1f8d5', 
    padding: 5 
  },
  listContainer: {
    paddingHorizontal: 0,
    marginTop: 20
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemIconContainer: {
    marginRight: 12,
  },
  itemDetalhes: {
    flex: 1,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescricao: {
    fontSize: 14,
    color: '#888',
  },
  itemValorContainer: {
    alignItems: 'flex-end',
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemData: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});