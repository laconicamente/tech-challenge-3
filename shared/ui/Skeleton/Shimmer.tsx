import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useSharedValue, withRepeat, withTiming, } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const Shimmer = () => {
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
        <AnimatedView style={[styles.shimmer, animatedStyle]} />
    );
};

const styles = StyleSheet.create({
    shimmer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
});