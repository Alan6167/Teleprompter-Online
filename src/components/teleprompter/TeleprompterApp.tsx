'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Maximize2,
  Minimize2,
  Settings2,
  Save,
  FolderOpen,
  Keyboard,
  FlipHorizontal,
  FlipVertical,
  Type,
  Trash2,
  ListPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useLocalScripts } from '@/hooks/useLocalScripts';
import { cn } from '@/lib/utils';

type FontFamily = 'sans' | 'serif' | 'mono';

const FONT_FAMILIES: Record<FontFamily, string> = {
  sans:
    '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  serif: '"Source Serif 4", Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", monospace',
};

const DEFAULT_SCRIPT = `Welcome to Teleprompter Online.

Paste or write your script here and press the Space bar to start.

Adjust the scroll speed and font size to match your delivery. Turn on mirror mode if you use a reflective teleprompter rig, then go fullscreen for a distraction-free read.

Your scripts are saved privately in your browser — nothing is uploaded.`;

export function TeleprompterApp() {
  const t = useTranslations('teleprompter');
  const tShortcuts = useTranslations('teleprompter.shortcuts');

  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [speed, setSpeed] = useState(80); // px/s
  const [fontSize, setFontSize] = useState(48);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [mirrorH, setMirrorH] = useState(false);
  const [mirrorV, setMirrorV] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [newScriptName, setNewScriptName] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isPlaying, progress, play, pause, stop, restart } = useTeleprompter({
    scrollRef,
    speed,
  });
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);
  const { scripts, saveScript, deleteScript, hydrated } = useLocalScripts();

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdownValue(null);
  }, []);

  const startWithCountdown = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    if (countdownSeconds <= 0) {
      play();
      return;
    }
    setCountdownValue(countdownSeconds);
    let remaining = countdownSeconds;
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        clearCountdown();
        play();
      } else {
        setCountdownValue(remaining);
        countdownTimerRef.current = setTimeout(tick, 1000);
      }
    };
    countdownTimerRef.current = setTimeout(tick, 1000);
  }, [isPlaying, pause, play, countdownSeconds, clearCountdown]);

  const stopAll = useCallback(() => {
    clearCountdown();
    stop();
  }, [clearCountdown, stop]);

  const restartAll = useCallback(() => {
    clearCountdown();
    restart();
  }, [clearCountdown, restart]);

  useEffect(() => {
    return () => clearCountdown();
  }, [clearCountdown]);

  // Hotkeys
  useHotkeys({
    Space: (e) => {
      e.preventDefault();
      startWithCountdown();
    },
    ArrowUp: (e) => {
      e.preventDefault();
      setSpeed((s) => Math.min(400, s + 10));
    },
    ArrowDown: (e) => {
      e.preventDefault();
      setSpeed((s) => Math.max(10, s - 10));
    },
    Equal: () => setFontSize((f) => Math.min(128, f + 2)),
    Minus: () => setFontSize((f) => Math.max(16, f - 2)),
    KeyM: () => setMirrorH((v) => !v),
    KeyF: () => toggleFullscreen(),
    KeyR: () => restartAll(),
    KeyS: () => setSaveDialogOpen(true),
    Escape: () => {
      if (isFullscreen) {
        // the browser already exits fullscreen on Esc, but we also stop.
        stopAll();
      }
    },
  });

  const wordCount = useMemo(() => {
    return script.trim() ? script.trim().split(/\s+/).length : 0;
  }, [script]);

  const estimatedMinutes = useMemo(() => {
    // rough: words ≈ 0.35 * fontSize height per line; use speed instead
    // Use a heuristic: at fontSize 48 and speed 80 px/s, ~= 160 wpm
    const approxWpm = (speed / fontSize) * 90;
    const mins = wordCount / Math.max(40, approxWpm);
    return Math.max(1, Math.round(mins));
  }, [wordCount, speed, fontSize]);

  const transform = useMemo(() => {
    const parts: string[] = [];
    if (mirrorH) parts.push('scaleX(-1)');
    if (mirrorV) parts.push('scaleY(-1)');
    return parts.join(' ');
  }, [mirrorH, mirrorV]);

  const onCanvasClick = useCallback(() => {
    // Tap-to-pause on mobile
    if (isPlaying) pause();
  }, [isPlaying, pause]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-black text-white shadow-xl',
        isFullscreen ? 'h-[100dvh] rounded-none' : 'h-[calc(100dvh-4rem)] min-h-[520px]'
      )}
    >
      {/* Prompter surface */}
      <div className="relative flex-1 overflow-hidden">
        {/* Center reading line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-0.5 bg-primary/60"
        />

        {/* Gradient fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black to-transparent"
        />

        {/* Scrolling text */}
        <div
          ref={scrollRef}
          onClick={onCanvasClick}
          className="no-scrollbar h-full w-full overflow-y-auto px-4 sm:px-10 md:px-16"
          style={{
            transform: transform || undefined,
            transformOrigin: 'center',
          }}
        >
          <div
            className="mx-auto max-w-4xl whitespace-pre-wrap py-[50vh] text-center"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              fontFamily: FONT_FAMILIES[fontFamily],
            }}
          >
            {script || (
              <span className="text-white/40">{t('placeholder')}</span>
            )}
          </div>
        </div>

        {/* Countdown overlay */}
        {countdownValue != null && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-sm uppercase tracking-widest text-white/70">
                {t('countdown.getReady')}
              </div>
              <div className="mt-4 text-[120px] font-bold leading-none text-white sm:text-[160px]">
                {countdownValue}
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10"
        >
          <div
            className="h-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Control Bar */}
      <div className="relative z-20 flex flex-col gap-3 border-t border-white/10 bg-black/80 p-3 backdrop-blur safe-bottom sm:gap-2 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={startWithCountdown}
            size="lg"
            className="min-w-[112px]"
            aria-label={isPlaying ? t('controls.pause') : t('controls.play')}
          >
            {isPlaying ? <Pause /> : <Play />}
            <span>{isPlaying ? t('controls.pause') : t('controls.play')}</span>
          </Button>
          <Button
            onClick={stopAll}
            variant="secondary"
            size="lg"
            aria-label={t('controls.stop')}
          >
            <Square />
            <span className="hidden sm:inline">{t('controls.stop')}</span>
          </Button>
          <Button
            onClick={restartAll}
            variant="secondary"
            size="lg"
            aria-label={t('controls.restart')}
          >
            <RotateCcw />
            <span className="hidden sm:inline">{t('controls.restart')}</span>
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => setMirrorH((v) => !v)}
              variant={mirrorH ? 'default' : 'secondary'}
              size="lg"
              aria-label={t('settings.mirrorHorizontal')}
              aria-pressed={mirrorH}
              title={t('settings.mirrorHorizontal')}
            >
              <FlipHorizontal />
              <span className="hidden md:inline">{t('settings.mirror')}</span>
            </Button>
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" size="lg" aria-label={t('controls.settings')}>
                  <Settings2 />
                  <span className="hidden md:inline">{t('controls.settings')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-md bg-background text-foreground">
                <SheetHeader>
                  <SheetTitle>{t('settings.title')}</SheetTitle>
                </SheetHeader>
                <SettingsPanel
                  speed={speed}
                  setSpeed={setSpeed}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  lineHeight={lineHeight}
                  setLineHeight={setLineHeight}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  mirrorH={mirrorH}
                  setMirrorH={setMirrorH}
                  mirrorV={mirrorV}
                  setMirrorV={setMirrorV}
                  countdownSeconds={countdownSeconds}
                  setCountdownSeconds={setCountdownSeconds}
                />
              </SheetContent>
            </Sheet>
            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size="lg"
              aria-label={isFullscreen ? t('controls.exitFullscreen') : t('controls.fullscreen')}
            >
              {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              <span className="hidden lg:inline">
                {isFullscreen ? t('controls.exitFullscreen') : t('controls.fullscreen')}
              </span>
            </Button>
          </div>
        </div>

        {/* Quick sliders */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-xs uppercase tracking-wide text-white/60">
              {t('settings.speed')}
            </label>
            <Slider
              value={[speed]}
              min={10}
              max={400}
              step={5}
              onValueChange={(v) => setSpeed(v[0])}
              aria-label={t('settings.speed')}
            />
            <span className="w-12 text-right text-xs tabular-nums text-white/70">{speed}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-xs uppercase tracking-wide text-white/60">
              {t('settings.fontSize')}
            </label>
            <Slider
              value={[fontSize]}
              min={16}
              max={128}
              step={2}
              onValueChange={(v) => setFontSize(v[0])}
              aria-label={t('settings.fontSize')}
            />
            <span className="w-12 text-right text-xs tabular-nums text-white/70">
              {fontSize}
            </span>
          </div>
        </div>
      </div>

      {/* Script editor toolbar below the prompter (sticky/collapsible area) */}
      {!isFullscreen && (
        <div className="border-t border-white/10 bg-black/70">
          <details className="group">
            <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-3 text-sm text-white/80 sm:px-4">
              <span className="inline-flex items-center gap-2 font-medium">
                <Type className="h-4 w-4" />
                {t('editor.title')}
                <span className="text-white/50">
                  · {t('editor.wordCount', { count: wordCount })} · {t('editor.estimatedTime', { minutes: estimatedMinutes })}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    setShortcutsOpen(true);
                  }}
                >
                  <Keyboard className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('controls.shortcuts')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    setSavedOpen(true);
                  }}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('controls.load')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    setSaveDialogOpen(true);
                  }}
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('controls.save')}</span>
                </Button>
              </span>
            </summary>
            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder={t('placeholder')}
                className="min-h-[160px] bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-primary"
              />
            </div>
          </details>
        </div>
      )}

      {/* Save dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('savedScripts.saveTitle')}</DialogTitle>
            <DialogDescription>{t('savedScripts.namePlaceholder')}</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={newScriptName}
            onChange={(e) => setNewScriptName(e.target.value)}
            placeholder={t('savedScripts.namePlaceholder')}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{t('savedScripts.cancel')}</Button>
            </DialogClose>
            <Button
              onClick={() => {
                saveScript(newScriptName || 'Untitled', script);
                setNewScriptName('');
                setSaveDialogOpen(false);
              }}
            >
              <Save /> {t('savedScripts.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved scripts sheet */}
      <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
        <SheetContent side="right" className="w-full max-w-md bg-background text-foreground">
          <SheetHeader>
            <SheetTitle>{t('savedScripts.title')}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {hydrated && scripts.length === 0 && (
              <p className="text-sm text-muted-foreground">{t('savedScripts.empty')}</p>
            )}
            {scripts.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {new Date(s.updatedAt).toLocaleString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setScript(s.content);
                    setSavedOpen(false);
                  }}
                >
                  <ListPlus className="h-4 w-4" />
                  {t('savedScripts.load')}
                </Button>
                <Button
                  size="iconSm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(t('savedScripts.confirmDelete'))) {
                      deleteScript(s.id);
                    }
                  }}
                  aria-label={t('savedScripts.delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Shortcuts dialog */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tShortcuts('title')}</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2 text-sm">
            <ShortcutRow keys={['Space']} label={tShortcuts('playPause')} />
            <ShortcutRow keys={['↑']} label={tShortcuts('speedUp')} />
            <ShortcutRow keys={['↓']} label={tShortcuts('speedDown')} />
            <ShortcutRow keys={['+']} label={tShortcuts('fontUp')} />
            <ShortcutRow keys={['-']} label={tShortcuts('fontDown')} />
            <ShortcutRow keys={['M']} label={tShortcuts('mirror')} />
            <ShortcutRow keys={['F']} label={tShortcuts('fullscreen')} />
            <ShortcutRow keys={['R']} label={tShortcuts('restart')} />
            <ShortcutRow keys={['S']} label={tShortcuts('save')} />
            <ShortcutRow keys={['Esc']} label={tShortcuts('exit')} />
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShortcutRow({ keys, label }: { keys: string[]; label: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs"
          >
            {k}
          </kbd>
        ))}
      </span>
    </li>
  );
}

