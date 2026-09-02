import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/marketing/CTA';
import type { Locale } from '@/lib/site';

interface ContentPageProps {
  locale: Locale;
  /** Translation namespace holding `title`, `subtitle` and a `sections` array. */
  namespace: string;
  /** Rendered between the last section and the closing call to action. */
  children?: React.ReactNode;
  showCta?: boolean;
}

/**
 * The shared shape behind the site's prose pages (About, Contact and friends):
 * a centred header, then a stack of titled sections read straight from translations.
 */
export async function ContentPage({
  locale,
  namespace,
  children,
  showCta = true,
}: ContentPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace });
  const sections = t.raw('sections') as Array<{ title: string; body: string }>;

  return (
    <div className="bg-background">
      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {t('subtitle')}
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
        {children}
      </main>

      {showCta && <CTA locale={locale} />}
    </div>
  );
}
