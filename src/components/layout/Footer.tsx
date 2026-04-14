import { Mic } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { localePath, type Locale } from '@/lib/site';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background safe-bottom">
      <div className="mx-auto grid max-w-7xl gap-8 px-3 py-10 sm:px-6 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mic className="h-4 w-4" />
            </span>
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
              <a href={localePath(locale, 'faq')} className="hover:underline">
                {t('nav.faq')}
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
