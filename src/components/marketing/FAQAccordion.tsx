'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQAccordion({ items, title, subtitle }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-3 py-16 sm:px-6 sm:py-20">
      {title && (
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-balance text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
        {items.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium transition-colors hover:bg-accent/50"
              aria-expanded={open === i}
            >
              <span>{item.q}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform',
                  open === i && 'rotate-180'
                )}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-muted-foreground">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
