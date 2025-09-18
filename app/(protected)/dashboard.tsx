import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { AppHeader } from '@/shared/components/AppHeader';
import { CardBalance } from '@/shared/components/Balance/CardBalance';
import CategoryList from '@/shared/components/Category/CategoryList';
import CardAnalytics from '@/shared/components/Widget/CardAnalysis';
import FinancialResume from '@/shared/components/Widget/FinancialResume';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const opacity = useSharedValue(1);
  const height = useSharedValue(115);
  const contentTopRadius = useSharedValue(32);
  const contentMarginTop = useSharedValue(0);

  const animatedGreetingHeaderStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 300 }),
    height: withTiming(height.value, { duration: 300 }),
    borderBottomLeftRadius: contentTopRadius.value,
    borderBottomRightRadius: contentTopRadius.value,
    overflow: 'hidden',
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    marginTop: contentMarginTop.value,
  }));

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const shouldShowHeader = y < 40;

    if (shouldShowHeader !== showHeader) {
      setShowHeader(shouldShowHeader);
      height.value = shouldShowHeader ? 115 : 0;
      contentTopRadius.value = shouldShowHeader ? 32 : 0;
      contentMarginTop.value = shouldShowHeader ? 0 : 0;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <Animated.View style={[animatedContentStyle]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={0}
        >
          <View style={styles.content}>
            <CardBalance />
            <FinancialResume />
            <CardAnalytics />
            <View style={{ minHeight: 220 }}>
              <CategoryList />
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  greetingHeader: {
    backgroundColor: ColorsPalette.light['lime.900'],
    paddingHorizontal: 30,
    zIndex: 2,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    height: 115,
    display: 'flex',
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: '500',
    color: '#FFF',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: ColorsPalette.light['lime.50'],
  },
  content: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: 20,
    minHeight: 600,
    paddingHorizontal: 20,
    zIndex: 1,
  },
});