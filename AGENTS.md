# AGENTS.md

## 1. Product Overview — "Songer”

Songer is a mobile application that allows users to:

1. Record ambient music and identify the song title.
2. Fallback to humming-based search if the song is not recognized.
3. If no exact match is found:
   - Suggest similar songs using an LLM.
   - Guide the user through structured questions.
   - Provide a “tinder-like” directional exploration interface to converge toward the intended song.
4. Embed a playable version of the identified song (YouTube initially, Spotify selectable later in settings).

The objective is to deliver:
- High-quality UX (Spotify/Airbnb-level polish).
- Strict cost control.
- Strong security and no secret leakage.
- Minimal operational complexity.

---

## 2. High-Level Functional Flow

### 2.1 Song Recognition (Primary Path)

1. User taps “Identify Song”.
2. App records audio sample.
3. App sends request to Google-based music recognition API (initial implementation).
4. If match found:
   - Display song metadata (title, artist, album, artwork).
   - Embed YouTube player.
   - Allow user to open externally.

---

### 2.2 Humming Fallback

If no direct match:
1. User is prompted to hum the melody.
2. Audio is sent to Google humming-based search (initial version).
3. If match found:
   - Same result flow as above.

Later iteration:
- Replace or augment with internal Python microservice for melody similarity scoring.

---

### 2.3 Intelligent Suggestion Mode

If no match from Google:

1. LLM generates:
   - Top N similar songs based on:
     - Genre
     - Era
     - Mood
     - Lyrics fragments (if any)
     - Tempo
2. User answers guided questions.
3. System refines results.
4. User navigates via 6-direction exploration interface (tinder-like directional UI).
5. LLM continuously recalculates closest matches.

---

## 3. Technical Architecture

ALWAYS :
- USE WEBSEARCH AND CONTEXT7 MCP TO FETCH LATEST DOCUMENTATION AND CODE EXAMPLES
- USE THE LATEST STABLE VERSIONS OF THE TECHNOLOGIES
- USE CLI FROM DOCUMENTATION INSTEAD OF CREATING CONFIGURATION FILE DIRECTLY

### 3.1 Frontend
- Expo (latest stable SDK)
- React Native
- TypeScript
- Clean component architecture
- No unnecessary abstraction
- Performance-first mindset

### 3.2 Backend
- Supabase:
  - Auth
  - Database
  - Logging
- PostHog:
  - User analytics
- Sentry:
  - Error monitoring

### 3.3 Future Service
- Python microservice:
  - Melody similarity
  - Humming improvement
  - Vector comparison

---

## 4. Non-Functional Requirements

### 4.1 Cost Guardrails
- No unnecessary model calls.
- Cache LLM outputs when possible.
- Rate limit endpoints.
- Avoid expensive embeddings unless justified.

### 4.2 Security
- No secrets committed.
- All API keys via GitHub Secrets.
- No raw audio stored unless explicitly required.
- Minimize PII storage.

### 4.3 Reliability
- Prefer official Expo/EAS tooling.
- Avoid unstable libraries.
- Minimize native modules.

---

## 5. CI/CD Strategy

- GitHub Actions
- EAS Update:
  - PR preview updates
  - Production channel for main branch
- Optional EAS Build for store releases
- No manual deployment steps
- CI must be green before merge

---

## 6. Agent Operating Rules

All agents (Codex or others) must:

1. Never commit secrets.
2. Prefer official Expo/EAS/Supabase tooling.
3. Avoid over-engineering.
4. Ship minimal viable implementations first.
5. Keep PRs small and focused.
6. Ensure:
   - Commit respect conventional commits (feat, fix, test, chore)
   - Changes implemented
   - Committed
   - PR opened
   - CI green

---

## 7. Definition of Done (Per Task)

A task is considered complete when:

- Implementation is finished.
- Test are written and pass.
- Changes are committed.
- Local build is green and app has been tested through Playwright MCP on Web version at least
- PR is opened or updated.
- CI passes (lint/build).
- If deploy-related:
  - EAS Update or Build artifact produced.
  

---

## 8. UX Bar

- Must feel premium.
- Zero clutter.
- Fast transitions.
- Clear states (loading / error / empty).
- Delight without gimmicks.


## 9. Code guidelines and examples

