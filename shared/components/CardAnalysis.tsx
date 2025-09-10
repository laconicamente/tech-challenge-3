import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card, useTheme } from 'react-native-paper';

const pieData = [
  { value: 40911, color: '#b6da42', text: 'Ganhos' },
  { value: 12273, color: '#e46e6e', text: 'Gastos' },
];

const CardAnalytics = () => {
  const theme = useTheme();

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Análise mensal</Text>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.chartAndTextContainer}>
          <PieChart
            data={pieData}
            donut
            radius={70}
            innerRadius={45} 
            sectionAutoFocus
            centerLabelComponent={() => (
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', textAlign: 'center' }}>R$ 58.638</Text>
              </View>
            )}
            innerCircleColor="#1E1E1E"
            
            // **** PROPRIEDADES DE ANIMAÇÃO ADICIONADAS AQUI ****
            isAnimated 
            animationDuration={1200} // Duração da animação em milissegundos (ex: 1.2 segundos)
            animationEasing="ease-in-out" // Tipo de easing da animação (opcional)
            // animationType="fadeIn" // Outros tipos incluem 'spring', 'linear', 'bounce' (opcional)
          />
        </View>

        <View style={styles.statsContainer}>
          <StatItem dotColor="#b6da42" label="Quanto entrou" value="R$ 40.911" /> {/* Ordem corrigida */}
          <StatItem dotColor="#e46e6e" label="Quanto gastou" value="R$ 12.273" /> {/* Ordem corrigida */}
        </View>
      </View>
        <View style={styles.descriptionContainer}>
            <Text style={styles.description}>A diferença entre os seus ganhos e seus gastos é de R$ 28.638,00.</Text> {/* Ajustada a descrição */}
        </View>
    </Card>
  );
};

const StatItem = ({ dotColor, label, value }) => (
  <View style={styles.statItem}>
    <View style={[styles.statDot, { backgroundColor: dotColor }]} />
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    marginHorizontal: 0,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 16, // Um pouco menor para melhor leitura
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartAndTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  statsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CardAnalytics;