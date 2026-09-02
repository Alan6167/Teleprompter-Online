import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'about', titleNamespace: 'about' });
}

export default function Page() {
  return <AboutPage locale={DEFAULT_LOCALE} />;
}