### 9.1 Test should be on the behavior of the user not on the implementation details.
Example :
```ts

it('should display the song title when the song is identified', () => {
  // Given
it('should display the song title when the song is identified', () => {
  // Given
  const mockSong = { title: 'Bohemian Rhapsody', artist: 'Queen' };
  render(<SongResult song={mockSong} />);

  // When
  // Component renders with the song data

  // Then
  expect(screen.getByText('Bohemian Rhapsody')).toBeVisible();
  expect(screen.getByText('Queen')).toBeVisible();
});

it('should show loading state while identifying song', () => {
  // Given
  render(<SongIdentifier isLoading={true} />);

  // Then
  expect(screen.getByTestId('loading-indicator')).toBeVisible();
  expect(screen.queryByText('Identify Song')).not.toBeVisible();
});

it('should allow user to retry when identification fails', async () => {
  // Given
  const onRetry = jest.fn();
  render(<SongResult error="No match found" onRetry={onRetry} />);

  // When
  await userEvent.press(screen.getByRole('button', { name: 'Try Again' }));

  // Then
  expect(onRetry).toHaveBeenCalledTimes(1);
});

### 9.2 Implementation should be split between components and services

**❌ Bad Example - Logic mixed with UI:**
```ts
// screens/SongIdentifierScreen.tsx - BAD
export function SongIdentifierScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);

  const identifySong = async () => {
    setIsRecording(true);
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission denied');
      
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync();
      await recording.startAsync();
      await new Promise(resolve => setTimeout(resolve, 5000));
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      const response = await fetch('https://api.example.com/identify', {
        method: 'POST',
        body: await FileSystem.readAsStringAsync(uri, { encoding: 'base64' }),
      });
      const result = await response.json();
      setSong(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <View>
      <Button onPress={identifySong} title="Identify" />
      {song && <Text>{song.title}</Text>}
    </View>
  );
}
```

**✅ Good Example - Separated concerns:**
```ts
// services/audioService.ts
export const audioService = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  },

  async recordAudio(durationMs: number): Promise<string> {
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync();
    await recording.startAsync();
    await new Promise(resolve => setTimeout(resolve, durationMs));
    await recording.stopAndUnloadAsync();
    return recording.getURI() ?? '';
  },
};

// services/songIdentificationService.ts
export const songIdentificationService = {
  async identify(audioUri: string): Promise<Song> {
    const audioData = await FileSystem.readAsStringAsync(audioUri, { encoding: 'base64' });
    const response = await fetch('https://api.example.com/identify', {
      method: 'POST',
      body: JSON.stringify({ audio: audioData }),
    });
    if (!response.ok) throw new Error('Identification failed');
    return response.json();
  },
};

// hooks/useSongIdentification.ts
export function useSongIdentification() {
  const [state, setState] = useState<{
    isRecording: boolean;
    song: Song | null;
    error: string | null;
  }>({ isRecording: false, song: null, error: null });

  const identifySong = useCallback(async () => {
    setState(s => ({ ...s, isRecording: true, error: null }));
    try {
      const hasPermission = await audioService.requestPermissions();
      if (!hasPermission) throw new Error('Permission denied');
      
      const audioUri = await audioService.recordAudio(5000);
      const song = await songIdentificationService.identify(audioUri);
      setState(s => ({ ...s, song, isRecording: false }));
    } catch (e) {
      setState(s => ({ ...s, error: e.message, isRecording: false }));
    }
  }, []);

  return { ...state, identifySong };
}

// screens/SongIdentifierScreen.tsx - GOOD
export function SongIdentifierScreen() {
  const { isRecording, song, error, identifySong } = useSongIdentification();

  return (
    <View>
      <IdentifyButton onPress={identifySong} isLoading={isRecording} />
      {error && <ErrorMessage message={error} />}
      {song && <SongResult song={song} />}
    </View>
  );
}
```

### 9.3 Use hooks to manage state and side effects

- All stateful logic and side effects must live in **custom hooks**, not in components.
- Hooks encapsulate a single responsibility: one hook = one concern.
- Components consume hooks and render UI — nothing else.
- Prefer `useCallback` and `useMemo` to stabilize references passed as props.
- Never call `setState` inside a render body — always inside effects or callbacks.

**❌ Bad Example - State logic inside component:**
```ts
export function HummingScreen() {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<Song[]>([]);

  useEffect(() => {
    if (isListening) {
      audioService.startListening().then(setResults);
    }
  }, [isListening]);

  return (
    <View>
      <Button onPress={() => setIsListening(true)} title="Start Humming" />
      {results.map(song => <SongCard key={song.id} song={song} />)}
    </View>
  );
}
```

**✅ Good Example - Hook owns the logic:**
```ts
// hooks/useHumming.ts
export function useHumming() {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<Song[]>([]);

  const startListening = useCallback(async () => {
    setIsListening(true);
    const songs = await audioService.startListening();
    setResults(songs);
    setIsListening(false);
  }, []);

  return { isListening, results, startListening };
}

