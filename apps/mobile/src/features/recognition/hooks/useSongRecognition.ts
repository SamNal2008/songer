import { useCallback, useMemo, useState } from 'react';

import { shazamRecognitionService } from '../services/shazamRecognitionService';
import type { RecognitionState, RecognizedSong } from '../types';

const INITIAL_STATE: RecognitionState = {
  status: 'idle',
  currentMatch: null,
  recentMatches: [],
  errorMessage: null,
};

export function useSongRecognition() {
  const [state, setState] = useState<RecognitionState>(INITIAL_STATE);
  const [youtubeQuery, setYoutubeQuery] = useState<string | null>(null);

  const identifySong = useCallback(async () => {
    setState((previousState) => ({
      ...previousState,
      status: 'listening',
      currentMatch: null,
      errorMessage: null,
    }));

    try {
      const match = await shazamRecognitionService.identifySong();

      if (!match) {
        setState((previousState) => ({
          ...previousState,
          status: 'no-match',
          currentMatch: null,
          errorMessage: null,
        }));
        return;
      }

      setState((previousState) => ({
        status: 'match-found',
        currentMatch: match,
        recentMatches: shazamRecognitionService.mergeRecentMatches(previousState.recentMatches, match),
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
    setYoutubeQuery(`${song.artist} - ${song.title}`);
  }, []);

  const closeYouTubeModal = useCallback(() => {
    setYoutubeQuery(null);
  }, []);

  const stopListening = useCallback(() => {
    shazamRecognitionService.stopListening();

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
        return 'No match found this time. Try again in a quieter environment.';
      case 'error':
        return state.errorMessage ?? 'Something went wrong while identifying the song.';
      default:
        return '';
    }
  }, [state.errorMessage, state.status]);

  return {
    ...state,
    isRecognizing,
    statusMessage,
    identifySong,
    playOnYouTube,
    stopListening,
    youtubeQuery,
    closeYouTubeModal,
  };
}
