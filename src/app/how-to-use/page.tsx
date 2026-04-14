import type { Metadata } from 'next';
import { HowToUsePage } from '@/components/pages/HowToUsePage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'how-to-use', titleNamespace: 'howToUse' });
}

export default function Page() {
  return <HowToUsePage locale={DEFAULT_LOCALE} />;
}
