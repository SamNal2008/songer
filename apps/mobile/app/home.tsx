import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/Shared/components/atoms/AppButton';
import { RecentResultsList } from '../src/features/recognition/components/RecentResultsList';
import { RecognitionStatusMessage } from '../src/features/recognition/components/RecognitionStatusMessage';
import { SongMatchCard } from '../src/features/recognition/components/SongMatchCard';
import { YouTubeModal } from '../src/features/recognition/components/YouTubeModal';
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
    playOnYouTube,
    stopListening,
    youtubeQuery,
    closeYouTubeModal,
  } = useSongRecognition();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Improved Shazam</Text>
          <Text style={styles.subtitle}>Identify songs around you instantly.</Text>
        </View>

        <View style={styles.actions}>
          <AppButton
            label={isRecognizing ? 'Listening...' : 'Identify song'}
            onPress={identifySong}
            isLoading={isRecognizing}
            disabled={isRecognizing}
          />
          <AppButton label="Settings" variant="secondary" onPress={() => router.push('/settings')} />
          {isRecognizing ? (
            <AppButton label="Stop listening" variant="secondary" onPress={stopListening} />
          ) : null}
        </View>

        <RecognitionStatusMessage status={status} message={statusMessage} />

        {currentMatch ? (
          <SongMatchCard song={currentMatch} onPlayOnYouTube={() => playOnYouTube(currentMatch)} />
        ) : null}

        <RecentResultsList songs={recentMatches} />
      </ScrollView>

      <YouTubeModal query={youtubeQuery} onClose={closeYouTubeModal} />
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
  actions: {
    gap: 10,
  },
});
