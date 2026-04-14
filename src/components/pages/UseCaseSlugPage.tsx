import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/marketing/CTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import type { Locale, UseCaseSlug } from '@/lib/site';

interface UseCaseSlugPageProps {
  locale: Locale;
  slug: UseCaseSlug;
}

export async function UseCaseSlugPage({ locale, slug }: UseCaseSlugPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `useCases.items.${slug}` });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const whyItems = t.raw('sections.why.items') as string[];

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav('useCases'), path: 'use-cases' },
          { name: t('title'), path: `use-cases/${slug}` },
        ])}
      />
      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-12 sm:px-6 sm:py-16">
        <section>
          <h2 className="text-2xl font-bold">{t('sections.why.title')}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {whyItems.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-card p-4"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold">{t('sections.setup.title')}</h2>
          <p className="mt-4 text-muted-foreground">{t('sections.setup.body')}</p>
        </section>
      </main>

      <CTA locale={locale} />
    </div>
  );
}
