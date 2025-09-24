import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { CategoryWidgetItem } from '@/shared/classes/models/category';
import { formatCurrency } from '@/shared/helpers/formatCurrency';
import { useWidgetSpendingByCategory } from '@/shared/hooks/widgets/useSpendingData';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import SpendingCategoryItem from './SpendingCategoryItem';

const AnimatedCategoryItem = Animated.createAnimatedComponent(SpendingCategoryItem);

const AnimatedCardItem = ({ item, delay }: { item: CategoryWidgetItem; delay: number }) => {
    const sv = useSharedValue(0);
    useEffect(() => {
        sv.value = withTiming(1, { duration: 500, }, () => { });
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [
            { scale: sv.value },
            { translateY: 50 - sv.value * 50 },
        ],
        opacity: sv.value,
    }));
    return <AnimatedCategoryItem data={item} style={style} />;
};

const WidgetSpendingByCategory = () => {
    const { widgetData, isLoading, error } = useWidgetSpendingByCategory();

    const totalSpending = () => formatCurrency(widgetData.reduce((acc, item) => acc + item.value, 0));
    const LoadingSkeleton = () => (
        <View style={{ gap: 12, flexDirection: 'row' }}>
            <SkeletonText style={{ width: 120, height: 180, marginRight: 10 }} />
            <SkeletonText style={{ width: 120, height: 180, marginRight: 10 }} />
            <SkeletonText style={{ width: 120, height: 180, marginRight: 10 }} />
        </View>
    );

    if (error) {
        return (
            <View style={{ gap: 12, paddingVertical: 25 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Gastos por categoria</Text>
                <Text>Erro ao carregar.</Text>
            </View>
        );
    }

    return (
        <View style={{ gap: 25, paddingTop: 5 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Gastos por categoria</Text>
            <FlatList
                data={widgetData}
                renderItem={({ item, index }) => (
                    <AnimatedCardItem item={item} delay={index * 90} />
                )}
                ListEmptyComponent={isLoading ? <LoadingSkeleton /> : <Text style={{ textAlign: 'center' }}>Nenhum dado disponível.</Text>}
                keyExtractor={(item, i) => i.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            {isLoading ? (<SkeletonText style={{ width: '100%', height: 60, marginRight: 10 }} />) :
                (<View style={{ width: '100%', backgroundColor: ColorsPalette.light['grey.900'], padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 20, marginTop: -25, gap: 20 }}>
                    <View style={{ width: '50%', borderRightColor: '#666', borderRightWidth: 1, justifyContent: 'space-between', gap: 10, alignItems: 'center', }}>
                        <Text style={{ fontSize: 14, color: '#ddd', textAlign: 'center' }}>Total de gastos</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>{totalSpending()}</Text>
                    </View>
                    <View style={{ width: '48%', justifyContent: 'space-between', gap: 10, alignItems: 'center', paddingRight: 10 }}>
                        <Text style={{ fontSize: 14, color: '#ddd', textAlign: 'center' }}>Você gastou mais em</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>{widgetData[0]?.name || 'Sem categoria'}</Text>
                    </View>
                </View>)}
        </View>
    );
};

export default WidgetSpendingByCategory;