// screens/HummingScreen.tsx
export function HummingScreen() {
  const { isListening, results, startListening } = useHumming();

  return (
    <View>
      <HumButton onPress={startListening} isLoading={isListening} />
      <SongList songs={results} />
    </View>
  );
}
```

### 9.4 Minimize providers to avoid unnecessary re-renders

- Do **not** wrap the entire app in multiple context providers unless strictly necessary.
- Prefer **hooks + services** over context for data that doesn't need to be globally reactive.
- When a provider is needed, **split contexts** by concern so updating one value doesn't re-render unrelated consumers.
- Use `useMemo` on provider values to prevent reference changes on every render.

**❌ Bad Example - Single monolithic provider:**
```ts
// context/AppProvider.tsx - BAD
export function AppProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState('dark');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, songs, setSongs, isRecording, setIsRecording }}>
      {children}
    </AppContext.Provider>
  );
}
```

**✅ Good Example - Split contexts + memoized values:**
```ts
// context/AuthProvider.tsx
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hooks/useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// For non-global state, prefer a hook + service instead of a provider:
// hooks/useRecording.ts
export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const start = useCallback(() => { /* ... */ }, []);
  const stop = useCallback(() => { /* ... */ }, []);
  return { isRecording, start, stop };
}
```

### 9.5 Component architecture: Atoms & Molecules (shared reusable components)

- Follow an **Atomic Design** approach for shared UI components:
  - **Atoms**: smallest indivisible UI elements (buttons, icons, text, inputs).
  - **Molecules**: small groups of atoms working together (search bar, song card, error banner).
- Store shared components in `src/Shared/components/atoms/` and `src/Shared/components/molecules/`.
- Feature-specific components stay **inside the feature folder**.
- Every shared component must be **independently testable** and **stateless** (props-driven).

**Folder structure:**
```
src/
├── Shared/
│   └── components/
│       ├── atoms/
│       │   ├── Button.tsx
│       │   ├── Button.test.tsx
│       │   ├── Icon.tsx
│       │   ├── Icon.test.tsx
│       │   ├── Text.tsx
│       │   └── Text.test.tsx
│       └── molecules/
│           ├── SongCard.tsx
│           ├── SongCard.test.tsx
│           ├── SearchBar.tsx
│           └── SearchBar.test.tsx
├── SongIdentification/
│   ├── IdentifyButton.tsx        # feature-specific component
│   ├── IdentifyButton.test.tsx
│   └── ...
```

**✅ Good Example - Atom:**
```ts
// src/Shared/components/atoms/Button.tsx
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', isLoading = false, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn('rounded-xl px-6 py-3 items-center', variantStyles[variant])}
    >
      {isLoading ? <ActivityIndicator /> : <Text className="text-white font-semibold">{label}</Text>}
    </Pressable>
  );
}
```

**✅ Good Example - Molecule:**
```ts
// src/Shared/components/molecules/SongCard.tsx
interface SongCardProps {
  song: Song;
  onPress?: () => void;
}

