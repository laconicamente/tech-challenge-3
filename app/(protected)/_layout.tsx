import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { BytebankTabBar } from '@/shared/ui/TabBar';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
    );
}