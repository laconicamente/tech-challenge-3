import { PaperDarkTheme, PaperLightTheme } from '@/shared/classes/constants/Colors';
import { AuthProvider } from '@/shared/contexts/auth/AuthContext';
import { FinancialProvider } from '@/shared/contexts/financial/FinancialContext';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import '@/shared/i18n/datePickerLocale';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      setReady(true);
    }
  }, [loaded]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(()=>{});
    }
  }, [ready]);

  if (!ready) return null;
  
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
