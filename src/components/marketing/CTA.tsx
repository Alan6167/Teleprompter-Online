import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { localePath, type Locale } from '@/lib/site';

interface CTAProps {
  locale: Locale;
}

export function CTA({ locale }: CTAProps) {
  const t = useTranslations('home.cta');
  return (
    <section className="mx-auto max-w-5xl px-3 py-16 sm:px-6 sm:py-20">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 text-center sm:p-12">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
          {t('subtitle')}
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <a href={localePath(locale)}>
              {t('button')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
