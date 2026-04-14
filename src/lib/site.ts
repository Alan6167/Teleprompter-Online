export const SITE_URL = 'https://teleprompteronline.net';
export const SITE_NAME = 'Teleprompter Online';

export const LOCALES = ['en', 'es', 'pt', 'fr', 'de', 'it'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const NON_DEFAULT_LOCALES: Exclude<Locale, 'en'>[] = ['es', 'pt', 'fr', 'de', 'it'];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
};

export const USE_CASE_SLUGS = [
  'youtubers',
  'podcasters',
  'presenters',
  'teachers',
  'streamers',
] as const;
export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

/**
 * Build the canonical URL path for a given locale + path segment.
 * EN is served at the root (no prefix); others are under /<locale>/.
 */
export function localePath(locale: Locale, path: string = ''): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const suffix = cleanPath ? `/${cleanPath}/` : '/';
  return `${prefix}${suffix}`;
}

export function absoluteUrl(locale: Locale, path: string = ''): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}
