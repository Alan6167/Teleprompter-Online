import {
  Zap,
  Sliders,
  FlipHorizontal,
  Maximize2,
  Keyboard,
  Save,
  Smartphone,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FeatureItem {
  key:
    | 'instant'
    | 'speedFont'
    | 'mirror'
    | 'fullscreen'
    | 'shortcuts'
    | 'savedScripts'
    | 'mobile'
    | 'privacy';
  icon: LucideIcon;
}

const items: FeatureItem[] = [
  { key: 'instant', icon: Zap },
  { key: 'speedFont', icon: Sliders },
  { key: 'mirror', icon: FlipHorizontal },
  { key: 'fullscreen', icon: Maximize2 },
  { key: 'shortcuts', icon: Keyboard },
  { key: 'savedScripts', icon: Save },
  { key: 'mobile', icon: Smartphone },
  { key: 'privacy', icon: Shield },
];

export function FeatureGrid() {
  const t = useTranslations('home.features');
  return (
    <section className="mx-auto max-w-7xl px-3 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-balance text-muted-foreground">{t('subtitle')}</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold">{t(`items.${key}.title`)}</h3>
            <p className="text-sm text-muted-foreground">{t(`items.${key}.body`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
