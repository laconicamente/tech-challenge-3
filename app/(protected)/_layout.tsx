import { View, Text, useColorScheme, Platform } from 'react-native';
import { Slot, Tabs } from 'expo-router';
import { useAuth } from '@/contexts/auth/AuthContext';
import BytebankTabBar from '@/shared/ui/TabBar';

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
                headerShown: false,
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
                name="transactions"
                options={{
                    title: 'Transações',
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