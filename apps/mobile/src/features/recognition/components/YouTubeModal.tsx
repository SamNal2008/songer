import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

type YouTubeModalProps = {
  query: string | null;
  onClose: () => void;
};

function getYouTubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function YouTubeModal({ query, onClose }: YouTubeModalProps) {
  const visible = Boolean(query);

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>YouTube</Text>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>

        {query ? (
          <WebView
            source={{ uri: getYouTubeSearchUrl(query) }}
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
