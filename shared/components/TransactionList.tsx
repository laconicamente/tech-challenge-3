import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { TransactionItem } from './TransactionItem';

const transacoes = [
  {
    id: '1',
    titulo: 'Pagamento recebido',
    descricao: 'Transferência de Maria P.',
    valor: '+ R$ 50,00',
    data: '10 de Setembro',
    tipo: 'entrada',
  },
  {
    id: '2',
    titulo: 'Spotify',
    descricao: 'Pagamento de assinatura',
    valor: '- R$ 21,90',
    data: '08 de Setembro',
    tipo: 'saida',
  },
  {
    id: '3',
    titulo: 'Supermercado',
    descricao: 'Compra no Carrefour',
    valor: '- R$ 150,50',
    data: '07 de Setembro',
    tipo: 'saida',
  },
  {
    id: '4',
    titulo: 'Pix recebido',
    descricao: 'Transferência de João S.',
    valor: '+ R$ 200,00',
    data: '05 de Setembro',
    tipo: 'entrada',
  },
  {
    id: '5',
    titulo: 'Uber',
    descricao: 'Corrida para casa',
    valor: '- R$ 35,00',
    data: '04 de Setembro',
    tipo: 'saida',
  },
];

export default function TransactionList() {
  const insets = useSafeAreaInsets();

  // Função para renderizar cada item na FlatList
  const renderItem = ({ item }) => (
    <TransactionItem
      titulo={item.titulo}
      descricao={item.descricao}
      valor={item.valor}
      data={item.data}
      tipo={item.tipo}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de transações</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Título e Filtro */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Transações</Text>
        <View style={styles.filtroContainer}>
          <Text style={styles.filtroText}>Filtro</Text>
          <Ionicons name="filter" size={16} color="#000" />
        </View>
      </View>

      {/* Lista de Transações */}
      <FlatList
        data={transacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  filtroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filtroText: {
    fontSize: 14,
    marginRight: 4,
    color: '#555',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  valorEntrada: {
    color: '#2ecc71', // Verde
  },
  valorSaida: {
    color: '#e74c3c', // Vermelho
  },
  itemData: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});