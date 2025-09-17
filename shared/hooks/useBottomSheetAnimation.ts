import { useEffect } from 'react';
import { Animated, Platform, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;
const MODAL_HEIGHT_PERCENTAGE = 0.9;
const MODAL_START_POSITION = height * (1 - MODAL_HEIGHT_PERCENTAGE);

export function useBottomSheetAnimation(visible: boolean, slideAnim: Animated.Value, pan: Animated.ValueXY) {
  useEffect(() => {
    if (visible) {
      pan.setValue({ x: 0, y: 0 });
      Animated.timing(slideAnim, {
        toValue: Platform.OS === 'web' ? 0 : MODAL_START_POSITION,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [visible, slideAnim]);
}