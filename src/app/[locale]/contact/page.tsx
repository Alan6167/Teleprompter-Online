import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactPage } from '@/components/pages/ContactPage';
import { buildMetadata } from '@/lib/seo';
import { NON_DEFAULT_LOCALES, type Locale } from '@/lib/site';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) notFound();
  return buildMetadata({ locale: locale as Locale, path: 'contact', titleNamespace: 'contact' });
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) notFound();
  return <ContactPage locale={locale as Locale} />;
}
