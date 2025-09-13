import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BankCardDetails = ({ card }) => {
  if (!card) return null;

  return (
    <View style={styles.container}>

      {/* Exibir as ações e outros detalhes */}
      <View style={styles.actionButtonsContainer}>
        {card.actions.canBlock && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Bloquear cartão</Text>
          </TouchableOpacity>
        )}
        {card.actions.canSetPrimary && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Marcar como principal</Text>
          </TouchableOpacity>
        )}
        {card.actions.canDelete && (
          <TouchableOpacity>
            <Text style={styles.deleteButtonText}>Excluir cartão</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E',
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  actionButtonsContainer: {
    marginTop: 20,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#333',
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
    color: '#FF4D4D',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default BankCardDetails;