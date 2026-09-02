import { ContentPage } from './ContentPage';
import type { Locale } from '@/lib/site';

export async function AboutPage({ locale }: { locale: Locale }) {
  return <ContentPage locale={locale} namespace="about" />;
}
