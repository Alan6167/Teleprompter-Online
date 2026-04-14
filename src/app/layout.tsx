import type { Metadata, Viewport } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    locale: DEFAULT_LOCALE,
    path: '',
    titleNamespace: 'home',
  });
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1e' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale(DEFAULT_LOCALE);
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <body>
        <BaseLayout locale={DEFAULT_LOCALE}>{children}</BaseLayout>
      </body>
    </html>
  );
}
