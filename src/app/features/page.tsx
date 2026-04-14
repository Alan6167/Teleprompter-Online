import type { Metadata } from 'next';
import { FeaturesPage } from '@/components/pages/FeaturesPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'features', titleNamespace: 'features' });
}

export default function Page() {
  return <FeaturesPage locale={DEFAULT_LOCALE} />;
}
