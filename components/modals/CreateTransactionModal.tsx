import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Modal, Portal, TextInput, Button, Card, Divider } from 'react-native-paper'; // Importe os componentes necessários

interface CreateTransactionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onFinished: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ visible, onDismiss, onFinished }) => {
  const [tipoTransacao, setTipoTransacao] = useState('ENTRADA'); // 'ENTRADA' ou 'SAÍDA'
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState(''); // Você pode usar um `Picker` ou `Dropdown` aqui

  const handleConcluir = () => {
    // Lógica para enviar a transação
    console.log({ tipoTransacao, descricao, valor, categoria });
    onFinished(); // Chamada para a função passada pelo pai
    onDismiss(); // Fecha o modal
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
        // Você pode adicionar um estilo de entrada/saída de animação aqui se desejar
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova transação</Text>
            <TouchableOpacity onPress={onDismiss}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          <Divider />

          <View style={styles.buttonGroup}>
            <Button
              mode={tipoTransacao === 'ENTRADA' ? 'contained' : 'outlined'}
              onPress={() => setTipoTransacao('ENTRADA')}
              style={styles.button}
              labelStyle={{ color: tipoTransacao === 'ENTRADA' ? 'white' : 'black' }}
              buttonColor={tipoTransacao === 'ENTRADA' ? '#8BC34A' : 'transparent'} // Cor verde do seu layout
            >
              ENTRADA
            </Button>
            <Button
              mode={tipoTransacao === 'SAÍDA' ? 'contained' : 'outlined'}
              onPress={() => setTipoTransacao('SAÍDA')}
              style={styles.button}
              labelStyle={{ color: tipoTransacao === 'SAÍDA' ? 'white' : 'black' }}
              buttonColor={tipoTransacao === 'SAÍDA' ? '#8BC34A' : 'transparent'}
            >
              SAÍDA
            </Button>
          </View>

          <TextInput
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            mode="outlined"
            style={styles.input}
            placeholder="Descreva sua transação"
            theme={{ colors: { primary: '#8BC34A' } }}
          />

          <TextInput
            label="Valor"
            value={valor}
            onChangeText={setValor}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="R$ 0,00"
            theme={{ colors: { primary: '#8BC34A' } }}
          />

          {/* Para Categoria, você pode usar um Dropdown/Picker */}
          {/* Exemplo simples de TextInput para Categoria, mas o ideal é um componente de seleção */}
          <TextInput
            label="Categoria"
            value={categoria}
            onChangeText={setCategoria}
            mode="outlined"
            style={styles.input}
            placeholder="Selecione uma categoria"
            theme={{ colors: { primary: '#8BC34A' } }}
          />

          <Button
            mode="contained"
            onPress={handleConcluir}
            style={styles.concluirButton}
            buttonColor="#333" // Cor escura do seu layout
            labelStyle={{ color: 'white' }}
          >
            Concluir
          </Button>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end', // Alinha o modal na parte inferior
    margin: 0, // Remove margens padrão do modal
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escuro semitransparente
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40, // Espaço extra para o botão concluir
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: 'gray',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent', // Para não ter fundo branco extra
  },
  concluirButton: {
    marginTop: 20,
    borderRadius: 5,
    paddingVertical: 5,
  },
});

export default CreateTransactionModal;