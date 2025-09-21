import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Shimmer } from './Shimmer';

interface SkeletonAvatarProps {
    style?: ViewStyle;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ style }) => {
    return (
        <View style={[styles.avatar, style]}>
            <Shimmer />
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#999',
        overflow: 'hidden',
        position: 'relative',
    },
});