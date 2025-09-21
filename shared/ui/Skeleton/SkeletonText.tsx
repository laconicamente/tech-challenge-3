import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Shimmer } from './Shimmer';

interface SkeletonTextProps {
    style?: ViewStyle;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ style }) => {
    return (
        <View style={[styles.text, style]}>
            <Shimmer />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        height: 12,
        backgroundColor: '#999',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
        position: 'relative',
    },
});