import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Href, useRouter, useSegments } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import CreateTransactionModal from '../modals/CreateTransactionModal';
import { useTheme } from 'react-native-paper';

const BytebankTabBar = () => {
    const theme = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const handleCreateTransaction = () => {
        console.log('Transação criada!');
    };

    const tabs: { name: `/${string}`; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
        { name: '/dashboard', label: 'Início', icon: 'home' },
        { name: '/transactions', label: 'Transações', icon: 'dollar-sign'},
        { name: '/add', label: 'Criar transação', icon: 'plus' },
        { name: '/cards', label: 'Cartões', icon: 'credit-card' },
        { name: '/profile', label: 'Perfil', icon: 'user' },
    ];
    const activeTab = '/' + (segments[1] ?? 'dashboard');

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab, index) => {
                const isFocused = tab.name === activeTab;
                console.log(activeTab)
                if (tab.icon === 'plus') {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.customButton}
                            onPress={() => showModal()}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.primary]}
                                style={styles.gradient}
                            >
                                <Feather name="plus" size={30} color="black" />
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.tabButton}
                        onPress={() => router.replace(tab.name as Href)}
                    >
                        <Feather name={tab.icon} size={24} color={isFocused ? theme.colors.primary : 'gray'} />
                        <Text style={{ color: isFocused ? theme.colors.primary : 'gray', fontSize: 12 }}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            <CreateTransactionModal
                visible={isModalVisible}
                onDismiss={hideModal}
                onFinished={handleCreateTransaction}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        justifyContent: 'space-around',
        height: 80,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButton: {
        position: 'absolute',
        top: -30,
        width: 60,
        height: 60,
        zIndex: 999,
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    gradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BytebankTabBar;