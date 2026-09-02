import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlternativePage } from '@/components/pages/AlternativePage';
import { buildMetadata } from '@/lib/seo';
import { ALTERNATIVE_SLUGS, getAlternative } from '@/lib/alternatives';
import { DEFAULT_LOCALE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return ALTERNATIVE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = getAlternative(slug);
  if (!item) notFound();
  return buildMetadata({
    locale: DEFAULT_LOCALE,
    path: `alternatives/${slug}`,
    localized: false,
    title: item.title,
    description: item.description,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return <AlternativePage slug={slug} />;
}
