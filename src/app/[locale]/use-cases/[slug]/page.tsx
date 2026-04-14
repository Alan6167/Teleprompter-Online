import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseSlugPage } from '@/components/pages/UseCaseSlugPage';
import { buildMetadata } from '@/lib/seo';
import { NON_DEFAULT_LOCALES, USE_CASE_SLUGS, type Locale, type UseCaseSlug } from '@/lib/site';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string }> = [];
  for (const locale of NON_DEFAULT_LOCALES) {
    for (const slug of USE_CASE_SLUGS) {
      out.push({ locale, slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) notFound();
  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) notFound();
  return buildMetadata({
    locale: locale as Locale,
    path: `use-cases/${slug}`,
    titleNamespace: `useCases.items.${slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!NON_DEFAULT_LOCALES.includes(locale as Exclude<Locale, 'en'>)) notFound();
  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) notFound();
  return <UseCaseSlugPage locale={locale as Locale} slug={slug as UseCaseSlug} />;
}
