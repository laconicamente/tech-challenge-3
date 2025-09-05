import CreateTransactionModal from '@/components/modals/CreateTransactionModal';
import { useAuth } from '@/contexts/auth/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function Profile() {
  const { logout } = useAuth()
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const handleConcluirTransacao = () => {
    // Lógica para o que acontece depois de concluir a transação
    console.log('Transação concluída!');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24 }}>Profile Page</Text>
      <Button mode="contained" onPress={showModal}>
          Abrir Nova Transação
        </Button>

        <CreateTransactionModal
          visible={isModalVisible}
          onDismiss={hideModal}
          onFinished={handleConcluirTransacao}
        />
      <Button  onPress={() => { 
        logout()
        router.replace('/(auth)/login') 
      }}> Sair </Button>
    </View>
  );
}