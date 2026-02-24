import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { YoutubePlayerModal } from '../src/components/YoutubePlayerModal';
import { AppButton } from '../src/Shared/components/atoms/AppButton';
import { RecentResultsList } from '../src/features/recognition/components/RecentResultsList';
import { RecognitionStatusMessage } from '../src/features/recognition/components/RecognitionStatusMessage';
import { SongMatchCard } from '../src/features/recognition/components/SongMatchCard';
import { useSongRecognition } from '../src/features/recognition/hooks/useSongRecognition';

export default function HomeScreen() {
  const router = useRouter();
  const {
    status,
    currentMatch,
    recentMatches,
    statusMessage,
    identifySong,
    isRecognizing,
    isSupported,
    unsupportedMessage,
    playOnYouTube,
    stopListening,
    youtubeSong,
    isYoutubeModalVisible,
    closeYouTubeModal,
  } = useSongRecognition();

  const canIdentifySong = isSupported && !isRecognizing;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Improved Shazam</Text>
          <Text style={styles.subtitle}>Identify songs around you instantly.</Text>
        </View>

        {!isSupported ? <Text style={styles.helperText}>{unsupportedMessage}</Text> : null}

        <View style={styles.actions}>
          <AppButton
            label={isRecognizing ? 'Listening...' : 'Identify song'}
            onPress={identifySong}
            isLoading={isRecognizing}
            disabled={!canIdentifySong}
          />
          <AppButton label="Settings" variant="secondary" onPress={() => router.push('/settings')} />
          {isRecognizing ? (
            <AppButton label="Stop listening" variant="secondary" onPress={stopListening} />
          ) : null}
          {(status === 'no-match' || status === 'error') && isSupported ? (
            <AppButton label="Try again" variant="secondary" onPress={identifySong} />
          ) : null}
        </View>

        <RecognitionStatusMessage status={status} message={statusMessage} />

        {currentMatch ? (
          <SongMatchCard song={currentMatch} onPlayOnYouTube={() => playOnYouTube(currentMatch)} />
        ) : null}

        <RecentResultsList songs={recentMatches} />
      </ScrollView>

      <YoutubePlayerModal
        song={youtubeSong}
        visible={isYoutubeModalVisible}
        onClose={closeYouTubeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 18,
    paddingBottom: 36,
  },
  header: {
    gap: 6,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
  },
  helperText: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    color: '#312E81',
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actions: {
    gap: 10,
  },
});
