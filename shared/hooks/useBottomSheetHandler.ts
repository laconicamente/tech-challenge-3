import { useRef } from 'react';
import { PanResponder, Animated, Platform, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;

export function useBottomSheetHandler(pan: Animated.ValueXY, onDismiss: () => void) {
  return useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.timing(pan, {
            toValue: { x: 0, y: height },
            duration: 200,
            useNativeDriver: Platform.OS !== 'web',
          }).start(() => onDismiss());
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        }
      },
    })
  ).current;
}