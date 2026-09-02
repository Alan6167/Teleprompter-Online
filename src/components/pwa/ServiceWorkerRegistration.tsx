'use client';

import { useEffect } from 'react';

/**
 * Registers the offline service worker after the page has settled.
 *
 * Registration is deliberately deferred to the load event: it is never on the critical
 * path for a first read, and a failure here must not surface to the reader — the site
 * simply stays online-only.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Offline support is a bonus; ignore environments that refuse registration.
      });
    };

    if (document.readyState === 'complete') {
      register();
      return;
    }
    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
