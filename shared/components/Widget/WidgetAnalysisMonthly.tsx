import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { formatCurrency } from '@/shared/helpers/formatCurrency';
import { useAnalysisMonthlyData } from '@/shared/hooks/widgets/useAnalysisMonthlyData';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card } from 'react-native-paper';

const COLORS = {
  incomeMain: ColorsPalette.light['lime.400'],
  expenseMain: ColorsPalette.light['lime.800'],
  bgInnerCircle: ColorsPalette.light['lime.900'],
};

const WidgetAnalysisMonthly = () => {
  const { widgetData, isLoading } = useAnalysisMonthlyData();
  const chartData = useMemo(
    () => [
      { value: widgetData?.monthIncome || 0, color: COLORS.incomeMain },
      { value: widgetData?.monthExpense || 0, color: COLORS.expenseMain },
    ],
    [widgetData]
  );

  const key = useMemo(() => `pie-${widgetData?.monthIncome}-${widgetData?.monthExpense}-${Date.now()}`, [widgetData]);

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Análise mensal</Text>
      </View>

      {!widgetData ? <Text style={{ textAlign: 'center', color: '#aaa' }}>Nenhum dado disponível</Text> :
        <View style={styles.dualRingsWrapper}>
          <View style={styles.chartStack}>
            <PieChart
              key={key}
              data={chartData}
              donut
              radius={120}
              innerRadius={80}
              animationDuration={900}
              isAnimated
              showText={false}
              innerCircleColor={COLORS.bgInnerCircle}
            />

            <View style={styles.centerLabel} pointerEvents="none">
              <Text style={styles.centerTotal}>{formatCurrency(widgetData?.differenceValue || 0)}</Text>
              <Text style={styles.centerSub}>
                {widgetData?.differenceValue >= 0 ? 'Saldo' : 'Saldo negativo'}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <LegendItem
              color={COLORS.incomeMain}
              label="Entradas"
              value={formatCurrency(widgetData?.monthIncome || 0)}
              percent={((widgetData?.monthIncome / widgetData?.totalValue) * 100) || 0}
            />
            <LegendItem
              color={COLORS.expenseMain}
              label="Saídas"
              value={formatCurrency(widgetData?.monthExpense || 0)}
              percent={((widgetData?.monthExpense / widgetData?.totalValue) * 100) || 0}
            />
          </View>
        </View>
      }
    </Card>
  );
};

const LegendItem = ({ color, label, value, percent }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <View style={{ flex: 1 }}>
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
      <Text style={styles.legendPercent}>{percent.toFixed(1)}%</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: ColorsPalette.light['lime.900'],
    marginTop: 0,
    marginBottom: 30,
  },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  dualRingsWrapper: { flexDirection: 'column' },
  chartStack: { width: '100%', justifyContent: 'center', alignItems: 'center' },
  centerLabel: { position: 'absolute', alignItems: 'center' },
  centerTotal: { fontSize: 18, fontWeight: '700', color: '#fff' },
  centerSub: { fontSize: 11, color: '#aaa', marginTop: 2 },
  statsContainer: {
    marginTop: 18,
    gap: 12,
    width: '100%',
    flexDirection: 'row',
  },
  legendItem: { width: '50%', flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  legendLabel: { fontSize: 13, color: '#bbb', fontWeight: '500' },
  legendValue: { fontSize: 15, fontWeight: '600', color: '#fff' },
  legendPercent: { fontSize: 11, color: '#888', marginTop: 2 }
});

export default WidgetAnalysisMonthly;