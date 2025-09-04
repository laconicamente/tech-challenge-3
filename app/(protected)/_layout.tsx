import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import { useAuth } from '@/contexts/auth/AuthContext';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Protected Layout</Text>
      <Slot />
    </View>
  );
}