'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
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
  Mic,
  MicOff,
  Type,
  Trash2,
  ListPlus,
  Upload,
  FileText,
  X,
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
import { SettingsPanel } from './SettingsPanel';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useLocalScripts } from '@/hooks/useLocalScripts';
import { usePersistentState } from '@/hooks/usePersistentState';
import { tokenizeScript, useVoiceScroll } from '@/hooks/useVoiceScroll';
import { formatDuration, useReadingEstimate } from '@/hooks/useReadingEstimate';
import {
  DEFAULT_SETTINGS,
  FONT_FAMILIES,
  FONT_SIZE_RANGE,
  SPEED_RANGE,
  countWords,
  reviveDraft,
  reviveSettings,
  type PrompterSettings,
} from '@/lib/prompter';
import {
  ACCEPTED_FILE_TYPES,
  ScriptImportError,
  importScriptFile,
  type ImportErrorReason,
} from '@/lib/script-import';
import { cn } from '@/lib/utils';

const SETTINGS_KEY = 'tpo:settings';
const DRAFT_KEY = 'tpo:draft';
/** Target words-per-minute handed over by the script timer, consumed once. */
const PACE_KEY = 'tpo:pace';

export function TeleprompterApp() {
  const t = useTranslations('teleprompter');
  const tShortcuts = useTranslations('teleprompter.shortcuts');
  const locale = useLocale();

  const [settings, setSettings] = usePersistentState<PrompterSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
    { revive: reviveSettings }
  );
  const [script, setScript] = usePersistentState<string>(DRAFT_KEY, t('defaultScript'), {
    revive: reviveDraft,
    debounceMs: 600,
  });

  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [newScriptName, setNewScriptName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [importError, setImportError] = useState<ImportErrorReason | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isPlaying, progress, play, pause, stop, restart } = useTeleprompter({
    scrollRef,
    speed: settings.speed,
  });
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);
  const { scripts, saveScript, deleteScript, hydrated } = useLocalScripts();

  const update = useCallback(
    <K extends keyof PrompterSettings>(key: K, value: PrompterSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), [setSettings]);

  // --- Voice-following scroll -------------------------------------------------
  const scriptWords = useMemo(() => tokenizeScript(script), [script]);

  const scrollToWord = useCallback((wordIndex: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`[data-word="${wordIndex}"]`);
    if (!el) return;

    // Rect maths rather than offsetTop: the text block is not the container's
    // offsetParent, and this stays correct whatever the mirror transform is doing.
    const containerRect = container.getBoundingClientRect();
    const wordRect = el.getBoundingClientRect();
    const delta =
      wordRect.top + wordRect.height / 2 - (containerRect.top + containerRect.height / 2);

    if (Math.abs(delta) < 8) return; // already on the reading line
    container.scrollTo({ top: container.scrollTop + delta, behavior: 'smooth' });
  }, []);

  const {
    status: voiceStatus,
    supported: voiceSupported,
    resetCursor: resetVoiceCursor,
  } = useVoiceScroll({
    enabled: voiceEnabled,
    locale,
    scriptWords,
    onPosition: scrollToWord,
  });

  useEffect(() => {
    if (voiceStatus === 'denied' || voiceStatus === 'unsupported' || voiceStatus === 'error') {
      setVoiceEnabled(false);
    }
  }, [voiceStatus]);

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdownValue(null);
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((on) => {
      if (!on) {
        // Voice following replaces timed scrolling — running both fights for the scrollbar.
        clearCountdown();
        pause();
        resetVoiceCursor();
      }
      return !on;
    });
  }, [clearCountdown, pause, resetVoiceCursor]);

  const startWithCountdown = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    setVoiceEnabled(false);
    if (settings.countdownSeconds <= 0) {
      play();
      return;
    }
    setCountdownValue(settings.countdownSeconds);
    let remaining = settings.countdownSeconds;
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
  }, [isPlaying, pause, play, settings.countdownSeconds, clearCountdown]);

  const stopAll = useCallback(() => {
    clearCountdown();
    resetVoiceCursor();
    stop();
  }, [clearCountdown, resetVoiceCursor, stop]);

  const restartAll = useCallback(() => {
    clearCountdown();
    resetVoiceCursor();
    restart();
  }, [clearCountdown, resetVoiceCursor, restart]);

  useEffect(() => {
    return () => clearCountdown();
  }, [clearCountdown]);

  useHotkeys({
    Space: (e) => {
      e.preventDefault();
      startWithCountdown();
    },
    ArrowUp: (e) => {
      e.preventDefault();
      setSettings((s) => ({ ...s, speed: Math.min(SPEED_RANGE.max, s.speed + 10) }));
    },
    ArrowDown: (e) => {
      e.preventDefault();
      setSettings((s) => ({ ...s, speed: Math.max(SPEED_RANGE.min, s.speed - 10) }));
    },
    Equal: () =>
      setSettings((s) => ({ ...s, fontSize: Math.min(FONT_SIZE_RANGE.max, s.fontSize + 2) })),
    Minus: () =>
      setSettings((s) => ({ ...s, fontSize: Math.max(FONT_SIZE_RANGE.min, s.fontSize - 2) })),
    KeyM: () => setSettings((s) => ({ ...s, mirrorH: !s.mirrorH })),
    KeyF: () => toggleFullscreen(),
    KeyR: () => restartAll(),
    KeyS: () => setSaveDialogOpen(true),
    KeyV: () => toggleVoice(),
    Escape: () => {
      if (isFullscreen) {
        // The browser already exits fullscreen on Esc; stop playback to match.
        stopAll();
      }
    },
  });

  const wordCount = useMemo(() => countWords(script), [script]);

  // Measured from the rendered text rather than estimated: how far the script has to
  // travel is the only thing that makes a px/s speed mean anything.
  const { seconds: readingSeconds, wordsPerMinute, textHeight } = useReadingEstimate(
    textBlockRef,
    { speed: settings.speed, wordCount }
  );

  // The script timer can hand over a script together with the pace it was planned at.
  // Words per minute survives the trip between pages; a scroll speed would not, because
  // how far the text has to travel depends on this screen's width.
  const [targetWpm, setTargetWpm] = useState<number | null>(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PACE_KEY);
      if (raw == null) return;
      window.localStorage.removeItem(PACE_KEY);
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'number' && Number.isFinite(parsed) && parsed > 0) {
        setTargetWpm(parsed);
      }
    } catch {
      // No handover pending.
    }
  }, []);

  // Solve for the speed that delivers the requested pace, and keep solving until the
  // measurement settles: the restored draft arrives a tick after mount, so the first
  // height seen here belongs to the previous script and would set the pace against the
  // wrong text.
  useEffect(() => {
    if (targetWpm == null) return;
    if (textHeight <= 0 || wordCount <= 0) return;
    const durationSeconds = (wordCount / targetWpm) * 60;
    const desired = Math.min(
      SPEED_RANGE.max,
      Math.max(SPEED_RANGE.min, Math.round(textHeight / durationSeconds))
    );
    if (desired === settings.speed) {
      setTargetWpm(null);
      return;
    }
    setSettings((prev) => ({ ...prev, speed: desired }));
  }, [targetWpm, textHeight, wordCount, settings.speed, setSettings]);

  const transform = useMemo(() => {
    const parts: string[] = [];
    if (settings.mirrorH) parts.push('scaleX(-1)');
    if (settings.mirrorV) parts.push('scaleY(-1)');
    return parts.join(' ');
  }, [settings.mirrorH, settings.mirrorV]);

  const onCanvasClick = useCallback(() => {
    // Tap the reading surface to pause, tap again to pick straight back up: on a phone
    // clamped near the lens the control bar is often out of reach mid-take.
    if (voiceEnabled) return;
    if (isPlaying) {
      pause();
    } else {
      clearCountdown();
      play();
    }
  }, [voiceEnabled, isPlaying, pause, play, clearCountdown]);

  // --- File import ------------------------------------------------------------
  const loadTextFromFile = useCallback(
    async (file: File) => {
      setImportError(null);
      try {
        const text = await importScriptFile(file);
        setScript(text);
        setUploadedFileName(file.name);
      } catch (error) {
        setUploadedFileName(null);
        setImportError(error instanceof ScriptImportError ? error.reason : 'failed');
      }
    },
    [setScript]
  );

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadTextFromFile(file);
      // Allow re-uploading the same file.
      if (e.target) e.target.value = '';
    },
    [loadTextFromFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const onDragLeave = useCallback(() => setIsDragOver(false), []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) loadTextFromFile(file);
    },
    [loadTextFromFile]
  );

  const clearScript = useCallback(() => {
    setScript('');
    setUploadedFileName(null);
    setImportError(null);
  }, [setScript]);

  // Word-level spans are only needed while the recognizer is driving the scroll; a long
  // script is thousands of extra nodes otherwise.
  const renderedScript = useMemo(() => {
    if (!voiceEnabled) return script;
    let index = -1;
    return script.split(/(\s+)/).map((part, i) => {
      if (!part || /^\s+$/.test(part)) return part;
      index += 1;
      return (
        <span key={i} data-word={index}>
          {part}
        </span>
      );
    });
  }, [voiceEnabled, script]);

  const fade = (direction: 'to bottom' | 'to top') => ({
    background: `linear-gradient(${direction}, ${settings.backgroundColor}, transparent)`,
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full flex-col overflow-hidden rounded-2xl border border-border text-white shadow-xl',
        isFullscreen ? 'h-[100dvh] rounded-none' : 'h-[calc(100dvh-4rem)] min-h-[520px]'
      )}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Prompter surface */}
      <div className="relative flex-1 overflow-hidden">
        {/* Center reading line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-0.5 bg-primary/60"
        />

        {/* Gradient fades */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16" style={fade('to bottom')} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16" style={fade('to top')} />

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
            ref={textBlockRef}
            className="mx-auto max-w-4xl whitespace-pre-wrap py-[50vh]"
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
              fontFamily: FONT_FAMILIES[settings.fontFamily],
              color: settings.textColor,
              textAlign: settings.alignment,
            }}
          >
            {script ? renderedScript : <span style={{ opacity: 0.4 }}>{t('placeholder')}</span>}
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

        {/* Listening badge */}
        {voiceEnabled && (
          <div className="pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t('voice.listening')}
          </div>
        )}

        {/* Progress bar */}
        <div aria-hidden className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10">
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
          <Button onClick={stopAll} variant="secondary" size="lg" aria-label={t('controls.stop')}>
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
            {voiceSupported && (
              <Button
                onClick={toggleVoice}
                variant={voiceEnabled ? 'default' : 'secondary'}
                size="lg"
                aria-label={t('voice.toggle')}
                aria-pressed={voiceEnabled}
                title={t('voice.toggle')}
              >
                {voiceEnabled ? <Mic /> : <MicOff />}
                <span className="hidden md:inline">{t('voice.label')}</span>
              </Button>
            )}
            <Button
              onClick={() => update('mirrorH', !settings.mirrorH)}
              variant={settings.mirrorH ? 'default' : 'secondary'}
              size="lg"
              aria-label={t('settings.mirrorHorizontal')}
              aria-pressed={settings.mirrorH}
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
              <SheetContent
                side="right"
                className="flex w-full max-w-md flex-col bg-background text-foreground"
              >
                <SheetHeader>
                  <SheetTitle>{t('settings.title')}</SheetTitle>
                </SheetHeader>
                <SettingsPanel settings={settings} update={update} reset={resetSettings} />
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
              value={[settings.speed]}
              min={SPEED_RANGE.min}
              max={SPEED_RANGE.max}
              step={SPEED_RANGE.step}
              onValueChange={(v) => update('speed', v[0])}
              aria-label={t('settings.speed')}
            />
            <span className="w-20 text-right text-xs tabular-nums text-white/70">
              {wordsPerMinute > 0
                ? t('settings.wpmShort', { wpm: Math.round(wordsPerMinute) })
                : settings.speed}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-xs uppercase tracking-wide text-white/60">
              {t('settings.fontSize')}
            </label>
            <Slider
              value={[settings.fontSize]}
              min={FONT_SIZE_RANGE.min}
              max={FONT_SIZE_RANGE.max}
              step={FONT_SIZE_RANGE.step}
              onValueChange={(v) => update('fontSize', v[0])}
              aria-label={t('settings.fontSize')}
            />
            <span className="w-12 text-right text-xs tabular-nums text-white/70">
              {settings.fontSize}
            </span>
          </div>
        </div>
      </div>

      {/* Script editor — always visible (except in fullscreen) */}
      {!isFullscreen && (
        <div className="border-t border-white/10 bg-black/70">
          <div className="px-3 pt-3 sm:px-4 sm:pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-white/90">
                <Type className="h-4 w-4" />
                {t('editor.title')}
                <span className="text-white/50">
                  · {t('editor.wordCount', { count: wordCount })} ·{' '}
                  {t('editor.readingTime', { duration: formatDuration(readingSeconds) })}
                </span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={onFileInputChange}
                  className="sr-only"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={t('editor.uploadFile')}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('editor.uploadFile')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setSavedOpen(true)}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('controls.load')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setSaveDialogOpen(true)}
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('controls.save')}</span>
                </Button>
                {script && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      if (confirm(t('editor.confirmClear'))) clearScript();
                    }}
                    aria-label={t('editor.clear')}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden md:inline">{t('editor.clear')}</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setShortcutsOpen(true)}
                >
                  <Keyboard className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('controls.shortcuts')}</span>
                </Button>
              </div>
            </div>

            {uploadedFileName && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                <FileText className="h-3.5 w-3.5" />
                <span>{uploadedFileName}</span>
                <button
                  type="button"
                  onClick={() => setUploadedFileName(null)}
                  className="ml-1 rounded-sm p-0.5 hover:bg-white/10"
                  aria-label={t('editor.dismiss')}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {importError && (
              <p role="alert" className="mt-2 text-xs text-red-300">
                {t(`editor.importError.${importError}`)}
              </p>
            )}

            {voiceStatus === 'denied' && (
              <p role="alert" className="mt-2 text-xs text-red-300">
                {t('voice.denied')}
              </p>
            )}
          </div>

          {/* Textarea with drag-and-drop */}
          <div className="relative px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={cn(
                'relative rounded-md transition-all',
                isDragOver && 'ring-2 ring-primary ring-offset-2 ring-offset-black'
              )}
            >
              <Textarea
                value={script}
                onChange={(e) => {
                  setScript(e.target.value);
                  if (uploadedFileName) setUploadedFileName(null);
                  if (importError) setImportError(null);
                }}
                placeholder={t('editor.placeholderWithUpload')}
                className="min-h-[180px] resize-y bg-white/5 text-base leading-relaxed text-white placeholder:text-white/40 focus-visible:ring-primary sm:min-h-[200px]"
              />
              {isDragOver && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-primary/20 text-white">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">{t('editor.dropHere')}</span>
                  </div>
                </div>
              )}
            </div>
            {!script && (
              <p className="mt-2 text-center text-xs text-white/50">{t('editor.uploadHint')}</p>
            )}
          </div>
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
          <div className="mt-6 space-y-3 overflow-y-auto">
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
            <ShortcutRow keys={['V']} label={tShortcuts('voice')} />
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
