import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/site';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background safe-bottom">
      <div className="mx-auto grid max-w-7xl gap-8 px-3 py-10 sm:px-6 md:grid-cols-5">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <Logo className="h-8 w-8 rounded-lg" />
            <span>{t('common.brand')}</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{t('footer.tagline')}</p>
          <p className="text-xs text-muted-foreground">{t('footer.madeWith')}</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('footer.product')}
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={localePath(locale, 'features')} className="hover:underline">
                {t('nav.features')}
              </a>
            </li>
            <li>
              <a href={localePath(locale, 'how-to-use')} className="hover:underline">
                {t('nav.howToUse')}
              </a>
            </li>
            <li>
              <a href={localePath(locale, 'use-cases')} className="hover:underline">
                {t('nav.useCases')}
              </a>
            </li>
            <li>
              <a href={localePath(locale, 'script-timer')} className="hover:underline">
                {t('nav.scriptTimer')}
              </a>
            </li>
            <li>
              <a href={localePath(locale, 'faq')} className="hover:underline">
                {t('nav.faq')}
              </a>
            </li>
            {/* The blog is English-only, so it is only linked from English pages. */}
            {locale === DEFAULT_LOCALE && (
              <li>
                <a href={localePath(locale, 'blog')} className="hover:underline">
                  {t('nav.blog')}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('footer.company')}
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={localePath(locale, 'about')} className="hover:underline">
                {t('nav.about')}
              </a>
            </li>
            <li>
              <a href={localePath(locale, 'contact')} className="hover:underline">
                {t('nav.contact')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('footer.legal')}
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={localePath(locale, 'privacy')} className="hover:underline">
                {t('footer.privacy')}
              </a>
            </li>
            <li>
              <a href={localePath(locale, 'terms')} className="hover:underline">
                {t('footer.terms')}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-3 py-4 text-center text-xs text-muted-foreground sm:px-6">
          {t('footer.copyright', { year })}
        </div>
      </div>
    </footer>
  );
}
