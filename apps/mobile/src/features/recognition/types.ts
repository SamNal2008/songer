export type RecognitionStatus = 'idle' | 'listening' | 'match-found' | 'no-match' | 'error';

export type RecognizedSong = {
  id: string;
  title: string;
  artist: string;
  artworkUrl?: string;
};

export type RecognitionState = {
  status: RecognitionStatus;
  currentMatch: RecognizedSong | null;
  recentMatches: RecognizedSong[];
  errorMessage: string | null;
};
