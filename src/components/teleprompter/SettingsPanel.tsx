'use client';

import { useTranslations } from 'next-intl';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  BACKGROUND_COLORS,
  FONT_SIZE_RANGE,
  SPEED_RANGE,
  TEXT_COLORS,
  type Alignment,
  type FontFamily,
  type PrompterSettings,
} from '@/lib/prompter';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  settings: PrompterSettings;
  update: <K extends keyof PrompterSettings>(key: K, value: PrompterSettings[K]) => void;
  reset: () => void;
}

export function SettingsPanel({ settings, update, reset }: SettingsPanelProps) {
  const t = useTranslations('teleprompter.settings');

  const alignments: Array<{ value: Alignment; label: string; Icon: typeof AlignLeft }> = [
    { value: 'left', label: t('alignLeft'), Icon: AlignLeft },
    { value: 'center', label: t('alignCenter'), Icon: AlignCenter },
    { value: 'right', label: t('alignRight'), Icon: AlignRight },
  ];

  return (
    <div className="mt-6 flex flex-col gap-5 overflow-y-auto pb-8 pr-2">
      <Field label={t('speed')} value={`${settings.speed} px/s`}>
        <Slider
          value={[settings.speed]}
          min={SPEED_RANGE.min}
          max={SPEED_RANGE.max}
          step={SPEED_RANGE.step}
          onValueChange={(v) => update('speed', v[0])}
          aria-label={t('speed')}
        />
      </Field>

      <Field label={t('fontSize')} value={`${settings.fontSize} px`}>
        <Slider
          value={[settings.fontSize]}
          min={FONT_SIZE_RANGE.min}
          max={FONT_SIZE_RANGE.max}
          step={FONT_SIZE_RANGE.step}
          onValueChange={(v) => update('fontSize', v[0])}
          aria-label={t('fontSize')}
        />
      </Field>

      <Field label={t('lineHeight')} value={settings.lineHeight.toFixed(2)}>
        <Slider
          value={[settings.lineHeight * 100]}
          min={100}
          max={240}
          step={5}
          onValueChange={(v) => update('lineHeight', v[0] / 100)}
          aria-label={t('lineHeight')}
        />
      </Field>

      <div>
        <SectionLabel>{t('fontFamily')}</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {(['sans', 'serif', 'mono'] as FontFamily[]).map((f) => (
            <Button
              key={f}
              variant={settings.fontFamily === f ? 'default' : 'outline'}
              onClick={() => update('fontFamily', f)}
              aria-pressed={settings.fontFamily === f}
            >
              {t(f === 'sans' ? 'fontSans' : f === 'serif' ? 'fontSerif' : 'fontMono')}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>{t('alignment')}</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {alignments.map(({ value, label, Icon }) => (
            <Button
              key={value}
              variant={settings.alignment === value ? 'default' : 'outline'}
              onClick={() => update('alignment', value)}
              aria-pressed={settings.alignment === value}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <ColorField
        label={t('textColor')}
        customLabel={t('custom')}
        value={settings.textColor}
        presets={TEXT_COLORS}
        onChange={(c) => update('textColor', c)}
      />

      <ColorField
        label={t('backgroundColor')}
        customLabel={t('custom')}
        value={settings.backgroundColor}
        presets={BACKGROUND_COLORS}
        onChange={(c) => update('backgroundColor', c)}
      />

      <div>
        <SectionLabel>{t('mirror')}</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={settings.mirrorH ? 'default' : 'outline'}
            onClick={() => update('mirrorH', !settings.mirrorH)}
            aria-pressed={settings.mirrorH}
          >
            <FlipHorizontal className="h-4 w-4" />
            {t('mirrorHorizontal')}
          </Button>
          <Button
            variant={settings.mirrorV ? 'default' : 'outline'}
            onClick={() => update('mirrorV', !settings.mirrorV)}
            aria-pressed={settings.mirrorV}
          >
            <FlipVertical className="h-4 w-4" />
            {t('mirrorVertical')}
          </Button>
        </div>
      </div>

      <Field
        label={t('countdown')}
        value={t('countdownSeconds', { seconds: settings.countdownSeconds })}
      >
        <Slider
          value={[settings.countdownSeconds]}
          min={0}
          max={10}
          step={1}
          onValueChange={(v) => update('countdownSeconds', v[0])}
          aria-label={t('countdown')}
        />
      </Field>

      <Button variant="ghost" onClick={reset} className="mt-1 self-start">
        <RotateCcw className="h-4 w-4" />
        {t('reset')}
      </Button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        {value && <span className="font-mono text-foreground">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function ColorField({
  label,
  customLabel,
  value,
  presets,
  onChange,
}: {
  label: string;
  customLabel: string;
  value: string;
  presets: readonly string[];
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((color) => {
          const active = value.toUpperCase() === color.toUpperCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              aria-pressed={active}
              style={{ backgroundColor: color }}
              className={cn(
                'h-9 w-9 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                active
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-border hover:border-muted-foreground'
              )}
            />
          );
        })}
        <label className="ml-1 inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground hover:border-muted-foreground">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
            aria-label={customLabel}
          />
          <span>{customLabel}</span>
        </label>
      </div>
    </div>
  );
}
