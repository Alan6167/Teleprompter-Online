import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/ContactPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'contact', titleNamespace: 'contact' });
}

export default function Page() {
  return <ContactPage locale={DEFAULT_LOCALE} />;
}
