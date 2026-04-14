import { getTranslations, setRequestLocale } from 'next-intl/server';
import { UseCaseCards } from '@/components/marketing/UseCaseCards';
import { CTA } from '@/components/marketing/CTA';
import type { Locale } from '@/lib/site';

interface UseCasesIndexPageProps {
  locale: Locale;
}

export async function UseCasesIndexPage({ locale }: UseCasesIndexPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'useCases' });

  return (
    <div className="bg-background">
      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </header>
      <UseCaseCards locale={locale} />
      <CTA locale={locale} />
    </div>
  );
}
