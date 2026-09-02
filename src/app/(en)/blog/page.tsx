import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/pages/BlogIndexPage';
import { buildMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    locale: DEFAULT_LOCALE,
    path: 'blog',
    localized: false,
    title: 'Teleprompter guides and script-writing advice',
    description:
      'Practical guides to reading on camera: teleprompter setups for video calls, DIY beam-splitter rigs, script writing for the ear, scroll speed, and an honest comparison of the free tools available.',
  });
}

export default function Page() {
  return <BlogIndexPage />;
}
