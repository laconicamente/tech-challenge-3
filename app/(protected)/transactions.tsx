import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import TransactionHeader from '@/shared/components/Transaction/TransactionHeader';
import { BalanceResume } from '@/shared/components/Balance/BalanceResume';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { BytebankButton } from '@/shared/ui/Button';
import { TransactionItem } from '@/shared/components/Transaction/TransactionItem';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { TransactionItemProps } from '@/shared/classes/models/transaction';
import { TransactionSkeleton } from '@/shared/components/Transaction/TransactionSkeleton';

// Dados de exemplo para as transações
const INITIAL_TRANSACTIONS: TransactionItemProps[] = [
  {
    id: '1',
   title: 'Pagamento recebido',
    description: 'Transferência de Maria P.',
    value: '+ R$ 50,00',
   createdAt: '10 de Setembro',
    type: 'income',
  },
  {
    id: '2',
   title: 'Spotify',
    description: 'Pagamento de assinatura',
    value: '- R$ 21,90',
   createdAt: '08 de Setembro',
    type: 'expense',
  },
  {
    id: '3',
   title: 'Supermercado',
    description: 'Compra no Carrefour',
    value: '- R$ 150,50',
   createdAt: '07 de Setembro',
    type: 'expense',
  },
  {
    id: '4',
   title: 'Pix recebido',
    description: 'Transferência de João S.',
    value: '+ R$ 200,00',
   createdAt: '05 de Setembro',
    type: 'income',
  },
  {
    id: '5',
   title: 'Uber',
    description: 'Corrida para casa',
    value: '- R$ 35,00',
   createdAt: '04 de Setembro',
    type: 'expense',
  },
  {
    id: '6',
   title: 'Pagamento recebido',
    description: 'Transferência de Maria P.',
    value: '+ R$ 50,00',
   createdAt: '10 de Setembro',
    type: 'income',
  },
  {
    id: '7',
   title: 'Spotify',
    description: 'Pagamento de assinatura',
    value: '- R$ 21,90',
   createdAt: '08 de Setembro',
    type: 'expense',
  },
  {
    id: '8',
   title: 'Supermercado',
    description: 'Compra no Carrefour',
    value: '- R$ 150,50',
   createdAt: '07 de Setembro',
    type: 'expense',
  },
  {
    id: '9',
   title: 'Pix recebido',
    description: 'Transferência de João S.',
    value: '+ R$ 200,00',
   createdAt: '05 de Setembro',
    type: 'income',
  },
  {
    id: '10',
   title: 'Uber',
    description: 'Corrida para casa',
    value: '- R$ 35,00',
   createdAt: '04 de Setembro',
    type: 'expense',
  },
];


export default function TransactionsScreen() {
  const [showHeader, setShowHeader] = useState(true);
  const opacity = useSharedValue(1);
  const height = useSharedValue(115);
  const contentTopRadius = useSharedValue(32);
  const contentMarginTop = useSharedValue(0);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [loading, setLoading] = useState(false);

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

  const renderItem = ({ item }: {item : TransactionItemProps}) => (
    <TransactionItem
     transaction={item}
    />
  );

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const shouldShowHeader = y < 40;

    if (shouldShowHeader !== showHeader) {
      setShowHeader(shouldShowHeader);
      opacity.value = shouldShowHeader ? 1 : 0;
      height.value = shouldShowHeader ? 115 : 0;
      contentTopRadius.value = shouldShowHeader ? 32 : 0;
      contentMarginTop.value = shouldShowHeader ? 0 : 0;
    }
  };

  const fetchMoreTransactions = async () => {
    if (loading) return;
    setLoading(true);
  
    // Simule uma requisição (troque por sua API)
    setTimeout(() => {
      const newTransactions: TransactionItemProps[] = [
        // ...novos dados, mesmo formato do seu array
        {
          id: String(transactions.length + 1),
          title: 'Nova transação',
          description: 'Descrição extra',
          value: '+ R$ 10,00',
          createdAt: 'Hoje',
          type: 'income',
        },
        // Adicione mais se quiser
      ];
      setTransactions([...transactions, ...newTransactions]);
      setLoading(false);
    }, 1500);
  }

  const ListHeader = () => (
    <View style={styles.subHeader}>
      <Text style={styles.subHeaderTitle}>Movimentações</Text>
      <View>
        <BytebankButton color={'primary'} styles={styles.filterButton}>
          <View>
            <Text style={styles.filterText}>Filtros</Text>
          </View>
          <View>
            <Ionicons name="filter" size={20} color={ColorsPalette.light["lime.900"]} />
          </View>
        </BytebankButton>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <TransactionHeader showSearch={true} />,
          headerShown: true,
          presentation: 'transparentModal'
        }}
      />
      <Animated.View style={[styles.balanceResumeHeader, animatedBalanceResumeStyle]}>
        <BalanceResume showMinified={true} />
      </Animated.View>
      <Animated.View style={[styles.contentWrapper, animatedContentStyle]}>
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<ListHeader />}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={0}
          onEndReached={fetchMoreTransactions}
          onEndReachedThreshold={0.6}
          ListFooterComponent={loading ? <TransactionSkeleton /> : null}
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
  filterText: {
    fontSize: 16,
    color: ColorsPalette.light["lime.900"],
    marginRight: 6
  },
  filterButton: {
    backgroundColor: '#f1f8d5',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 0,
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