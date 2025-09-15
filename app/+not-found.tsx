import { router, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BytebankButton } from '@/shared/ui/Button';
import NotFoundSvg from '@/assets/images/not-found.svg';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tela não encontrada' }} />
      <View style={styles.container}>
      <NotFoundSvg width={220} height={220} />
        <Text style={{fontSize: 18, paddingVertical: 30, textAlign: 'center'}}>Desculpe! Não encontramos o que você está procurando. Que tal voltar para a nossa página inicial ou explorar outras áreas do seu dashboard?</Text>
          <BytebankButton color={'primary'} onPress={() => router.replace('/')}>Voltar para tela inicial</BytebankButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  }
});
