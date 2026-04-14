import { useTranslations } from 'next-intl';

export function Intro() {
  const t = useTranslations('home.intro');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section className="mx-auto max-w-4xl px-3 py-16 sm:px-6 sm:py-20">
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
