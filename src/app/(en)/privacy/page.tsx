import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'privacy', titleNamespace: 'privacy' });
}

export default function Page() {
  return <PrivacyPage locale={DEFAULT_LOCALE} />;
}
