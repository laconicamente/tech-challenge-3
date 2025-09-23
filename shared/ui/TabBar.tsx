import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter, useSegments } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionCreateDrawer from '../components/Transaction/TransactionCreateDrawer';

export const BytebankTabBar = () => {
    const theme = useTheme();
    const router = useRouter();
    const segments = useSegments();
    const insets = useSafeAreaInsets();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const tabs: { name: `/${string}`; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
        { name: '/dashboard', label: 'Início', icon: 'home' },
        { name: '/transactions', label: 'Transações', icon: 'dollar-sign'},
        { name: '/add', label: 'Criar transação', icon: 'plus' },
        { name: '/cards', label: 'Cartões', icon: 'credit-card' },
        { name: '/profile', label: 'Perfil', icon: 'user' },
    ];
    const activeTab = '/' + (segments[1] ?? 'dashboard');

   
  return (
    <View style={styles.wrapper}>
      <View style={[styles.tabContainer, { paddingBottom: insets.bottom }]}>
      <BlurView intensity={30} tint="light" style={{...StyleSheet.flatten(StyleSheet.absoluteFill), borderRadius: 20, overflow: 'hidden'}} />
        {tabs.map((tab, index) => {
          const isFocused = tab.name === activeTab;
          if (tab.icon === 'plus') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.customButton}
                onPress={showModal}
                activeOpacity={0.85}
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
              activeOpacity={0.7}
            >
              <Feather
                name={tab.icon}
                size={24}
                color={isFocused ? ColorsPalette.light['lime.700'] : 'gray'}
              />
              <Text
                style={{
                  color: isFocused ? ColorsPalette.light['lime.700'] : 'gray',
                  fontSize: 12,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TransactionCreateDrawer visible={isModalVisible} onDismiss={hideModal} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.90)', 
    backdropFilter: 'blur(20px)',
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    justifyContent: 'space-around',
    height: 80,
    alignItems: 'flex-start',
    paddingTop: 15,
    marginHorizontal: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    width: 55,
    height: 55,
    zIndex: 20,
    borderRadius: 32,
    backgroundColor: ColorsPalette.light['lime.600'],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: -1, height: -1 },
    shadowRadius: 3,
  },
  gradient: {
    width: 55,
    height: 55,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});