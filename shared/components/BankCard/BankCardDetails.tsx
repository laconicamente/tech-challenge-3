import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { SkeletonAvatar } from '@/shared/ui/Skeleton/SkeletonAvatar';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BankCardProps } from '../../classes/models/bank-card';
import { maskCardNumber } from '../../helpers/maskCardNumber';

const BankCardDetails = ({ isLoading, card, onActionPress, onDelete }: { isLoading: boolean, card: Partial<BankCardProps>, onDelete: (id: string) => void, onActionPress: (id: string, data: Partial<BankCardProps>) => void }) => {
    
    if (isLoading) {
        return (
            <View style={styles.container}>
                {[...Array(4)].map((_, index) => <SkeletonText key={index} style={{ width: '100%', height: 20, marginBottom: 20 }} />)}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[...Array(3)].map((_, index) => <SkeletonAvatar key={index} style={{ width: 50, height: 50, marginBottom: 20 }} />)}
                </View>
            </View>
        );
    }
    
    if (!card) return null;

    const cardDetailsList = [
        { label: 'Apelido', value: card.name },
        { label: 'Número', value: maskCardNumber(card.number ?? '') },
        { label: 'Validade', value: card.expiredAt },
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
                    <View style={styles.actionButtonWrapper}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => onActionPress(card.id ?? '', { blocked: true })}>
                        <MaterialIcons name="lock" size={20} color={ColorsPalette.light['lime.100']} />
                    </TouchableOpacity>
                        <Text style={styles.actionButtonText}>Bloquear cartão</Text>
                    </View>
                    <View style={styles.actionButtonWrapper}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => onActionPress(card.id ?? '', { principal: true })}>
                    <MaterialIcons name={"credit-card"} size={20} color={ColorsPalette.light['lime.100']} />
                    </TouchableOpacity>
                        <Text style={styles.actionButtonText}>Marcar como principal</Text>
                    </View>
                    <View style={styles.actionButtonWrapper}>
                    <TouchableOpacity style={styles.actionDeleteButton} onPress={() => onDelete(card.id)}>
                    <MaterialIcons name={"credit-card"} size={20} color={ColorsPalette.light['lime.800']} />
                    </TouchableOpacity>
                        <Text style={styles.deleteButtonText}>Excluir cartão</Text>
                    </View>
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
        paddingVertical: 5,
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
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    actionButtonWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%'
    },
    actionButton: {
        backgroundColor: ColorsPalette.light['lime.800'],
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: 60,
        height: 60,
        justifyContent: 'center',
    },
    actionDeleteButton: {
        backgroundColor: ColorsPalette.light['lime.200'],
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: ColorsPalette.light['lime.800'],
        fontSize: 14,
        textAlign: 'center'
    },
    deleteButtonText: {
        color: ColorsPalette.light['lime.700'],
        textAlign: 'center',
        fontSize: 14,
    },
});

export default BankCardDetails;