import type { MetadataRoute } from 'next';
import { LOCALES, USE_CASE_SLUGS, absoluteUrl, DEFAULT_LOCALE } from '@/lib/site';
import { lastModified } from '@/lib/content-dates';
import { BLOG_POSTS } from '@/lib/blog';

export const dynamic = 'force-static';

const ROUTES = [
  '',
  'features',
  'how-to-use',
  'use-cases',
  'script-timer',
  'faq',
  'about',
  'contact',
  'privacy',
  'terms',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
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
        lastModified: lastModified(route),
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
        lastModified: lastModified(path),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  // The blog is English-only for now, so its URLs carry no hreflang alternates —
  // advertising /es/blog/ would point crawlers at a 404.
  entries.push({
    url: absoluteUrl(DEFAULT_LOCALE, 'blog'),
    lastModified: lastModified('blog'),
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  for (const post of BLOG_POSTS) {
    entries.push({
      url: absoluteUrl(DEFAULT_LOCALE, `blog/${post.slug}`),
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
