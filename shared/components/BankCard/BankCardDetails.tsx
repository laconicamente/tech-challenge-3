import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BankCardProps } from '../../classes/models/bank-card';
import { maskCardNumber } from '../../hooks/maskCardNumber';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';

const BankCardDetails = ({ card }: { card: Partial<BankCardProps> }) => {
    if (!card) return null;

    const cardDetailsList = [
        { label: 'Nome', value: card.name },
        { label: 'Número', value: maskCardNumber(card.number ?? '') },
        { label: 'Validade', value: card.expireDate },
        { label: 'CVV', value: card.cvv },
    ];
    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <View>
                    {cardDetailsList.map((detail, index) => (
                        <View style={styles.cardDetails} key={index}>
                            <Text style={styles.cardLabel}>{detail.label}</Text>
                            <Text style={styles.cardValue}>{detail.value}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Bloquear cartão</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Marcar como principal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.deleteButtonText}>Excluir cartão</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    cardDetails: {
        paddingVertical: 10,
    },
    cardLabel: {
        fontSize: 15,
        color: '#666',
    },
    cardValue: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#111'
    },
    actionButtonsContainer: {
        marginTop: 20,
        gap: 15,
    },
    actionButton: {
        backgroundColor: ColorsPalette.light['lime.900'],
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: ColorsPalette.light['lime.900'],
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        marginBottom: 20
    },
});

export default BankCardDetails;