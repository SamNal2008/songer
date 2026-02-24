import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';

import type { RecognitionStatus } from '../types';

type RecognitionStatusMessageProps = {
  status: RecognitionStatus;
  message: string;
};

export function RecognitionStatusMessage({ status, message }: RecognitionStatusMessageProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== 'listening') {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      pulse.stopAnimation();
      pulse.setValue(0);
    };
  }, [pulse, status]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  return (
    <View style={[styles.container, stylesByStatus[status]]}>
      {status === 'listening' ? (
        <View style={styles.indicatorWrapper}>
          <Animated.View
            style={[
              styles.pulse,
              {
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />
          <View style={styles.dot} />
        </View>
      ) : null}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const stylesByStatus = StyleSheet.create({
  idle: {
    backgroundColor: '#DBEAFE',
  },
  listening: {
    backgroundColor: '#FEF3C7',
  },
  'match-found': {
    backgroundColor: '#BBF7D0',
  },
  'no-match': {
    backgroundColor: '#FED7AA',
  },
  error: {
    backgroundColor: '#FECACA',
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  indicatorWrapper: {
    alignItems: 'center',
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  pulse: {
    backgroundColor: '#F59E0B',
    borderRadius: 999,
    height: 14,
    position: 'absolute',
    width: 14,
  },
  dot: {
    backgroundColor: '#D97706',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  text: {
    color: '#111827',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
