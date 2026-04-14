import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { TeleprompterApp } from '@/components/teleprompter/TeleprompterApp';
import { Intro } from '@/components/marketing/Intro';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { UseCaseCards } from '@/components/marketing/UseCaseCards';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Tips } from '@/components/marketing/Tips';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { CTA } from '@/components/marketing/CTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { softwareApplicationJsonLd, faqJsonLd } from '@/lib/jsonld';
import type { Locale } from '@/lib/site';

interface HomePageProps {
  locale: Locale;
}

export async function HomePage({ locale }: HomePageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const faqItems = t.raw('home.faq.items') as Array<{ q: string; a: string }>;

  return (
    <>
      <JsonLd data={[softwareApplicationJsonLd(locale), faqJsonLd(faqItems)]} />

      {/* Above-the-fold: teleprompter + inline hero copy */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-2 pb-4 pt-3 sm:px-6">
          <TeleprompterApp />
        </div>
      </section>

      {/* Hero / H1 below the fold for SEO */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <div className="mb-3 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {t('home.hero.eyebrow')}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t('home.hero.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {t('home.hero.subtitle')}
          </p>
        </div>
      </section>

      <Intro />
      <FeatureGrid />
      <UseCaseCards locale={locale} />
      <HowItWorks />
      <Tips />
      <FAQAccordion items={faqItems} title={t('home.faq.title')} />
      <CTA locale={locale} />
    </>
  );
}
