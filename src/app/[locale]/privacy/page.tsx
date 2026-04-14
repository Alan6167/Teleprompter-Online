import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { buildMetadata } from '@/lib/seo';
import { NON_DEFAULT_LOCALES, type Locale } from '@/lib/site';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) notFound();
  return buildMetadata({ locale: locale as Locale, path: 'privacy', titleNamespace: 'privacy' });
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) notFound();
  return <PrivacyPage locale={locale as Locale} />;
}
