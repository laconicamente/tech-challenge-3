import { View, Text, useColorScheme, Platform } from 'react-native';
import { Slot, Tabs } from 'expo-router';
import { useAuth } from '@/contexts/auth/AuthContext';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { ColorsPalette } from '@/constants/Pallete';
import CustomTabBar from '@/components/ui/TabBarCustom';

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();
    const colorScheme = useColorScheme();

    //   if (!isAuthenticated) {
    //     return null;
    //   }

    return (
        <Tabs
            tabBar={() => <CustomTabBar />}
            screenOptions={{
                // tabBarActiveTintColor: ColorsPalette[colorScheme ?? 'light']['lime.200'],
                // tabBarBackground: TabBarBackground,
                headerShown: false,
                // tabBarButton: HapticTab,
                tabBarStyle: Platform.select({
                    ios: { position: 'absolute' },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Início',
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: 'Estatísticas',
                }}
            />
            <Tabs.Screen
                name="cards"
                options={{
                    title: 'Cartões',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                }}
            />
        </Tabs>
    );
}