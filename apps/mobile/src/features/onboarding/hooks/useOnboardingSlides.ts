import { useCallback, useMemo, useState } from 'react';

import { onboardingSlides } from '../data/slides';

export function useOnboardingSlides() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = useMemo(() => onboardingSlides[currentIndex], [currentIndex]);
  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    slides: onboardingSlides,
    currentSlide,
    currentIndex,
    isLastSlide,
    setIndex,
  };
}
