import type { MetadataRoute } from 'next';
import { LOCALES, USE_CASE_SLUGS, absoluteUrl, DEFAULT_LOCALE } from '@/lib/site';

export const dynamic = 'force-static';

const ROUTES = ['', 'features', 'how-to-use', 'use-cases', 'faq', 'privacy', 'terms'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const languages: Record<string, string> = {};
      for (const l of LOCALES) {
        languages[l] = absoluteUrl(l, route);
      }
      languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, route);

      entries.push({
        url: absoluteUrl(locale, route),
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.7,
        alternates: { languages },
      });
    }

    for (const slug of USE_CASE_SLUGS) {
      const path = `use-cases/${slug}`;
      const languages: Record<string, string> = {};
      for (const l of LOCALES) {
        languages[l] = absoluteUrl(l, path);
      }
      languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, path);

      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
