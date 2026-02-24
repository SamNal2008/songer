import type { MatchedItem } from 'expo-shazamkit';
import * as ExpoShazamKit from 'expo-shazamkit';
import { Platform } from 'react-native';

import type { RecognizedSong } from '../types';

const MAX_RECENT_MATCHES = 10;

function mapMatchedItem(item: MatchedItem): RecognizedSong {
  const title = item.title?.trim() || 'Unknown title';
  const artist = item.artist?.trim() || 'Unknown artist';
  const fallbackId = `${artist}-${title}`.toLowerCase().replace(/\s+/g, '-');

  return {
    id: item.shazamID ?? fallbackId,
    title,
    artist,
    artworkUrl: item.artworkURL,
  };
}

function dedupeAndCap(items: RecognizedSong[]): RecognizedSong[] {
  const seen = new Set<string>();
  const deduped: RecognizedSong[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }

    seen.add(item.id);
    deduped.push(item);

    if (deduped.length === MAX_RECENT_MATCHES) {
      break;
    }
  }

  return deduped;
}

export const shazamRecognitionService = {
  isSupported() {
    return Platform.OS === 'ios' && ExpoShazamKit.isAvailable();
  },

  async identifySong(): Promise<RecognizedSong | null> {
    if (!this.isSupported()) {
      throw new Error('ShazamKit is available on iOS 15+ only.');
    }

    const results = await ExpoShazamKit.startListening();
    if (!results.length) {
      return null;
    }

    return mapMatchedItem(results[0]);
  },

  stopListening() {
    ExpoShazamKit.stopListening();
  },

  mergeRecentMatches(recentMatches: RecognizedSong[], latestMatch: RecognizedSong) {
    return dedupeAndCap([latestMatch, ...recentMatches]);
  },
};
