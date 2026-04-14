import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Teleprompter',
    description:
      'A free online teleprompter that runs in your browser. Adjustable speed and font, mirror mode, fullscreen and keyboard shortcuts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1e',
    theme_color: '#0a0f1e',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
