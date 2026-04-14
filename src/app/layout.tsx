import type { Viewport } from 'next';
import { Analytics } from '@/components/analytics/Analytics';
import { DEFAULT_LOCALE } from '@/lib/site';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1e' },
  ],
};

/**
 * Root layout — intentionally minimal.
 *
 * Per-locale chrome (Header, Footer, NextIntlClientProvider, ThemeProvider, JSON-LD) is
 * rendered by the locale-specific layouts at:
 *   - `src/app/(en)/layout.tsx`      for English at root
 *   - `src/app/[locale]/layout.tsx`  for es/pt/fr/de/it
 *
 * We set `lang="en"` here as a default (server-side) because the root layout cannot know
 * the locale. Non-English pages override the `<html lang>` at runtime via a small script —
 * or rely on the `<link rel="alternate" hreflang>` tags for correctness.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <body className="min-h-[100dvh] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
