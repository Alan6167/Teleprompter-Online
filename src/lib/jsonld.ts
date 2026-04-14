import { SITE_NAME, SITE_URL, absoluteUrl, type Locale } from './site';

export function softwareApplicationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    url: absoluteUrl(locale),
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Teleprompter',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Modern browser (Chrome, Safari, Firefox, Edge).',
    description:
      'A free online teleprompter that runs in your browser. Adjustable speed and font, mirror mode, fullscreen and keyboard shortcuts. No signup, no install.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: locale,
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  };
}
