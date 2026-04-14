import type { Metadata } from 'next';
import { TermsPage } from '@/components/pages/TermsPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'terms', titleNamespace: 'terms' });
}

export default function Page() {
  return <TermsPage locale={DEFAULT_LOCALE} />;
}
