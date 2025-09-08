import { View, Text, useColorScheme, Platform } from 'react-native';
import { Slot, Tabs } from 'expo-router';
import { useAuth } from '@/contexts/auth/AuthContext';
import BytebankTabBar from '@/components/ui/TabBar';

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();
    const colorScheme = useColorScheme();

    //   if (!isAuthenticated) {
    //     return null;
    //   }

    return (
        <Tabs
            tabBar={() => <BytebankTabBar />}
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