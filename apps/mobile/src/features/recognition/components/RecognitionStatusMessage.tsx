import { StyleSheet, Text, View } from 'react-native';

import type { RecognitionStatus } from '../types';

type RecognitionStatusMessageProps = {
  status: RecognitionStatus;
  message: string;
};

export function RecognitionStatusMessage({ status, message }: RecognitionStatusMessageProps) {
  return (
    <View style={[styles.container, stylesByStatus[status]]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const stylesByStatus = StyleSheet.create({
  idle: {
    backgroundColor: '#DBEAFE',
  },
  listening: {
    backgroundColor: '#FDE68A',
  },
  'match-found': {
    backgroundColor: '#BBF7D0',
  },
  'no-match': {
    backgroundColor: '#FDE68A',
  },
  error: {
    backgroundColor: '#FECACA',
  },
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },
});
