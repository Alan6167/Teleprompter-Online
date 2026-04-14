'use client';

import { useState } from 'react';
import { Menu, Mic } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { localePath, type Locale } from '@/lib/site';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const navItems: Array<{ key: string; href: string }> = [
    { key: 'features', href: localePath(locale, 'features') },
    { key: 'howToUse', href: localePath(locale, 'how-to-use') },
    { key: 'useCases', href: localePath(locale, 'use-cases') },
    { key: 'faq', href: localePath(locale, 'faq') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur safe-top">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:px-6">
        <a
          href={localePath(locale)}
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label={t('common.brand')}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Mic className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{t('common.brand')}</span>
        </a>

        <nav className="mx-2 hidden flex-1 items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LocaleSwitcher currentLocale={locale} />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="iconSm"
                className="md:hidden"
                aria-label={t('common.openMenu')}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>{t('common.brand')}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
