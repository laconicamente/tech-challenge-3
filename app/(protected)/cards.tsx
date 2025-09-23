import NoCardSvg from '@/assets/images/no-cards.svg';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { BankCardProps } from '@/shared/classes/models/bank-card';
import { BankCardCreateDrawer } from '@/shared/components/BankCard/BankCardCreateDrawer';
import BankCardDetails from '@/shared/components/BankCard/BankCardDetails';
import BankCardItem from '@/shared/components/BankCard/BankCardItem';
import TransactionHeader from '@/shared/components/Transaction/TransactionHeader';
import { useBankCards } from '@/shared/hooks/useBankCards';
import { SkeletonCard } from '@/shared/ui/Skeleton/SkeletonCard';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CardsScreen = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const { bankCards, isLoading, updateBankCard, deleteBankCard, refetch } = useBankCards();

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken<BankCardProps>> }) => {
    if (viewableItems.length > 0) {
      setActiveCardIndex(viewableItems[0].index ?? 0);
    }
  }, [bankCards]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderCardItem = ({ item }: { item: BankCardProps }) => (
    <View style={styles.cardWrapper}>
      <BankCardItem card={item} />
    </View>
  );

  const EmptyFeedback = () => (<View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <NoCardSvg width={220} height={220} />
    <Text style={{ textAlign: 'center', fontSize: 16, color: '#666', marginTop: 10 }}>
      Não encontramos nenhum cartão, que tal criar um novo?
    </Text>
  </View>
  );

  const BankCardSkeleton = () => (
    <View style={styles.cardWrapper}>
      <SkeletonCard style={styles.cardSkeleton} />
    </View>
  );

  const handleActionCard = (id: string, data: Partial<BankCardProps>) => {
    updateBankCard(id, data);
  };
  const handleDeleteCard = (id: string) => {
    deleteBankCard(id);
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <TransactionHeader title='Meus cartões' hasAction={true} iconAction='add-card' onActionPress={() => setVisible(true)} />,
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <FlatList
          data={bankCards}
          renderItem={renderCardItem}
          keyExtractor={(item) => item.id ?? item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={isLoading ? <BankCardSkeleton /> : <EmptyFeedback />}
          style={styles.cardList}
        />

        <View style={styles.pagination}>
          {bankCards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeCardIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
        <BankCardDetails isLoading={isLoading} card={bankCards[activeCardIndex]} onActionPress={handleActionCard} onDelete={handleDeleteCard} />
        <BankCardCreateDrawer visible={visible} onDismiss={(hasUpdated) => {
          setVisible(false);
          if (hasUpdated) refetch();
        }} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  cardList: {
    display: 'flex',
    height: 200,
  },
  cardWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSkeleton: {
    width: '90%',
    height: 200,
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: ColorsPalette.light['grey.400'],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
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
    width: 14,
  },
});

export default CardsScreen;