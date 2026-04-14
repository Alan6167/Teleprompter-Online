import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { buildMetadata } from '@/lib/seo';
import { NON_DEFAULT_LOCALES, type Locale } from '@/lib/site';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) {
    notFound();
  }
  return buildMetadata({
    locale: locale as Locale,
    path: '',
    titleNamespace: 'home',
  });
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <>
      {/* Root layout can only render <html lang="en"> once. Sync the DOM attribute
          to the active locale ASAP (before React hydration) so assistive tech and
          browser UI (spellcheck, translation) pick the right language. Crawlers get
          the correct signal via hreflang alternates. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};`,
        }}
      />
      <BaseLayout locale={locale as Locale}>{children}</BaseLayout>
    </>
  );
}
