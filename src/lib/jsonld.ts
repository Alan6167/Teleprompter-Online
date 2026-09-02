import { SITE_NAME, SITE_URL, absoluteUrl, DEFAULT_LOCALE, type Locale } from './site';
import type { BlogPost } from './blog';

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

/** Structured data for a standalone browser tool such as the script timer. */
export function webApplicationJsonLd(
  locale: Locale,
  { name, description, path }: { name: string; description: string; path: string }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: absoluteUrl(locale, path),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** Article markup for a single blog post. */
export function blogPostJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: absoluteUrl(DEFAULT_LOCALE, `blog/${post.slug}`),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(DEFAULT_LOCALE, `blog/${post.slug}`),
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: DEFAULT_LOCALE,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

/** Blog markup listing every published post. */
export function blogIndexJsonLd(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} guides`,
    url: absoluteUrl(DEFAULT_LOCALE, 'blog'),
    inLanguage: DEFAULT_LOCALE,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: absoluteUrl(DEFAULT_LOCALE, `blog/${post.slug}`),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    })),
  };
}
