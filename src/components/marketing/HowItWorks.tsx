import { useTranslations } from 'next-intl';

export function HowItWorks() {
  const t = useTranslations('home.howItWorks');
  const steps = ['one', 'two', 'three'] as const;

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="relative rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{t(`steps.${step}.title`)}</h3>
              <p className="mt-2 text-muted-foreground">{t(`steps.${step}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
