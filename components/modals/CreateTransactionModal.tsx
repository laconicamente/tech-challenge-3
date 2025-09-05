import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions, PanResponder } from 'react-native';
import { Modal, Portal, TextInput, Button, Card, Divider } from 'react-native-paper';

// Obtém a altura da tela
const { height } = Dimensions.get('window');

interface CreateTransactionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onFinished: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ visible, onDismiss, onFinished }) => {
  const [tipoTransacao, setTipoTransacao] = useState('ENTRADA');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  
  // Valor animado para a animação de entrada/saída do modal
  const slideAnim = useRef(new Animated.Value(height)).current;
  // Valor animado para o gesto de deslizar
  const pan = useRef(new Animated.ValueXY()).current;

  // Usa useEffect para iniciar a animação quando a prop 'visible' muda
  useEffect(() => {
    if (visible) {
      // **FIXO AQUI**: Reseta o valor do pan para 0 sempre que o modal é aberto.
      pan.setValue({ x: 0, y: 0 });
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // Cria o PanResponder para detectar o gesto de deslizar
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Habilita o gesto apenas se estiver arrastando para baixo
        return gestureState.dy > 5;
      },
      onPanResponderMove: (e, gestureState) => {
        // Permite o movimento apenas para baixo
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        // Se o deslize foi rápido o suficiente ou grande o suficiente
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.timing(pan, {
            toValue: { x: 0, y: height },
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDismiss());
        } else {
          // Volta o modal para a posição original
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleConcluir = () => {
    console.log({ tipoTransacao, descricao, valor, categoria });
    onFinished();
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Animated.View
          style={[
            styles.animatedView,
            { transform: [{ translateY: slideAnim }, { translateY: pan.y }] }
          ]}
          {...panResponder.panHandlers}
        >
          <Card style={styles.card}>
            <View style={styles.dragHandle} />
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
                buttonColor={tipoTransacao === 'ENTRADA' ? '#8BC34A' : 'transparent'}
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
              buttonColor="#333"
              labelStyle={{ color: 'white' }}
            >
              Concluir
            </Button>
          </Card>
        </Animated.View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  animatedView: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
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
    backgroundColor: 'transparent',
  },
  concluirButton: {
    marginTop: 20,
    borderRadius: 5,
    paddingVertical: 5,
  },
});

export default CreateTransactionModal;