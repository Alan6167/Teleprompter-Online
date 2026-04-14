import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    locale: DEFAULT_LOCALE,
    path: '',
    titleNamespace: 'home',
  });
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale(DEFAULT_LOCALE);
  return <BaseLayout locale={DEFAULT_LOCALE}>{children}</BaseLayout>;
}
