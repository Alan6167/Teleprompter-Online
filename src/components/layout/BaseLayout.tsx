import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from './Header';
import { Footer } from './Footer';
import { ThemeProvider } from './ThemeProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { softwareApplicationJsonLd, organizationJsonLd } from '@/lib/jsonld';
import type { Locale } from '@/lib/site';

interface BaseLayoutProps {
  locale: Locale;
  children: ReactNode;
}

export async function BaseLayout({ locale, children }: BaseLayoutProps) {
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <JsonLd data={[softwareApplicationJsonLd(locale), organizationJsonLd()]} />
        <div className="flex min-h-[100dvh] flex-col">
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
