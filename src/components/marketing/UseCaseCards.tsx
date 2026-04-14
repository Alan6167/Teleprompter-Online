import { Video, Mic, Presentation, GraduationCap, Radio, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { localePath, USE_CASE_SLUGS, type Locale, type UseCaseSlug } from '@/lib/site';

const ICONS: Record<UseCaseSlug, React.ComponentType<{ className?: string }>> = {
  youtubers: Video,
  podcasters: Mic,
  presenters: Presentation,
  teachers: GraduationCap,
  streamers: Radio,
};

interface UseCaseCardsProps {
  locale: Locale;
}

export function UseCaseCards({ locale }: UseCaseCardsProps) {
  const t = useTranslations('home.useCases');
  return (
    <section className="mx-auto max-w-7xl px-3 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-balance text-muted-foreground">{t('subtitle')}</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {USE_CASE_SLUGS.map((slug) => {
          const Icon = ICONS[slug];
          return (
            <a
              key={slug}
              href={localePath(locale, `use-cases/${slug}`)}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold">{t(`items.${slug}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`items.${slug}.body`)}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                <span>{t('seeAll')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
