import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useAuth } from '@/shared/auth/AuthContext';
import BytebankTabBar from '@/shared/ui/TabBar';

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

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