import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-gifted-charts'; // Não precisamos mais do LineChart
import { Card } from 'react-native-paper';


// --- Configurações Fixas do Gráfico ---
const BAR_WIDTH = 30;
const SPACING = 10;
const INITIAL_SPACING = 10;
const NUMBER_OF_DAYS = 7;

// Calcule a largura do gráfico para evitar vazamentos
const calculatedChartWidth = 
  (BAR_WIDTH * NUMBER_OF_DAYS) + 
  (SPACING * (NUMBER_OF_DAYS - 1)) + 
  INITIAL_SPACING * 2; // Duas vezes o initialSpacing (início e fim)

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Gerar dados aleatórios para 7 dias
const generateWeeklyData = (baseValue: number, variance: number, barColor: string, type: string) => {
  const data: { value: number; label: string; frontColor: string; text: string; dataPointIndex: number }[] = [];
  daysOfWeek.forEach((day, index) => {
    const value = baseValue + Math.random() * variance - (variance / 2);
    data.push({
      value: Math.max(0, Math.round(value / 100) * 100),
      label: day,
      frontColor: barColor,
      text: `${Math.max(0, Math.round(value / 100) * 100)}`,
      dataPointIndex: index,
    });
  });
  return data;
};

const entradasBarData = generateWeeklyData(2500, 1500, '#4A90E2', 'Entrada');
const saidasBarData = generateWeeklyData(1800, 1200, '#5ED4B3', 'Saída');


const FinancialResume = () => {
  const [selectedType, setSelectedType] = useState('entrada');

  const currentBarData = selectedType === 'entrada' ? entradasBarData : saidasBarData;

  const chartTitle = selectedType === 'entrada' ? 'Entradas Semanais' : 'Saídas Semanais';
  const chartSubtitle = 'Últimos 7 dias';
  const legendColor = selectedType === 'entrada' ? '#4A90E2' : '#5ED4B3';
  const legendLabel = selectedType === 'entrada' ? 'Movimento de Entrada' : 'Movimento de Saída';


  return (
    <Card style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.chartTitle}>{chartTitle}</Text>
        <Text style={styles.chartSubtitle}>{chartSubtitle}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, selectedType === 'entrada' && styles.selectedButton]}
          onPress={() => setSelectedType('entrada')}
        >
          <Text style={[styles.selectorButtonText, selectedType === 'entrada' && styles.selectedButtonTextActive]}>
            Entradas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectorButton, selectedType === 'saida' && styles.selectedButton]}
          onPress={() => setSelectedType('saida')}
        >
          <Text style={[styles.selectorButtonText, selectedType === 'saida' && styles.selectedButtonTextActive]}>
            Saídas
          </Text>
        </TouchableOpacity>
      </View>
      
      <BarChart
        data={currentBarData.map(item => ({
          ...item,
          renderToppart: () => (
            <View style={styles.dataPointDot} />
          ),
        }))}
        width={calculatedChartWidth}
        height={200}
        initialSpacing={INITIAL_SPACING}
        spacing={SPACING}
        barWidth={BAR_WIDTH}
        barBorderRadius={8}
        xAxisColor="#555"
        yAxisColor="#999"
        xAxisLabelTextStyle={styles.xAxisLabel}
        yAxisLabelTextStyle={styles.yAxisLabel}
        noOfSections={7}
        maxValue={3000}
        yAxisLabelSuffix=""
        yAxisLabelTexts={[]}
        yAxisOffset={0}
        isAnimated
        animationDuration={800}
        renderTooltip={(item) => (
          <View style={styles.tooltip}>
            <Text style={{ color: 'white', fontSize: 12 }}>R$ {item.value}</Text>
          </View>
        )}
        rulesColor="#555"
        rulesType="dashed"
        dashWidth={10}
        dashGap={6}
        showYAxisIndices
        verticalLinesColor="#555"
        showXAxisIndices
      />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: legendColor }]} />
          <Text style={styles.legendText}>{legendLabel}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    marginHorizontal: 0,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#1E1E2D',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#333',
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  selectorButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  selectedButtonTextActive: {
    color: '#fff',
  },
  xAxisLabel: {
    color: '#fff',
    fontSize: 12,
    transform: [{ translateY: 10 }],
  },
  yAxisLabel: {
    color: '#fff',
    fontSize: 12,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#fff',
  },
  dataPointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginBottom: 5,
  },
});

export default FinancialResume;