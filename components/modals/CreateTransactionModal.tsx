import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions, PanResponder, Platform, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, Portal, Card, Divider } from 'react-native-paper';
import { BytebankButton } from '../ui/Button';
import { BytebankInput } from '../ui/Input';
import { BytebankTabSelector } from '../ui/TabSelector';

const height = Dimensions.get('window').height;

interface CreateTransactionModalProps {
    visible: boolean;
    onDismiss: () => void;
    onFinished: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ visible, onDismiss, onFinished }) => {
    const [transactionType, setTransactionType] = useState('income');

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');

    // Valor animado para a animação de entrada/saída do modal
    const slideAnim = useRef(new Animated.Value(height)).current;
    // Valor animado para o gesto de deslizar
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        if (visible) {
            pan.setValue({ x: 0, y: 0 });
            Animated.timing(slideAnim, {
                toValue: Platform.OS === 'web' ? 0 : height * 0.25,
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

    const handleTabChange = (name: string) => {
        setTransactionType(name);
    };

    const handleCreateTransaction = () => {
        console.log({ transactionType, descricao, valor, categoria });
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
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                            >
                                <SafeAreaView edges={['bottom']}>
                                    <Card style={styles.card}>
                                        <View style={styles.dragHandle} />
                                        <View style={styles.header}>
                                            <Text style={styles.title}>Nova transação</Text>
                                        </View>
                                        <Divider />

                                        <BytebankTabSelector tabs={[{ label: 'Entrada', name: 'income' }, { label: 'Saída', name: 'expense' }]} activeTab={transactionType} onTabChange={handleTabChange} />
                                        <BytebankInput
                                            label={'Descrição'}
                                            value={descricao}
                                            onChangeText={setDescricao}
                                            placeholder="Descreva sua transação"
                                        />

                                        <BytebankInput
                                            label={'Valor'}
                                            value={valor}
                                            onChangeText={setValor}
                                            placeholder="R$ 0,00"
                                        />

                                        <BytebankInput
                                            label={'Selecione uma categoria'}
                                            value={categoria}
                                            onChangeText={setCategoria}
                                            placeholder="Ex: Alimentação"
                                        />
                                        <BytebankButton color="primary" variant="contained" onPress={handleCreateTransaction}>
                                            Concluir
                                        </BytebankButton>
                                    </Card>
                                </SafeAreaView>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
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
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default CreateTransactionModal;