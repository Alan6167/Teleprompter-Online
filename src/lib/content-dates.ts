/**
 * When each route's content last actually changed.
 *
 * The sitemap used to stamp every URL with the build time, which told crawlers that all
 * fifty-odd pages changed on every deploy — including deploys that only touched CSS. That
 * dilutes the signal for the pages that really did change, so dates are recorded here by
 * hand and updated alongside the content they describe.
 */

/** Fallback for routes with no explicit entry. */
export const SITE_LAST_UPDATED = '2026-09-02';

export const ROUTE_LAST_MODIFIED: Record<string, string> = {
  '': '2026-09-02',
  features: '2026-09-02',
  'how-to-use': '2026-09-02',
  'use-cases': '2026-09-02',
  faq: '2026-09-02',
  about: '2026-09-02',
  contact: '2026-09-02',
  'script-timer': '2026-09-02',
  blog: '2026-09-02',
  privacy: '2026-09-02',
  terms: '2026-04-14',
};

export function lastModified(route: string): Date {
  return new Date(ROUTE_LAST_MODIFIED[route] ?? SITE_LAST_UPDATED);
}
