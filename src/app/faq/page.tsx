import type { Metadata } from 'next';
import { FaqPage } from '@/components/pages/FaqPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'faq', titleNamespace: 'faq' });
}

export default function Page() {
  return <FaqPage locale={DEFAULT_LOCALE} />;
}
