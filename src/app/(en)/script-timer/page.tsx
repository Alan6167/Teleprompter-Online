import type { Metadata } from 'next';
import { ScriptTimerPage } from '@/components/pages/ScriptTimerPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: DEFAULT_LOCALE, path: 'script-timer', titleNamespace: 'scriptTimer' });
}

export default function Page() {
  return <ScriptTimerPage locale={DEFAULT_LOCALE} />;
}
