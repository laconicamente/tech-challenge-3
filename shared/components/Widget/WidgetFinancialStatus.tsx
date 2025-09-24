import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { useFinancial } from '@/shared/contexts/financial/FinancialContext';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import React from 'react';
import { Text, View } from 'react-native';

const WidgetFinancialStatus = () => {
    const { balanceValue, isLoading } = useFinancial();

    const LoadingSkeleton = () => (
        <SkeletonText style={{ width: '100%', height: 80 }} />
    );

    const isBalancePositive = balanceValue >= 0;

    if (balanceValue === 0 && !isLoading) return (<View style={{ paddingTop: 5 }}>
            {isLoading ? (<LoadingSkeleton />) :
                (<View style={{ width: '100%', backgroundColor: ColorsPalette.light['grey.800'], padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ fontSize: 16, color: '#fefefe', textAlign: 'center' }}>Status financeiro</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>NEUTRO</Text>
                </View>)}
        </View>);

    return (
        <View style={{ paddingTop: 5 }}>
            {isLoading ? (<LoadingSkeleton />) :
                (<View style={{ width: '100%', backgroundColor: isBalancePositive ? ColorsPalette.light['lime.800'] : ColorsPalette.light['red.400'], padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ fontSize: 16, color: '#fefefe', textAlign: 'center' }}>Status financeiro</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>{isBalancePositive ? 'POSITIVO' : 'NEGATIVO'}</Text>
                </View>)}
        </View>
    );
};

export default WidgetFinancialStatus;