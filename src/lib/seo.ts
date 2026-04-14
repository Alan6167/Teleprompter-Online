import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  SITE_URL,
  SITE_NAME,
  LOCALES,
  DEFAULT_LOCALE,
  absoluteUrl,
  type Locale,
} from './site';

interface BuildMetadataArgs {
  locale: Locale;
  path?: string;
  titleKey?: string;
  descriptionKey?: string;
  titleNamespace?: string;
  title?: string;
  description?: string;
}

/**
 * Build a full per-locale Metadata object with canonical + hreflang alternates.
 */
export async function buildMetadata({
  locale,
  path = '',
  titleKey = 'meta.title',
  descriptionKey = 'meta.description',
  titleNamespace,
  title,
  description,
}: BuildMetadataArgs): Promise<Metadata> {
  let resolvedTitle = title;
  let resolvedDescription = description;

  if (!resolvedTitle || !resolvedDescription) {
    const t = await getTranslations({ locale, namespace: titleNamespace });
    if (!resolvedTitle) resolvedTitle = t(titleKey);
    if (!resolvedDescription) resolvedDescription = t(descriptionKey);
  }

  const canonical = absoluteUrl(locale, path);

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = absoluteUrl(l, path);
  }
  languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, path);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description: resolvedDescription,
      locale,
      images: [
        {
          url: '/og-default.png',
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: ['/og-default.png'],
    },
  };
}