interface SettingsPanelProps {
  speed: number;
  setSpeed: (n: number) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  lineHeight: number;
  setLineHeight: (n: number) => void;
  fontFamily: FontFamily;
  setFontFamily: (f: FontFamily) => void;
  mirrorH: boolean;
  setMirrorH: (v: boolean) => void;
  mirrorV: boolean;
  setMirrorV: (v: boolean) => void;
  countdownSeconds: number;
  setCountdownSeconds: (n: number) => void;
}

function SettingsPanel(props: SettingsPanelProps) {
  const t = useTranslations('teleprompter.settings');
  const {
    speed,
    setSpeed,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    fontFamily,
    setFontFamily,
    mirrorH,
    setMirrorH,
    mirrorV,
    setMirrorV,
    countdownSeconds,
    setCountdownSeconds,
  } = props;

  return (
    <div className="mt-6 flex flex-col gap-5 pr-2">
      <Field label={t('speed')} value={`${speed} px/s`}>
        <Slider value={[speed]} min={10} max={400} step={5} onValueChange={(v) => setSpeed(v[0])} />
      </Field>
      <Field label={t('fontSize')} value={`${fontSize} px`}>
        <Slider value={[fontSize]} min={16} max={128} step={2} onValueChange={(v) => setFontSize(v[0])} />
      </Field>
      <Field label={t('lineHeight')} value={lineHeight.toFixed(2)}>
        <Slider
          value={[lineHeight * 100]}
          min={100}
          max={240}
          step={5}
          onValueChange={(v) => setLineHeight(v[0] / 100)}
        />
      </Field>

      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t('fontFamily')}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['sans', 'serif', 'mono'] as FontFamily[]).map((f) => (
            <Button
              key={f}
              variant={fontFamily === f ? 'default' : 'outline'}
              onClick={() => setFontFamily(f)}
              className="capitalize"
            >
              {t(f === 'sans' ? 'fontSans' : f === 'serif' ? 'fontSerif' : 'fontMono')}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={mirrorH ? 'default' : 'outline'}
          onClick={() => setMirrorH(!mirrorH)}
          aria-pressed={mirrorH}
        >
          <FlipHorizontal className="h-4 w-4" />
          {t('mirrorHorizontal')}
        </Button>
        <Button
          variant={mirrorV ? 'default' : 'outline'}
          onClick={() => setMirrorV(!mirrorV)}
          aria-pressed={mirrorV}
        >
          <FlipVertical className="h-4 w-4" />
          {t('mirrorVertical')}
        </Button>
      </div>

      <Field label={t('countdown')} value={t('countdownSeconds', { seconds: countdownSeconds })}>
        <Slider
          value={[countdownSeconds]}
          min={0}
          max={10}
          step={1}
          onValueChange={(v) => setCountdownSeconds(v[0])}
        />
      </Field>
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
