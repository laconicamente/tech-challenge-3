import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import 'react-native-reanimated';

import { PaperDarkTheme, PaperLightTheme } from '@/shared/classes/constants/Colors';
import { AuthProvider } from '@/shared/contexts/auth/AuthContext';
import { FinancialProvider } from '@/shared/contexts/financial/FinancialContext';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  return (
    <AuthProvider>
      <FinancialProvider>
      <PaperProvider theme={colorScheme === 'dark' ? PaperDarkTheme : PaperLightTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/account-access" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
      </FinancialProvider>
    </AuthProvider>
  );
}
