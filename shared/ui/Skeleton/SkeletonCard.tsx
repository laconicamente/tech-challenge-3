import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Shimmer } from './Shimmer';

interface SkeletonCardProps {
    children?: React.ReactNode;
    style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            <Shimmer />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#999',
    },
});