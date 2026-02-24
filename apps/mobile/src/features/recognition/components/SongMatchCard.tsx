import { Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../../Shared/components/atoms/AppButton';

import type { RecognizedSong } from '../types';

type SongMatchCardProps = {
  song: RecognizedSong;
  onPlayOnYouTube: () => void;
};

export function SongMatchCard({ song, onPlayOnYouTube }: SongMatchCardProps) {
  return (
    <View style={styles.card}>
      {song.artworkUrl ? <Image source={{ uri: song.artworkUrl }} style={styles.artwork} /> : null}
      <View style={styles.metadata}>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>
      <AppButton label="Play on YouTube" onPress={onPlayOnYouTube} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    gap: 16,
    padding: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  artwork: {
    borderRadius: 12,
    height: 180,
    width: '100%',
  },
  metadata: {
    gap: 4,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
  artist: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
});
