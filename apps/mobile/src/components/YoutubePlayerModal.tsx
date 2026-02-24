import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

type YoutubePlayerModalProps = {
  song: {
    artist: string;
    title: string;
  } | null;
  visible: boolean;
  onClose: () => void;
};

function getYoutubeSearchUrl(song: { artist: string; title: string }) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.artist}-${song.title}`)}`;
}

export function YoutubePlayerModal({ song, visible, onClose }: YoutubePlayerModalProps) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>YouTube</Text>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>

        {song ? (
          <WebView
            source={{ uri: getYoutubeSearchUrl(song) }}
            style={styles.webview}
            startInLoadingState
          />
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  close: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
});
