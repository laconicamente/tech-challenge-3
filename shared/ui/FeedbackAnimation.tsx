import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export type FeedbackAnimationType = 'success' | 'error';
export interface FeedbackAnimationProps {
    name: FeedbackAnimationType;
    onFinished?: () => void;
}
const animationSources: Record<string, any> = {
    success: require('@/assets/animations/success.json'),
    error: require('@/assets/animations/error.json'),
};

export const FeedbackAnimation = ({ name, onFinished }: FeedbackAnimationProps) => {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.play();
        }
    }, [name]);

    return (
        <View style={styles.container}>
            <LottieView
                ref={animationRef}
                source={animationSources[name]}
                loop={false}
                autoPlay={true}
                resizeMode="contain"
                onAnimationFinish={onFinished}
                style={styles.animation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        zIndex: 10,
    },
    animation: {
        width: width * 0.8,
        height: height * 0.8,
    },
});