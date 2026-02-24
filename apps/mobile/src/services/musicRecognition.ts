import * as ExpoShazamKit from 'expo-shazamkit';
import { Platform } from 'react-native';

export type MusicRecognitionResult = {
  title: string;
  artist: string;
  artworkUrl?: string;
};

const UNSUPPORTED_MESSAGE =
  'ShazamKit recognition requires an iOS development build (iOS 15.1+) and is unavailable in Expo Go.';

export class MusicRecognitionUnsupportedError extends Error {
  constructor(message = UNSUPPORTED_MESSAGE) {
    super(message);
    this.name = 'MusicRecognitionUnsupportedError';
  }
}

function isMusicRecognitionSupported() {
  return Platform.OS === 'ios' && ExpoShazamKit.isAvailable();
}

function ensureSupported() {
  if (!isMusicRecognitionSupported()) {
    throw new MusicRecognitionUnsupportedError();
  }
}

export async function startListening(): Promise<void> {
  ensureSupported();
}

export function stopListening(): void {
  if (Platform.OS === 'ios') {
    ExpoShazamKit.stopListening();
  }
}

export async function recognize(): Promise<MusicRecognitionResult | null> {
  await startListening();

  const results = await ExpoShazamKit.startListening();
  const firstMatch = results[0];

  if (!firstMatch) {
    return null;
  }

  return {
    title: firstMatch.title?.trim() || 'Unknown title',
    artist: firstMatch.artist?.trim() || 'Unknown artist',
    artworkUrl: firstMatch.artworkURL,
  };
}

export const musicRecognition = {
  isSupported: isMusicRecognitionSupported,
  startListening,
  stopListening,
  recognize,
};

export const musicRecognitionUnsupportedMessage = UNSUPPORTED_MESSAGE;
