import { Check, Gauge, Type as TypeIcon, Palette } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/marketing/CTA';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { USE_CASE_SLUGS, localePath, type Locale, type UseCaseSlug } from '@/lib/site';

interface UseCaseSlugPageProps {
  locale: Locale;
  slug: UseCaseSlug;
}

export async function UseCaseSlugPage({ locale, slug }: UseCaseSlugPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `useCases.items.${slug}` });
  const tShared = await getTranslations({ locale, namespace: 'useCases' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const intro = t.raw('intro') as string[];
  const whyItems = t.raw('sections.why.items') as string[];
  const faqItems = t.raw('faq') as Array<{ q: string; a: string }>;

  // Three neighbours keep every use case one click from the others without turning the
  // page into a link farm.
  const related = USE_CASE_SLUGS.filter((s) => s !== slug).slice(0, 3);

  return (
    <div className="bg-background">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tNav('useCases'), path: 'use-cases' },
            { name: t('title'), path: `use-cases/${slug}` },
          ]),
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

      <main className="mx-auto max-w-4xl px-3 py-12 sm:px-6 sm:py-16">
        <div className="space-y-5 text-lg leading-8">
          {intro.map((paragraph, i) => (
            <p key={i} className={i === 0 ? undefined : 'text-muted-foreground'}>
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">{t('sections.why.title')}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {whyItems.map((item, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">{tShared('recommended.title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('recommended.summary')}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <SettingCard
              Icon={Gauge}
              label={tShared('recommended.speed')}
              value={t('recommended.speed')}
            />
            <SettingCard
              Icon={TypeIcon}
              label={tShared('recommended.fontSize')}
              value={t('recommended.fontSize')}
            />
            <SettingCard
              Icon={Palette}
              label={tShared('recommended.display')}
              value={t('recommended.display')}
            />
          </dl>
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold">{t('sections.setup.title')}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{t('sections.setup.body')}</p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">{tShared('faqTitle')}</h2>
          <FAQAccordion items={faqItems} />
        </section>

        <section className="mt-4 border-t border-border pt-10">
          <h2 className="text-lg font-semibold">{tShared('relatedTitle')}</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((s) => (
              <li key={s}>
                <a
                  href={localePath(locale, `use-cases/${s}`)}
                  className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {tShared(`items.${s}.title`)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <CTA locale={locale} />
    </div>
  );
}

function SettingCard({
  Icon,
  label,
  value,
}: {
  Icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6">{value}</dd>
    </div>
  );
}
