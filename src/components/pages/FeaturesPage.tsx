import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/marketing/CTA';
import type { Locale } from '@/lib/site';

interface FeaturesPageProps {
  locale: Locale;
}

const SECTION_KEYS = ['prompter', 'typography', 'controls', 'scripts', 'platform'] as const;

export async function FeaturesPage({ locale }: FeaturesPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'features' });

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

      <main className="mx-auto max-w-5xl px-3 py-12 sm:px-6 sm:py-16">
        <div className="space-y-12">
          {SECTION_KEYS.map((sectionKey) => {
            const items = t.raw(`sections.${sectionKey}.items`) as string[];
            return (
              <section key={sectionKey}>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {t(`sections.${sectionKey}.title`)}
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {items.map((item, i) => (
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
            );
          })}
        </div>
      </main>

      <CTA locale={locale} />
    </div>
  );
}
