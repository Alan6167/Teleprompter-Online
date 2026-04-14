import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/site';

interface PrivacyPageProps {
  locale: Locale;
}

export async function PrivacyPage({ locale }: PrivacyPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const sections = t.raw('sections') as Array<{ title: string; body: string }>;

  return (
    <div className="bg-background">
      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t('updated', { date: '2026-04-14' })}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-3 py-12 sm:px-6 sm:py-16">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
