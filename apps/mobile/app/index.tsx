import { useCallback } from 'react';

import { useRouter } from 'expo-router';

import { OnboardingScreen } from '../src/features/onboarding/components/OnboardingScreen';

export default function IndexScreen() {
  const router = useRouter();

  const finishOnboarding = useCallback(() => {
    router.replace('/home');
  }, [router]);

  return <OnboardingScreen onSkip={finishOnboarding} onGetStarted={finishOnboarding} />;
}