export function SongCard({ song, onPress }: SongCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center p-3 rounded-2xl bg-neutral-900">
      <Image source={{ uri: song.artworkUrl }} className="w-12 h-12 rounded-lg" />
      <View className="ml-3 flex-1">
        <Text className="text-white font-bold">{song.title}</Text>
        <Text className="text-neutral-400 text-sm">{song.artist}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#666" />
    </Pressable>
  );
}
```

### 9.6 Tailwind CSS: shared utility classes

- Use **NativeWind** (Tailwind for React Native) for all styling.
- For repeated style patterns, create **shared className constants** rather than duplicating long class strings.
- Keep shared class definitions in `src/Shared/styles/`.
- Never use inline `style` objects when Tailwind can express the same thing.

**✅ Good Example - Shared classes:**
```ts
// src/Shared/styles/classes.ts
export const cardBase = 'rounded-2xl bg-neutral-900 p-4';
export const textPrimary = 'text-white font-semibold text-base';
export const textSecondary = 'text-neutral-400 text-sm';
export const screenContainer = 'flex-1 bg-black px-4 pt-safe';
export const pressableHover = 'active:opacity-70';
```

```ts
// Usage in a component
import { cardBase, textPrimary, textSecondary } from '@/Shared/styles/classes';

export function SongCard({ song }: SongCardProps) {
  return (
    <View className={cn(cardBase, 'flex-row items-center')}>
      <Text className={textPrimary}>{song.title}</Text>
      <Text className={textSecondary}>{song.artist}</Text>
    </View>
  );
}
```

### 9.7 Small, independent, testable components

- Every component should do **one thing**.
- If a component grows beyond ~50 lines of JSX, **extract sub-components**.
- Props should be **explicit and typed** — no spreading unknown objects.
- Each component must be testable in isolation with mocked props.

**❌ Bad Example - Monolithic component:**
```ts
export function SongResultScreen({ song, relatedSongs, onPlay, onShare, onSave, onRetry, error, isLoading }: Props) {
  return (
    <ScrollView>
      {isLoading && <ActivityIndicator />}
      {error && <Text>{error}</Text>}
      {song && (
        <>
          <Image source={{ uri: song.artwork }} />
          <Text>{song.title}</Text>
          <Text>{song.artist}</Text>
          <Button onPress={onPlay} title="Play" />
          <Button onPress={onShare} title="Share" />
          <Button onPress={onSave} title="Save" />
          <FlatList data={relatedSongs} renderItem={({ item }) => (
            <View><Text>{item.title}</Text></View>
          )} />
        </>
      )}
    </ScrollView>
  );
}
```

**✅ Good Example - Composed from small components:**
```ts
// Each sub-component is independently testable
export function SongResultScreen() {
  const { song, relatedSongs, error, isLoading, play, share, save, retry } = useSongResult();

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorBanner message={error} onRetry={retry} />;
  if (!song) return null;

  return (
    <ScrollView className={screenContainer}>
      <SongHeader song={song} />
      <SongActions onPlay={play} onShare={share} onSave={save} />
      <RelatedSongsList songs={relatedSongs} />
    </ScrollView>
  );
}
```

### 9.8 Page components: test happy path only

- **Page/screen components** are integration-level: they compose hooks and sub-components.
- Test only the **happy path** (main success scenario) for pages.
- Edge cases, error states, and loading states are tested at the **sub-component** and **hook** level.
- This keeps page tests fast, stable, and focused.

**✅ Good Example - Page test (happy path only):**
```ts
// screens/SongIdentifierScreen.test.tsx
describe('SongIdentifierScreen', () => {
  it('should render the identify button and display result on success', async () => {
    // Given
    const mockSong = { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', artworkUrl: 'https://img.com/br.jpg' };
    jest.spyOn(songIdentificationService, 'identify').mockResolvedValue(mockSong);
    jest.spyOn(audioService, 'requestPermissions').mockResolvedValue(true);
    jest.spyOn(audioService, 'recordAudio').mockResolvedValue('file:///audio.m4a');

    render(<SongIdentifierScreen />);

    // When
    await userEvent.press(screen.getByRole('button', { name: 'Identify Song' }));

    // Then
    expect(await screen.findByText('Bohemian Rhapsody')).toBeVisible();
    expect(screen.getByText('Queen')).toBeVisible();
  });
});
```

**Edge cases are tested at lower levels:**
```ts
// hooks/useSongIdentification.test.ts
describe('useSongIdentification', () => {
  it('should set error when permissions are denied', async () => { /* ... */ });
  it('should set error when identification fails', async () => { /* ... */ });
  it('should reset error on new attempt', async () => { /* ... */ });
});

// components/atoms/Button.test.tsx
describe('Button', () => {
  it('should show loading indicator when isLoading is true', () => { /* ... */ });
  it('should be disabled when disabled prop is true', () => { /* ... */ });
});
