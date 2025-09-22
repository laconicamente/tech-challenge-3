import NoDataSvg from '@/assets/images/no-data.svg';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { TransactionItemProps } from '@/shared/classes/models/transaction';
import { BalanceResume } from '@/shared/components/Balance/BalanceResume';
import { TransactionFilterDrawer } from '@/shared/components/Transaction/TransactionFilterDrawer';
import TransactionHeader from '@/shared/components/Transaction/TransactionHeader';
import { TransactionItem } from '@/shared/components/Transaction/TransactionItem';
import { TransactionSkeleton } from '@/shared/components/Transaction/TransactionSkeleton';
import { useFinancial } from '@/shared/contexts/financial/FinancialContext';
import { BytebankButton } from '@/shared/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const [showHeader, setShowHeader] = useState(true);
  const opacity = useSharedValue(1);
  const height = useSharedValue(115);
  const contentTopRadius = useSharedValue(32);
  const contentMarginTop = useSharedValue(0);

  const { transactions, isLoading, isLoadingMore, loadMore, setFilters, hasMore } = useFinancial();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

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

  const renderItem = ({ item }: { item: TransactionItemProps }) => (
    <TransactionItem transaction={item} />
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
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

  const fetchMoreTransactions = async () => { loadMore?.(); }

  const renderEmptyFeedback = () => (<View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <NoDataSvg width={220} height={220} />
    <Text style={{ textAlign: 'center', fontSize: 16, color: '#666', marginTop: 10 }}>
      Não encontramos nenhuma transação, que tal criar uma nova?
    </Text>
  </View>
  );

  const ListHeader = () => (
    <View style={styles.subHeader}>
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
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <TransactionHeader showSearch={false} />,
          headerShown: true,
        }}
      />
      <SafeAreaView style={[styles.container, { paddingTop: 0 }]} edges={['left', 'right', 'bottom']}>
        <Animated.View style={[styles.balanceResumeHeader, animatedBalanceResumeStyle]}>
          <BalanceResume showMinified={true} />
        </Animated.View>
        <Animated.View style={[styles.contentWrapper, animatedContentStyle]}>
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id || ''}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={<ListHeader />}
            ListEmptyComponent={isLoading ? <TransactionSkeleton numberOfItems={6} /> : renderEmptyFeedback()}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onEndReached={fetchMoreTransactions}
            onEndReachedThreshold={0.6}
            ListFooterComponent={hasMore && isLoadingMore ? <TransactionSkeleton numberOfItems={2} /> : null}
          />
        </Animated.View>
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
    backgroundColor: '#d4eb61',
    paddingHorizontal: 15,
    paddingBottom: 0,
    zIndex: 2,
  },
  contentWrapper: {
    backgroundColor: '#FFF',
    width: '100%',
    minHeight: '100%',
    zIndex: 1,
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