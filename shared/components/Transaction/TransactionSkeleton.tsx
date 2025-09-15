import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const TransactionSkeleton = () => {
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true 
    );
  }, []);

  const animatedStyle = {
    opacity: opacity,
  };

  return (
    <View style={styles.card}>
      <AnimatedView style={[styles.shimmer, animatedStyle]} />
      <View style={styles.content}>
        <View style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={[styles.text, {width: '80%'}]} />
          <View style={[styles.text, {width: '60%'}]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    position: 'relative',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#FDFDFD',
    backgroundColor: '#FFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginLeft: 20,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.73)',
    zIndex: 1,
  },
});
