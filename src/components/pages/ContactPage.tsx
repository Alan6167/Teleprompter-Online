import { Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ContentPage } from './ContentPage';
import { CONTACT_EMAIL } from '@/lib/site';
import type { Locale } from '@/lib/site';

export async function ContactPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <ContentPage locale={locale} namespace="contact">
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <Mail className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">{t('emailLabel')}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-1 inline-block break-all text-lg font-semibold text-primary hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </ContentPage>
  );
}
