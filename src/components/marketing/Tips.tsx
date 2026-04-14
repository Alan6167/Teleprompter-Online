import {
  Timer,
  PenLine,
  AlignCenter,
  FlipHorizontal,
  Eye,
  Film,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const ICONS: LucideIcon[] = [Timer, PenLine, AlignCenter, FlipHorizontal, Eye, Film];

export function Tips() {
  const t = useTranslations('home.tips');
  const items = t.raw('items') as Array<{ title: string; body: string }>;

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
