import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { AppButton } from '../../../Shared/components/atoms/AppButton';

import { useOnboardingSlides } from '../hooks/useOnboardingSlides';

type OnboardingScreenProps = {
  onSkip: () => void;
  onGetStarted: () => void;
};

const { width } = Dimensions.get('window');

export function OnboardingScreen({ onSkip, onGetStarted }: OnboardingScreenProps) {
  const { currentIndex, isLastSlide, setIndex, slides } = useOnboardingSlides();

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(nextIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Improved Shazam</Text>
        <Text style={styles.subtitle}>Find songs fast now, discover deeper soon.</Text>
      </View>

      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === currentIndex ? styles.dotActive : null]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <AppButton label="Skip" variant="secondary" onPress={onSkip} style={styles.actionButton} />
          <AppButton
            label={isLastSlide ? 'Get started' : 'Continue'}
            onPress={onGetStarted}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingBottom: 36,
    paddingTop: 72,
  },
  header: {
    gap: 8,
    paddingHorizontal: 24,
  },
  brand: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 22,
  },
  slide: {
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
    width,
  },
  slideTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  slideDescription: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    gap: 20,
    paddingHorizontal: 24,
  },
  dots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    backgroundColor: '#CBD5E1',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: '#2563EB',
    width: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
