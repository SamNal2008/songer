import { useCallback, useMemo, useState } from 'react';

import {
  musicRecognition,
  musicRecognitionUnsupportedMessage,
  type MusicRecognitionResult,
} from '../../../services/musicRecognition';
import type { RecognitionState, RecognizedSong } from '../types';

const INITIAL_STATE: RecognitionState = {
  status: 'idle',
  currentMatch: null,
  recentMatches: [],
  errorMessage: null,
};

const MAX_RECENT_MATCHES = 10;

function toRecognizedSong(song: MusicRecognitionResult): RecognizedSong {
  const id = `${song.artist}-${song.title}`.toLowerCase().replace(/\s+/g, '-');

  return {
    id,
    title: song.title,
    artist: song.artist,
    artworkUrl: song.artworkUrl,
  };
}

function mergeRecentMatches(recentMatches: RecognizedSong[], latestMatch: RecognizedSong) {
  const seen = new Set<string>();
  const deduped: RecognizedSong[] = [];

  for (const song of [latestMatch, ...recentMatches]) {
    if (seen.has(song.id)) {
      continue;
    }

    seen.add(song.id);
    deduped.push(song);

    if (deduped.length === MAX_RECENT_MATCHES) {
      break;
    }
  }

  return deduped;
}

export function useSongRecognition() {
  const [state, setState] = useState<RecognitionState>(INITIAL_STATE);
  const [youtubeSong, setYoutubeSong] = useState<{ artist: string; title: string } | null>(null);

  const isSupported = musicRecognition.isSupported();

  const identifySong = useCallback(async () => {
    if (!musicRecognition.isSupported()) {
      setState((previousState) => ({
        ...previousState,
        status: 'error',
        currentMatch: null,
        errorMessage: musicRecognitionUnsupportedMessage,
      }));
      return;
    }

    setState((previousState) => ({
      ...previousState,
      status: 'listening',
      currentMatch: null,
      errorMessage: null,
    }));

    try {
      const match = await musicRecognition.recognize();

      if (!match) {
        setState((previousState) => ({
          ...previousState,
          status: 'no-match',
          currentMatch: null,
          errorMessage: null,
        }));
        return;
      }

      const recognizedSong = toRecognizedSong(match);

      setState((previousState) => ({
        status: 'match-found',
        currentMatch: recognizedSong,
        // Recognition results are intentionally ephemeral and live in React state only.
        recentMatches: mergeRecentMatches(previousState.recentMatches, recognizedSong),
        errorMessage: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Song recognition failed.';

      setState((previousState) => ({
        ...previousState,
        status: 'error',
        currentMatch: null,
        errorMessage,
      }));
    }
  }, []);

  const playOnYouTube = useCallback((song: RecognizedSong) => {
    setYoutubeSong({ artist: song.artist, title: song.title });
  }, []);

  const closeYouTubeModal = useCallback(() => {
    setYoutubeSong(null);
  }, []);

  const stopListening = useCallback(() => {
    musicRecognition.stopListening();

    setState((previousState) => ({
      ...previousState,
      status: 'idle',
    }));
  }, []);

  const isRecognizing = state.status === 'listening';

  const statusMessage = useMemo(() => {
    switch (state.status) {
      case 'idle':
        return 'Ready to identify your next song.';
      case 'listening':
        return 'Listening… keep your phone near the music source.';
      case 'match-found':
        return 'Match found. Tap below to open YouTube search results.';
      case 'no-match':
        return 'No match this time. Try again in a quieter environment or get closer to the speaker.';
      case 'error':
        return state.errorMessage ?? 'Something went wrong while identifying the song.';
      default:
        return '';
    }
  }, [state.errorMessage, state.status]);

  return {
    ...state,
    isRecognizing,
    isSupported,
    unsupportedMessage: musicRecognitionUnsupportedMessage,
    statusMessage,
    identifySong,
    playOnYouTube,
    stopListening,
    youtubeSong,
    isYoutubeModalVisible: youtubeSong !== null,
    closeYouTubeModal,
  };
}
