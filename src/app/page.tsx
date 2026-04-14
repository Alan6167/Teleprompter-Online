import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: '', titleNamespace: 'home' });
}

export default function Page() {
  return <HomePage locale={DEFAULT_LOCALE} />;
}
