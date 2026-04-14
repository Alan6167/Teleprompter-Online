import { Lightbulb } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/marketing/CTA';
import type { Locale } from '@/lib/site';

interface HowToUsePageProps {
  locale: Locale;
}

export async function HowToUsePage({ locale }: HowToUsePageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'howToUse' });
  const steps = t.raw('steps') as Array<{ title: string; body: string }>;
  const tips = t.raw('tips') as string[];

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

      <main className="mx-auto max-w-4xl px-3 py-12 sm:px-6 sm:py-16">
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li
              key={i}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <p className="mt-3 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-2xl border border-border bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('tipsTitle')}</h2>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <CTA locale={locale} />
    </div>
  );
}
