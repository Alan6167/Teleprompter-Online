'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { countWords } from '@/lib/prompter';
import { localePath, type Locale } from '@/lib/site';
import { cn } from '@/lib/utils';

/** Words per minute for the three deliveries people actually ask about. */
const PACES = [
  { key: 'slow', wpm: 110 },
  { key: 'conversational', wpm: 140 },
  { key: 'fast', wpm: 170 },
] as const;

const DRAFT_KEY = 'tpo:draft';
const PACE_KEY = 'tpo:pace';

export function ScriptTimer({ locale }: { locale: Locale }) {
  const t = useTranslations('scriptTimer');
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(140);

  const words = useMemo(() => countWords(text), [text]);
  const characters = text.length;

  const totalSeconds = useMemo(() => (words === 0 ? 0 : (words / wpm) * 60), [words, wpm]);

  const duration = useMemo(() => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    // Rounding seconds up to 60 would render as "2:60".
    if (seconds === 60) return { minutes: minutes + 1, seconds: 0 };
    return { minutes, seconds };
  }, [totalSeconds]);

  /**
   * Hand the script to the prompter through the same storage key the prompter restores
   * its draft from, then navigate. Keeps the text on the device — a query string would
   * put it in history, and in analytics referrers.
   *
   * The chosen pace goes with it. A words-per-minute figure is portable in a way a scroll
   * speed is not: px/s depends on how many words fit on a line, which changes with screen
   * width, so the prompter solves for the right speed once it has measured its own layout.
   */
  const openInPrompter = () => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(text));
      window.localStorage.setItem(PACE_KEY, JSON.stringify(wpm));
    } catch {
      // Storage unavailable — still navigate; the reader can paste it themselves.
    }
    window.location.href = localePath(locale);
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <label htmlFor="script-timer-input" className="sr-only">
          {t('inputLabel')}
        </label>
        <Textarea
          id="script-timer-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('placeholder')}
          className="min-h-[320px] resize-y text-base leading-relaxed"
        />
      </div>

      <aside className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Timer className="h-4 w-4 text-primary" />
            {t('durationLabel')}
          </div>
          <p className="mt-2 text-4xl font-bold tabular-nums">
            {duration.minutes}
            <span className="text-muted-foreground">:</span>
            {String(duration.seconds).padStart(2, '0')}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-y border-border py-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('wordsLabel')}
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{words}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('charactersLabel')}
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{characters}</dd>
          </div>
        </dl>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
            <span>{t('wpmLabel')}</span>
            <span className="font-mono text-foreground">{wpm}</span>
          </div>
          <Slider
            value={[wpm]}
            min={80}
            max={220}
            step={5}
            onValueChange={(v) => setWpm(v[0])}
            aria-label={t('wpmLabel')}
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {PACES.map((pace) => (
              <button
                key={pace.key}
                type="button"
                onClick={() => setWpm(pace.wpm)}
                aria-pressed={wpm === pace.wpm}
                className={cn(
                  'rounded-md border px-2 py-1.5 text-xs transition-colors',
                  wpm === pace.wpm
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-muted-foreground'
                )}
              >
                {t(`pace.${pace.key}`)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">{t('scrollHint')}</p>

        <Button onClick={openInPrompter} disabled={!text.trim()} className="w-full">
          {t('openInPrompter')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </aside>
    </div>
  );
}
