import { StyleSheet, Text, View } from 'react-native';

import type { RecognizedSong } from '../types';

type RecentResultsListProps = {
  songs: RecognizedSong[];
};

export function RecentResultsList({ songs }: RecentResultsListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent results</Text>
      {songs.length === 0 ? (
        <Text style={styles.empty}>No songs identified yet.</Text>
      ) : (
        songs.map((song) => (
          <View key={song.id} style={styles.row}>
            <Text style={styles.rowTitle}>{song.title}</Text>
            <Text style={styles.rowSubtitle}>{song.artist}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  heading: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  empty: {
    color: '#6B7280',
    fontSize: 14,
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: '#6B7280',
    fontSize: 13,
  },
});
