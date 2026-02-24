const env = process.env;

type IntegrationPlaceholder = {
  name: 'Supabase' | 'Sentry' | 'PostHog';
  envKeys: string[];
  configured: boolean;
};

export const integrationPlaceholders: IntegrationPlaceholder[] = [
  {
    name: 'Supabase',
    envKeys: ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
    configured: Boolean(env.EXPO_PUBLIC_SUPABASE_URL && env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  },
  {
    name: 'Sentry',
    envKeys: ['EXPO_PUBLIC_SENTRY_DSN'],
    configured: Boolean(env.EXPO_PUBLIC_SENTRY_DSN),
  },
  {
    name: 'PostHog',
    envKeys: ['EXPO_PUBLIC_POSTHOG_KEY', 'EXPO_PUBLIC_POSTHOG_HOST'],
    configured: Boolean(env.EXPO_PUBLIC_POSTHOG_KEY && env.EXPO_PUBLIC_POSTHOG_HOST),
  },
];
