import { SkeletonAvatar } from '@/shared/ui/Skeleton/SkeletonAvatar';
import { SkeletonCard } from '@/shared/ui/Skeleton/SkeletonCard';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const TransactionSkeleton = ({ numberOfItems = 1 }) => {
  return (
    <>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <SkeletonCard key={index} style={styles.card}>
          <View style={styles.content}>
            <SkeletonAvatar style={styles.avatar} />
            <View style={styles.textContainer}>
                <SkeletonText style={{ width: '80%' }} />
                <SkeletonText style={{ width: '60%' }} />
            </View>
          </View>
        </SkeletonCard>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
card: {
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
    marginRight: 10,
    marginLeft: 20,
},
textContainer: {
    flex: 1,
},
});