'use client';

import { Globe, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LOCALES, LOCALE_NAMES, type Locale, DEFAULT_LOCALE } from '@/lib/site';

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

/**
 * Build the equivalent path in the target locale.
 * Strip the existing locale prefix if present, then re-prefix for the target.
 */
function buildTargetPath(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  const isFirstLocale = (LOCALES as readonly string[]).includes(first);
  const rest = isFirstLocale ? segments.slice(1) : segments;
  const prefix = target === DEFAULT_LOCALE ? '' : `/${target}`;
  const suffix = rest.length > 0 ? `/${rest.join('/')}/` : '/';
  return `${prefix}${suffix}`;
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const t = useTranslations('common');
  const pathname = usePathname() || '/';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t('changeLanguage')}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{LOCALE_NAMES[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuLabel>{t('changeLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((locale) => {
          const href = buildTargetPath(pathname, locale);
          return (
            <DropdownMenuItem key={locale} asChild>
              <a
                href={href}
                className="flex w-full items-center justify-between gap-2"
                hrefLang={locale}
              >
                <span>{LOCALE_NAMES[locale]}</span>
                {locale === currentLocale && <Check className="h-4 w-4 text-primary" />}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
