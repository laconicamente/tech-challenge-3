import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { CategoryWidgetItem } from '@/shared/classes/models/category';
import { formatCurrency } from '@/shared/helpers/formatCurrency';
import { useBiggestEntriesData } from '@/shared/hooks/widgets/useBiggestEntriesData';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

const WidgetBiggestEntries = () => {
    const { widgetData, isLoading } = useBiggestEntriesData();

    const LoadingSkeleton = () => (<>
        <SkeletonText style={{ width: '100%', height: 50 }} />
        <SkeletonText style={{ width: '100%', height: 50 }} />
        <SkeletonText style={{ width: '100%', height: 50 }} />
    </>
    );

    const EntryItem = (data: CategoryWidgetItem) => (
        <View key={data.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingVertical: 15, borderBottomColor: '#eee', borderBottomWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ backgroundColor: ColorsPalette.light['lime.800'], padding: 10, borderRadius: 10 }}>
                    <MaterialIcons name={(data.icon as keyof typeof MaterialIcons.glyphMap) || 'category'} size={24} color={ColorsPalette.light['lime.100']} />
                </View>
                <Text style={{ fontSize: 16, justifyContent: 'flex-start', }}>{data.name}</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: ColorsPalette.light['lime.800'] }}>{formatCurrency(data.value)}</Text>
        </View>
    )
    return (
        <View style={{ paddingTop: 5, marginBottom: 20, }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Ranking de entradas</Text>
            {isLoading ? (<LoadingSkeleton />) :
                (widgetData && widgetData.length > 0 ? (widgetData.map(data => (<EntryItem {...data} key={data.id} />))) : null)}

            <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: ColorsPalette.light['lime.100'], padding: 20, borderRadius: 15 }}>
                <Text style={{ fontSize: 16, color: ColorsPalette.light['lime.800'] }}>Sua maior receita foi na categoria </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: ColorsPalette.light['lime.800'] }}>{widgetData && widgetData.length > 0 ? widgetData[0].name : 'N/A'}</Text>
            </View>
        </View>
    );
};

export default WidgetBiggestEntries;