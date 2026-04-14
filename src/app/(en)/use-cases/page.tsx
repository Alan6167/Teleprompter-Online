import type { Metadata } from 'next';
import { UseCasesIndexPage } from '@/components/pages/UseCasesIndexPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'use-cases', titleNamespace: 'useCases' });
}

export default function Page() {
  return <UseCasesIndexPage locale={DEFAULT_LOCALE} />;
}
