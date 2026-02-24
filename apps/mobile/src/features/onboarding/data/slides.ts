export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'capture',
    title: 'Hear it. Capture it.',
    description:
      'Tap once and Improved Shazam listens for the song around you in seconds.',
  },
  {
    id: 'recognize',
    title: 'Instant song recognition',
    description:
      'MVP uses ShazamKit for direct matches with rich song metadata when available.',
  },
  {
    id: 'explore',
    title: 'More ways coming soon',
    description:
      'Humming search and guided discovery are planned next. For now, start with fast identification.',
  },
];
