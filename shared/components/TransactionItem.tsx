import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";

interface TransactionItemProps {
  titulo: string;
  descricao: string;
  valor: string | number;
  data: string;
  tipo: 'entrada' | 'saida';
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ titulo, descricao, valor, data, tipo }) => (
  <View style={styles.itemContainer}>
    <View style={{backgroundColor: tipo === 'entrada' ? '#eef4ce' : '#ffe7e7', ...styles.itemIconContainer}}>
      <Ionicons
        name={tipo === 'entrada' ? 'arrow-down' : 'arrow-up'}
        size={30}
        color={'#333'}
      />
    </View>
    <View style={styles.itemDetalhes}>
      <Text style={styles.itemTitulo}>{titulo}</Text>
      <Text style={styles.itemDescricao}>{descricao}</Text>
    </View>
    <View style={styles.itemValorContainer}>
      <Text style={[styles.itemValor]}>
        {valor}
      </Text>
      <Text style={styles.itemData}>{data}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
    marginTop: 20
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemIconContainer: {
    marginRight: 12,
    borderRadius: 25,
    padding: 10,
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
  itemData: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});