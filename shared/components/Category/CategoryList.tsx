import { CategoryWidgetItem } from '@/shared/classes/models/category';
import React, { useRef } from 'react';
import { FlatList, Text, View, ViewToken } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import CategoryItem from './CategoryItem';

const categories: CategoryWidgetItem[] = [
    { name: 'Travel', value: 785.00, color: '#e6eaf5' },
    { name: 'Shopping', value: 950.00, color: '#d9f1e1' },
    { name: 'Delivery', value: 50.00, color: '#f5e4d9' },
];

const AnimatedCategoryItem = Animated.createAnimatedComponent(CategoryItem);

const AnimatedCardItem = ({ item, cardScale }: { item: CategoryWidgetItem; cardScale: { value: number } }) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: cardScale.value },
            { translateY: 50 - cardScale.value * 50 },
        ],
        opacity: cardScale.value,
    }));

    return <AnimatedCategoryItem data={item} style={animatedStyle} />;
};

const CategoryList = () => {
    const animatedValues = useRef(categories.map(() => useSharedValue(0))).current;

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: Array<ViewToken<CategoryWidgetItem>> }) => {
            viewableItems.forEach(({ index }) => {
                if (index !== null && animatedValues[index].value === 0) {
                    setTimeout(() => {
                        animatedValues[index].value = withTiming(1, { duration: 500 });
                    }, index * 100);
                }
            });
        }
    ).current;

    const renderItem = ({ item, index }: { item: CategoryWidgetItem; index: number }) => (
        <AnimatedCardItem item={item} cardScale={animatedValues[index]} />
    );

    return (
        <View style={{ gap: 25, paddingTop: 25, paddingBottom: 25 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Gastos por categoria</Text>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToAlignment="start"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />
        </View>
    );
};

export default CategoryList;