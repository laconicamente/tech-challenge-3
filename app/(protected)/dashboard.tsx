import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { AppHeader } from '@/shared/components/AppHeader';
import { CardBalance } from '@/shared/components/Balance/CardBalance';
import WidgetAnalysisMonthly from '@/shared/components/Widget/WidgetAnalysisMonthly';
import WidgetBiggestEntries from '@/shared/components/Widget/WidgetBiggestEntries';
import WidgetFinancialResume from '@/shared/components/Widget/WidgetFinancialResume';
import WidgetFinancialStatus from '@/shared/components/Widget/WidgetFinancialStatus';
import WidgetSpendingByCategory from '@/shared/components/Widget/WidgetSpending/WidgetSpendingByCategory';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { user } = useAuth();

  const headerMax = 115;
  const headerHeight = useSharedValue(headerMax);

  const animatedGreetingHeaderStyle = useAnimatedStyle(() => ({
    height: withTiming(headerHeight.value, { duration: 220 }),
  }));

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const collapse = y > 40;
    headerHeight.value = collapse ? 0 : headerMax;
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Stack.Screen
        options={{
          header: () => <AppHeader />,
          headerShown: true,
          statusBarStyle: 'inverted',
        }}
      />

      <Animated.View style={[styles.greetingHeader, animatedGreetingHeaderStyle]}>
        <Text style={styles.greetingTitle}>{`Olá, ${user?.displayName?.split(' ')[0] ?? 'Usuário'}!`}</Text>
        <Text style={styles.greetingSubtitle}>Gerencie suas finanças de forma eficiente.</Text>
      </Animated.View>

      <Animated.View style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <CardBalance />
            <WidgetFinancialStatus />
            <WidgetFinancialResume/>
            <WidgetSpendingByCategory />
            <WidgetBiggestEntries />
            <WidgetAnalysisMonthly />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  greetingHeader: {
    backgroundColor: ColorsPalette.light['lime.900'],
    paddingHorizontal: 30,
    zIndex: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  greetingTitle: { fontSize: 30, fontWeight: '500', color: ColorsPalette.light['lime.50'] },
  greetingSubtitle: { fontSize: 16, color: ColorsPalette.light['lime.50'] },
  content: {
    backgroundColor: '#FFF',
    flex: 1,
    gap: 16,
    padding: 20,
    marginBottom: 40,
  },
});