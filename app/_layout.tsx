import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { PaperProvider, useTheme } from 'react-native-paper';
import { PaperDarkTheme, PaperLightTheme } from '@/constants/Colors';
import Logo from '../assets/images/logo.svg';
import { Feather } from '@expo/vector-icons';
import { View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Redireciona para a página de login
      // router.replace('/login'); // Rota baseada na estrutura de arquivos
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  
  const AppHeader = () => {
    const handleLogout = () => {      
      Alert.alert("Sair", "Você tem certeza que deseja sair da aplicação?", [
        { text: "Cancelar" },
        { text: "Sair", onPress: () => {
          console.log('Usuário deslogado!');
          router.replace('/account-access')
        }}
      ]);
    };

    return (
      <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#d0d0d078',
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}>
        <Logo width={130} height={30} />
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={24} color={theme.colors.shadow} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    );
  };
  
  return (
    <AuthProvider>
      <PaperProvider theme={colorScheme === 'dark' ? PaperDarkTheme : PaperLightTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/account-access" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{
          headerTitle: '',
          headerShown: true,
          header: () => <AppHeader />, 
        }}
        />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
