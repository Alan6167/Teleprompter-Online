import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ScriptTimer } from '@/components/tools/ScriptTimer';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqJsonLd, webApplicationJsonLd } from '@/lib/jsonld';
import type { Locale } from '@/lib/site';

export async function ScriptTimerPage({ locale }: { locale: Locale }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'scriptTimer' });
  const sections = t.raw('sections') as Array<{ title: string; body: string }>;
  const faqItems = t.raw('faq') as Array<{ q: string; a: string }>;

  return (
    <div className="bg-background">
      <JsonLd
        data={[
          webApplicationJsonLd(locale, {
            name: t('title'),
            description: t('meta.description'),
            path: 'script-timer',
          }),
          faqJsonLd(faqItems),
        ]}
      />

      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-12 sm:px-6 sm:py-16">
        <ScriptTimer locale={locale} />

        <div className="mx-auto mt-16 max-w-3xl space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <h2 className="text-2xl font-bold">{t('faqTitle')}</h2>
          <FAQAccordion items={faqItems} />
        </div>
      </main>
    </div>
  );
}
