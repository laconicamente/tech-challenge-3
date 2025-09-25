import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { TransactionType } from '@/shared/classes/models/transaction';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { formatCurrency } from '@/shared/helpers/formatCurrency';
import { fetchFinancialResume } from '@/shared/services/widgetService';
import { BytebankButton } from '@/shared/ui/Button';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface Point {
  timestamp: number;
  value: number;
}
type RangeKey = '1d' | '7d' | '30d' | '90d' | 'custom';

enum RangeKeyLabel {
  '1d' = 'Hoje',
  '7d' = '7 dias',
  '30d' = '30 dias',
  '90d' = '90 dias',
  'custom' = 'Customizado',
}

const LinearColorsByType = {
  income: { line: ColorsPalette.light['lime.200'], start: 'rgba(148, 163, 79, 0.25)', end: 'rgba(110,163,79,0.02)' },
  expense: { line: ColorsPalette.light['red.200'], start: 'rgba(239, 68, 68, 0.25)', end: 'rgba(239, 68, 68, 0.02)' },
}

const getDateRange = (key: RangeKey) => {
  const end = new Date();
  const start = new Date();
  switch (key) {
    case '1d': start.setDate(end.getDate() - 1); break;
    case '7d': start.setDate(end.getDate() - 6); break;
    case '30d': start.setDate(end.getDate() - 29); break;
    case '90d': start.setDate(end.getDate() - 89); break;
  }
  return { start, end };
};

const formatDay = (ts: number) => {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const WidgetFinancialResume: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const [transactionType, setTransactionType] = React.useState<TransactionType>('income');
  const [totalValue, setTotalValue] = useState(0);

  const [range, setRange] = useState<RangeKey>('30d');
  const [{ start, end }] = useState(() => getDateRange('30d'));
  const [data, setData] = useState<Point[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { start: s, end: e } = getDateRange(range);
      const { totalValue, data: points } = await fetchFinancialResume(transactionType, userId, s, e);
      setData(points.sort((a, b) => a.timestamp - b.timestamp));
      setTotalValue(totalValue);
      setActivePoint(null);
    } finally {
      setLoading(false);
    }
  }, [userId, range, start, end, transactionType]);

  useEffect(() => { load(); }, [load]);

  const chartData = useMemo(() => {
    if (!data.length) return [];
    return data.map((p, i) => ({
      value: p?.value ? p.value : 0,
      dataPointText: '',
      labelComponent: i % Math.ceil(data.length / 6) === 0
        ? () => (
          <Text style={styles.xLabel}>
            {formatDay(p.timestamp)}
          </Text>
        )
        : undefined,
      onPress: () => setActivePoint(p),
    }));
  }, [data]);

  const lastValue = data.length ? data[data.length - 1].value : 0;

  const handleRange = (k: RangeKey) => {
    setRange(k);
    Haptics.selectionAsync();
  };


const handleTransactionTypeChange = () =>  setTransactionType((prev) => (prev === 'income' ? 'expense' : 'income'));

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center'}}>
      <Text style={styles.title}>Resumo por período</Text>
        <BytebankButton color={'primary'} onPress={() => handleTransactionTypeChange()} styles={styles.button}>
          <View>
            <FontAwesome name="exchange" size={18} color={ColorsPalette.light["lime.100"]} />
          </View>
          <View>
            <Text style={styles.buttonText}>Trocar</Text>
          </View>
        </BytebankButton>
      </View>
      <View style={styles.container}>
        <Text style={styles.subtitle}>Visão de {transactionType !== 'income' ? 'despesas' : 'receitas'}</Text>

        <View style={styles.rangeRow}>
          {(['1d', '7d', '30d', '90d'] as RangeKey[]).map(r => {
            const active = r === range;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => handleRange(r)}
                style={[styles.rangeButton, active && styles.rangeButtonActive]}
              >
                <Text style={[styles.rangeLabel, active && styles.rangeLabelActive]}>
                  {RangeKeyLabel[r]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.valueMain}>
            {formatCurrency(totalValue)}
          </Text>
          {activePoint && (
            <Text style={styles.valueSub}>
              {formatCurrency(activePoint.value)} em {formatDay(activePoint.timestamp)}
            </Text>
          )}
        </View>

        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator color={ColorsPalette.light['lime.400']} />
          </View>
        )}

        {!isLoading && !data.length && (
          <Text style={styles.empty}>Sem dados no período.</Text>
        )}

        {!isLoading && data.length > 0 && (
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              areaChart
              hideRules
              hideDataPoints={false}
              color={LinearColorsByType[transactionType].line}
              startFillColor={LinearColorsByType[transactionType].start}
              endFillColor={LinearColorsByType[transactionType].end}
              startOpacity={1}
              endOpacity={0}
              thickness={2}
              initialSpacing={20}
              spacing={Math.max(30, 260 / chartData.length)}
              focusEnabled
              onFocus={(item) => {
                if (item && item.index != null) {
                  setActivePoint(data[item.index]);
                }
              }}
              yAxisColor="transparent"
              xAxisColor="transparent"
              yAxisTextStyle={{ color: '#a1a58c', fontSize: 11 }}
              xAxisLength={260}
              pointerConfig={{
                pointerStripColor: ColorsPalette.light['grey.500'],
                pointerStripWidth: 2,
                pointerColor: ColorsPalette.light['grey.400'],
                radius: 5,
                pointerLabelComponent: (items) => {
                  if (!items?.length) return null;
                  const item = items[0];
                  return (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipValue}>{formatCurrency(item?.value || 0)}</Text>
                    </View>
                  );
                },
              }}
            />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: ColorsPalette.light["lime.100"],
    marginLeft: 10,
    padding: 0
  },
  button: {
    backgroundColor: ColorsPalette.light['lime.900'],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: 0,
  },
  container: { backgroundColor: ColorsPalette.light['lime.50'], padding: 20, borderRadius: 18 },
  title: { color: ColorsPalette.light['lime.900'], fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: ColorsPalette.light['lime.900'], fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  rangeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  rangeButton: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: ColorsPalette.light['lime.800'], borderRadius: 8 },
  rangeButtonActive: { backgroundColor: ColorsPalette.light['lime.300'] },
  rangeLabel: { color: ColorsPalette.light['lime.50'], fontSize: 12, fontWeight: 600 },
  rangeLabelActive: { color: ColorsPalette.light['lime.800'] },
  customInfo: { marginBottom: 8 },
  customText: { color: '#d4e5d6', fontSize: 12 },
  link: { color: ColorsPalette.light['lime.700'], marginTop: 4, fontSize: 12 },
  valueRow: { flexDirection: 'column', alignItems: 'flex-start', gap: 5, marginBottom: 4 },
  valueMain: { color: ColorsPalette.light['lime.900'], fontSize: 24, fontWeight: '700' },
  valueSub: { color: '#a3a58c', fontSize: 15, fontWeight: '500' },
  loader: { height: 170, alignItems: 'center', justifyContent: 'center' },
  empty: { color: '#a3a58c', fontSize: 12, paddingVertical: 24, textAlign: 'center' },
  chartWrapper: { width: '100%', alignItems: 'center', paddingTop: 8 },
  xLabel: { color: '#a3a58c', fontSize: 9, marginTop: 6 },
  tooltip: { minWidth: 90, zIndex: 9999, backgroundColor: ColorsPalette.light['grey.900'], padding: 6, borderRadius: 6, alignItems: 'center' },
  tooltipValue: { color: '#d4e5d6', fontSize: 14, fontWeight: '600' },
  tooltipDate: { color: '#a3a58c', fontSize: 10, marginTop: 2 },
});

export default WidgetFinancialResume;