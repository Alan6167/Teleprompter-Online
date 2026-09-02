import { Check, Minus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { CTA } from '@/components/marketing/CTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { ALTERNATIVES, getAlternative } from '@/lib/alternatives';
import { DEFAULT_LOCALE, SITE_NAME, localePath } from '@/lib/site';

export function AlternativePage({ slug }: { slug: string }) {
  const item = getAlternative(slug);
  if (!item) notFound();

  const others = ALTERNATIVES.filter((a) => a.slug !== slug);

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbJsonLd(DEFAULT_LOCALE, [
          { name: 'Comparisons', path: 'alternatives' },
          { name: item.title, path: `alternatives/${item.slug}` },
        ])}
      />

      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {item.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-12 sm:px-6 sm:py-16">
        <div className="space-y-5 text-lg leading-8">
          {item.intro.map((paragraph, i) => (
            <p key={i} className={i === 0 ? undefined : 'text-muted-foreground'}>
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">{item.strengths.heading}</h2>
          {item.strengths.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-4 leading-8 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">{item.differences.heading}</h2>
          {item.differences.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-4 leading-8 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Side by side</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th scope="col" className="p-4 font-semibold">
                    Feature
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    {item.competitor}
                  </th>
                  <th scope="col" className="p-4 font-semibold text-primary">
                    {SITE_NAME}
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <th scope="row" className="p-4 text-left font-medium">
                      {row.feature}
                    </th>
                    <td className="p-4 text-muted-foreground">{row.them}</td>
                    <td className="p-4">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Compiled {new Date(item.updatedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            . Other products change their features and pricing without telling us — check
            their current terms before deciding.
          </p>
        </section>

        <section className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Pick {item.competitor} if…</h2>
            <ul className="mt-4 space-y-3">
              {item.chooseThem.map((reason, i) => (
                <li key={i} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <Minus className="mt-1 h-4 w-4 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6">
            <h2 className="text-lg font-semibold">Pick {SITE_NAME} if…</h2>
            <ul className="mt-4 space-y-3">
              {item.chooseUs.map((reason, i) => (
                <li key={i} className="flex gap-3 text-sm leading-6">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {others.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-lg font-semibold">Other comparisons</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {others.map((other) => (
                <li key={other.slug}>
                  <a
                    href={localePath(DEFAULT_LOCALE, `alternatives/${other.slug}`)}
                    className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    vs {other.competitor}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <CTA locale={DEFAULT_LOCALE} />
    </div>
  );
}
