import NoDataSvg from '@/assets/images/no-data.svg';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { TransactionItemProps } from '@/shared/classes/models/transaction';
import { BalanceResume } from '@/shared/components/Balance/BalanceResume';
import TransactionCreateDrawer from '@/shared/components/Transaction/TransactionCreateDrawer';
import { TransactionFilterDrawer } from '@/shared/components/Transaction/TransactionFilterDrawer';
import TransactionHeader from '@/shared/components/Transaction/TransactionHeader';
import { TransactionItem } from '@/shared/components/Transaction/TransactionItem';
import { TransactionSkeleton } from '@/shared/components/Transaction/TransactionSkeleton';
import { useFinancial } from '@/shared/contexts/financial/FinancialContext';
import { BytebankButton } from '@/shared/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 115;
const CONTENT_RADIUS = 20;

export default function TransactionsScreen() {
  const scrollY = useSharedValue(0);

  const { transactions, isLoading, isLoadingMore, loadMore, setFilters, deleteTransaction, hasMore } = useFinancial();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [transaction, setTransaction] = useState<TransactionItemProps | null>(null);
  const openSwipeableRef = useRef<Swipeable | null>(null);

  const closeCurrentSwipe = () => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    }
  });

  const animatedBalanceResumeStyle = useAnimatedStyle(() => {
    const y = Math.min(scrollY.value, HEADER_HEIGHT);
    return {
      opacity: interpolate(y, [0, HEADER_HEIGHT * 0.5, HEADER_HEIGHT], [1, 0.4, 0], Extrapolation.CLAMP),
      transform: [{ translateY: -y }],
    };
  });

  const animatedSubHeaderStyle = useAnimatedStyle(() => {
    const y = Math.min(scrollY.value, HEADER_HEIGHT);
    const radius = interpolate(y, [0, HEADER_HEIGHT * 0.6], [CONTENT_RADIUS, 0], Extrapolation.CLAMP);
    return {
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    };
  });

  const fetchMoreTransactions = async () => { loadMore?.(); }
  const handleEdit = (t: TransactionItemProps) => {
    setTransaction(t);
    setIsEditVisible(true);
  };

  const renderEditTransaction = () => (
    <TransactionCreateDrawer visible={isEditVisible} transaction={transaction} onDismiss={() => { setIsEditVisible(false); closeCurrentSwipe(); }} />
  );

  const handleDelete = (t: TransactionItemProps) => {
    Alert.alert('Excluir', 'Deseja excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteTransaction?.(t.id || ''),
      }
    ]);
  };

  const renderRightActions = (item: TransactionItemProps) => (
    <View style={{ flexDirection: 'row', height: '100%' }}>
      <TouchableRipple
        onPress={() => handleEdit(item)}
        style={{ backgroundColor: ColorsPalette.light['grey.50'], justifyContent: 'center', paddingHorizontal: 18 }}
      >
        <Text style={{ color: ColorsPalette.light['grey.900'], fontWeight: '600' }}>Editar</Text>
      </TouchableRipple>
      <TouchableRipple
        onPress={() => handleDelete(item)}
        style={{ backgroundColor: ColorsPalette.light['red.700'], justifyContent: 'center', paddingHorizontal: 18 }}
      >
        <Text style={{ color: '#FFF', fontWeight: '600' }}>Excluir</Text>
      </TouchableRipple>
    </View>
  );

  const renderItem = ({ item }: { item: TransactionItemProps }) => {
    let localRef: Swipeable | null = null;
    return (<Swipeable ref={(ref) => { localRef = ref; }}
      renderRightActions={() => renderRightActions(item)}
      onSwipeableWillOpen={() => {
        if (openSwipeableRef.current && openSwipeableRef.current !== localRef) {
          openSwipeableRef.current.close();
        }
        openSwipeableRef.current = localRef;
      }}
      onSwipeableClose={() => {
        if (openSwipeableRef.current === localRef) openSwipeableRef.current = null;
      }}
    >
      <TransactionItem transaction={item} />
    </Swipeable>
    );
  }

  const EmptyFeedback = () => (<View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, flex: 1 }}>
    <NoDataSvg width={220} height={220} />
    <Text style={{ textAlign: 'center', fontSize: 16, color: '#666', marginTop: 10 }}>
      Não encontramos nenhuma transação, que tal criar uma nova?
    </Text>
  </View>
  );

  const ListHeader = () => (
    <Animated.View style={[styles.subHeader, animatedSubHeaderStyle]}>
      <Text style={styles.subHeaderTitle}>Movimentações</Text>
      <View>
        <BytebankButton color={'primary'} styles={styles.filterButton} onPress={() => setIsFiltersVisible(!isFiltersVisible)}>
          <View>
            <Text style={styles.filterText}>Filtros</Text>
          </View>
          <View>
            <Ionicons name="filter" size={20} color={ColorsPalette.light["lime.900"]} />
          </View>
        </BytebankButton>
      </View>
      {isFiltersVisible && <TransactionFilterDrawer visible={isFiltersVisible} onDismiss={() => setIsFiltersVisible(false)} onApplyFilter={(filters) => setFilters?.(filters)} />}
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <TransactionHeader />,
          headerShown: true,
        }}
      />
      <SafeAreaView style={[styles.container, { paddingTop: 0 }]} edges={['left', 'right', 'bottom']}>
        <Animated.View style={[styles.balanceResumeHeader, animatedBalanceResumeStyle]}>
          <BalanceResume showMinified={true} />
        </Animated.View>
        <Animated.View style={[styles.contentWrapper]}>
          <Animated.FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id || ''}
            contentContainerStyle={[styles.listContainer, { paddingTop: HEADER_HEIGHT }]}
            ListHeaderComponent={<ListHeader />}
            ListEmptyComponent={isLoading ? <TransactionSkeleton numberOfItems={6} /> : <EmptyFeedback />}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            onEndReached={fetchMoreTransactions}
            onEndReachedThreshold={0.6}
            ListFooterComponent={hasMore && isLoadingMore ? <TransactionSkeleton numberOfItems={2} /> : <View style={{ height: 50 }} />}
          />
        </Animated.View>
        <View style={{ position: 'absolute', backgroundColor: '#FFF', zIndex: 0, bottom: 0, width: '100%', height: 300 }} pointerEvents="none" />
        {renderEditTransaction()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4eb61',
  },
  balanceResumeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#d4eb61',
    paddingHorizontal: 15,
    paddingBottom: 0,
    zIndex: 2,
  },
  contentWrapper: {
    width: '100%',
    flex: 1,
    minHeight: 'auto',
    marginBottom: 45,
    zIndex: 1,
  },
  subHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
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
    marginTop: 0,
    zIndex:9
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