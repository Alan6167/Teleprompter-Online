import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseSlugPage } from '@/components/pages/UseCaseSlugPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE, USE_CASE_SLUGS, type UseCaseSlug } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) notFound();
  return buildMetadata({
    locale: DEFAULT_LOCALE,
    path: `use-cases/${slug}`,
    titleNamespace: `useCases.items.${slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) notFound();
  return <UseCaseSlugPage locale={DEFAULT_LOCALE} slug={slug as UseCaseSlug} />;
}
