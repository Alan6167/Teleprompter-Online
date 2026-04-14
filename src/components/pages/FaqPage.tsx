import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { CTA } from '@/components/marketing/CTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqJsonLd } from '@/lib/jsonld';
import type { Locale } from '@/lib/site';

interface FaqPageProps {
  locale: Locale;
}

export async function FaqPage({ locale }: FaqPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const items = t.raw('home.faq.items') as Array<{ q: string; a: string }>;

  return (
    <div className="bg-background">
      <JsonLd data={faqJsonLd(items)} />
      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t('faq.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>
      </header>
      <FAQAccordion items={items} />
      <CTA locale={locale} />
    </div>
  );
}
