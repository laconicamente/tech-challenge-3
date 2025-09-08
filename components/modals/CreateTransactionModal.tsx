import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions, PanResponder, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, Portal, TextInput, Button, Card, Divider } from 'react-native-paper';

// Obtém a altura da tela
const height = Dimensions.get('window').height;
  
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
            pan.setValue({ x: 0, y: 0 });
            Animated.timing(slideAnim, {
                toValue:  Platform.OS === 'web' ? 0 : height * 0.35, // Modal para o fundo, não topo
                duration: 300,
                useNativeDriver: Platform.OS !== 'web',
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: Platform.OS !== 'web',
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
                        useNativeDriver: Platform.OS !== 'web',
                    }).start(() => onDismiss());
                } else {
                    // Volta o modal para a posição original
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: Platform.OS !== 'web',
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
                      <SafeAreaView edges={['bottom']}>
                    <Card style={styles.card}>
                        <View style={styles.dragHandle} />
                        <View style={styles.header}>
                            <Text style={styles.title}>Nova transação</Text>
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
                    </SafeAreaView>
                </Animated.View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    animatedView: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    card: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 90,
        width: '100%',
        maxHeight: height * 0.7, 
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